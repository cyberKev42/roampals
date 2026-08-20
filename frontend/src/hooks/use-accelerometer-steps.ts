import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { Accelerometer, Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStepsStore } from '@/src/stores/useStepsStore';
import { saveStepsToBackend } from '@/src/api/walk';

const SAMPLING_INTERVAL_MS = 20; // 50Hz sampling
const COOL_DOWN_MS = 450;         // ~300ms human step limit

// Low Pass Filter CONFIGURATION
const ALPHA = 0.98;             // Update device orientation (high = slow)
const STEP_THRESHOLD = 0.4;     // Sensitivity

// TODO: derive from the user's currently activated collected item once the item system exists
const VIRTUAL_STEP_MULTIPLIER = 1;

export const LAST_CLOSED_KEY = 'last_closed_timestamp_accelerometer';
const STEPS_BUFFER_KEY = 'steps_buffer';

const WARM_UP_MS = 500;

export const toLocalDateString = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export function useAccelerometerSteps(enabled: boolean) {
  const steps = useStepsStore((state) => state.steps);
  const appState = useRef(AppState.currentState);

  const lastStepTime = useRef(0);
  const stepsBuffer = useRef(0);
  const virtualStepsBuffer = useRef(0);
  const trackingDate = useRef('');

  // References to persist the moving gravity baseline across 50Hz ticks
  const gravityX = useRef(0);
  const gravityY = useRef(0);
  const gravityZ = useRef(0);
  const isGravityInitialized = useRef(false);
  const trackingStartTime = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    // Buffers live in refs, so an app kill would reset them to 0 and the next
    // absolute-overwrite POST would clobber the higher count already saved on the
    // backend. Persisting on every change lets restoreBuffers() rehydrate on launch.
    const persistBuffers = () => {
      AsyncStorage.setItem(
        STEPS_BUFFER_KEY,
        JSON.stringify({
          date: trackingDate.current,
          steps: stepsBuffer.current,
          virtualSteps: virtualStepsBuffer.current,
        })
      ).catch(() => {});
    };

    const restoreBuffers = async () => {
      try {
        const raw = await AsyncStorage.getItem(STEPS_BUFFER_KEY);
        if (!raw) return;
        const saved = JSON.parse(raw);
        if (!saved?.date) return;
        stepsBuffer.current = saved.steps ?? 0;
        virtualStepsBuffer.current = saved.virtualSteps ?? 0;
        trackingDate.current = saved.date;
        useStepsStore.getState().setSteps(stepsBuffer.current);
        useStepsStore.getState().setVirtualSteps(virtualStepsBuffer.current);
      } catch {
        // Corrupt entry — start fresh rather than crash step tracking.
      }
    };

    const addSteps = (count: number, timestamp?: number) => {
      stepsBuffer.current += count;
      virtualStepsBuffer.current += count * VIRTUAL_STEP_MULTIPLIER;
      useStepsStore.getState().setSteps(stepsBuffer.current);
      useStepsStore.getState().setVirtualSteps(virtualStepsBuffer.current);
      if (timestamp !== undefined) {
        useStepsStore.getState().setLastStepAt(timestamp);
      }
      persistBuffers();
    };

    const flushAndResetForNewDay = (newDate: string) => {
      if (stepsBuffer.current > 0 || virtualStepsBuffer.current > 0) {
        saveStepsToBackend(stepsBuffer.current, virtualStepsBuffer.current, trackingDate.current).catch((error) =>
          console.error('Failed to flush steps at day rollover:', error)
        );
      }
      stepsBuffer.current = 0;
      virtualStepsBuffer.current = 0;
      useStepsStore.getState().reset();
      trackingDate.current = newDate;
      persistBuffers();
    };

    let accelerometerSubscription: ReturnType<typeof Accelerometer.addListener> | null = null;

    const catchUpHistoricalSteps = async () => {
      const { status } = await Pedometer.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Pedometer permission not granted:', status);
        return;
      }

      const isPedometerAvailable = await Pedometer.isAvailableAsync();
      if (!isPedometerAvailable) return;

      const lastSyncStr = await AsyncStorage.getItem(LAST_CLOSED_KEY);
      if (!lastSyncStr) {
        await AsyncStorage.setItem(LAST_CLOSED_KEY, Date.now().toString());
        // Don't clobber a date restored from a persisted buffer.
        if (!trackingDate.current) trackingDate.current = toLocalDateString(new Date());
        return;
      }

      const findLastCatchUpSpawn = (oldV: number, newV: number) => {
        const { spawnConditions } = useStepsStore.getState();
        const matches = spawnConditions.filter(
          (cond) => cond.requiredSteps > oldV && cond.requiredSteps <= newV
        );
        if (matches.length === 0) return null;
        const top = matches.reduce((a, b) => (b.requiredSteps > a.requiredSteps ? b : a));
        return top.type === 'CREATURE'
          ? { type: 'CREATURE' as const, creatureId: top.creatureId }
          : { type: 'ITEM' as const, itemId: top.itemId };
      };

      const startTime = new Date(parseInt(lastSyncStr, 10));
      const endTime = new Date();

      if (endTime.getTime() - startTime.getTime() > 2000) {
        if (useStepsStore.getState().spawnConditions.length === 0) {
          await useStepsStore.getState().fetchSpawnCondition();
        }
        let lastCatchUpSpawn: ReturnType<typeof findLastCatchUpSpawn> = null;
        try {
          const startDay = toLocalDateString(startTime);
          const endDay = toLocalDateString(endTime);

          if (startDay !== endDay) {
            // App was closed/backgrounded across midnight: split the catch-up so the
            // leftover old-day steps get flushed to their own date instead of today's.
            const midnight = new Date(endTime);
            midnight.setHours(0, 0, 0, 0);

            trackingDate.current = startDay;
            const oldDayResult = await Pedometer.getStepCountAsync(startTime, midnight);
            if (oldDayResult.steps > 0) {
              const beforeV = virtualStepsBuffer.current;
              addSteps(oldDayResult.steps);
              lastCatchUpSpawn = findLastCatchUpSpawn(beforeV, virtualStepsBuffer.current) ?? lastCatchUpSpawn;
            }
            flushAndResetForNewDay(endDay);

            const newDayResult = await Pedometer.getStepCountAsync(midnight, endTime);
            if (newDayResult.steps > 0) {
              const beforeV = virtualStepsBuffer.current;
              addSteps(newDayResult.steps);
              lastCatchUpSpawn = findLastCatchUpSpawn(beforeV, virtualStepsBuffer.current) ?? lastCatchUpSpawn;
            }
          } else {
            trackingDate.current = endDay;
            const result = await Pedometer.getStepCountAsync(startTime, endTime);
            if (result.steps > 0) {
              const beforeV = virtualStepsBuffer.current;
              addSteps(result.steps);
              lastCatchUpSpawn = findLastCatchUpSpawn(beforeV, virtualStepsBuffer.current) ?? lastCatchUpSpawn;
            }
          }

          await AsyncStorage.setItem(LAST_CLOSED_KEY, endTime.getTime().toString());
          if (lastCatchUpSpawn) {
            useStepsStore.getState().setCatchUpSpawn(lastCatchUpSpawn);
          }
        } catch (error) {
          console.error('Failed to fetch historical steps:', error);
        }
      }
    };

    const startLiveTracking = () => {
      Accelerometer.setUpdateInterval(SAMPLING_INTERVAL_MS);

      isGravityInitialized.current = false;
      trackingStartTime.current = Date.now();

      accelerometerSubscription = Accelerometer.addListener((data) => {
        const today = toLocalDateString(new Date());
        if (today !== trackingDate.current) flushAndResetForNewDay(today);

        const { x, y, z } = data;

        // Seed the baseline with the actual current orientation
        if (!isGravityInitialized.current) {
          gravityX.current = x;
          gravityY.current = y;
          gravityZ.current = z;
          isGravityInitialized.current = true;
        }

        // 1. Isolate the true downward gravity vector (slight tilting is automatically preserved here)
        gravityX.current = ALPHA * gravityX.current + (1 - ALPHA) * x;
        gravityY.current = ALPHA * gravityY.current + (1 - ALPHA) * y;
        gravityZ.current = ALPHA * gravityZ.current + (1 - ALPHA) * z;

        // 2. Compute the precise length of the gravity vector
        const gravityLength = Math.sqrt(
          gravityX.current * gravityX.current +
            gravityY.current * gravityY.current +
            gravityZ.current * gravityZ.current
        );

        // 3. Normalize the gravity vector into a clean direction vector (unit vector)
        const dirDownX = gravityX.current / gravityLength;
        const dirDownY = gravityY.current / gravityLength;
        const dirDownZ = gravityZ.current / gravityLength;

        // 4. Extract linear kinetic acceleration by pulling out gravity
        const linearX = x - gravityX.current;
        const linearY = y - gravityY.current;
        const linearZ = z - gravityZ.current;

        // 5. VECTOR DOT PRODUCT: Project linear motion strictly onto the downward gravity path
        const verticalForce = linearX * dirDownX + linearY * dirDownY + linearZ * dirDownZ;

        const currentTime = Date.now();

        // 6. PEAK DETECTION: Only look for negative-to-positive vertical compression
        const verticalMagnitude = Math.abs(verticalForce);

        const isWarmingUp = currentTime - trackingStartTime.current < WARM_UP_MS;

        if (!isWarmingUp && verticalMagnitude > STEP_THRESHOLD) {
          if (currentTime - lastStepTime.current > COOL_DOWN_MS) {
            lastStepTime.current = currentTime;
            addSteps(1, currentTime);
          }
        }
      });
    };

    const stopLiveTracking = () => {
      if (accelerometerSubscription) {
        accelerometerSubscription.remove();
        accelerometerSubscription = null;
      }
    };

    const isInactiveOrBackground = (state: AppStateStatus) =>
      state === 'inactive' || state === 'background';

    // Handle app state changes to pause/resume step counting
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (appState.current === 'active' && isInactiveOrBackground(nextAppState)) {
        stopLiveTracking();
        await AsyncStorage.setItem(LAST_CLOSED_KEY, Date.now().toString());
      } else if (isInactiveOrBackground(appState.current) && nextAppState === 'active') {
        await catchUpHistoricalSteps();
        startLiveTracking();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    // Restore must run first: catch-up adds the closed-window pedometer steps on top
    // of the rehydrated buffer, and its day-rollover logic relies on trackingDate.
    restoreBuffers()
      .then(() => catchUpHistoricalSteps())
      .then(() => startLiveTracking());

    return () => {
      subscription.remove();
      stopLiveTracking();
    };
  }, [enabled]);

  return { steps };
}
