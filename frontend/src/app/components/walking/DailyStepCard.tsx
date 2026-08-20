import { View, Text, LayoutChangeEvent } from "react-native";
import StepCounter from "./StepCounter";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { useAccelerometerSteps } from "@/src/hooks/use-accelerometer-steps";
import { useUserStore } from "@/src/stores/useUserStore";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import {ThemedText} from "@/src/components/themed-text";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const STROKE = 4.5;
const CARD_RADIUS = 22; // matches className "rounded-3xl"

function buildPaths(w: number, h: number) {
  if (w <= 0 || h <= 0) {
    return { rightD: "", leftD: "", halfLength: 0 };
  }

  const left = STROKE / 2;
  const right = w - STROKE / 2;
  const top = STROKE / 2;
  const bottom = h - STROKE / 2;
  const cx = w / 2;
  const rr = Math.max(CARD_RADIUS - STROKE / 2, 0);

  const rightD = `
    M ${cx},${bottom}
    L ${right - rr},${bottom}
    A ${rr} ${rr} 0 0 0 ${right},${bottom - rr}
    L ${right},${top + rr}
    A ${rr} ${rr} 0 0 0 ${right - rr},${top}
    L ${cx},${top}
  `;

  const leftD = `
    M ${cx},${bottom}
    L ${left + rr},${bottom}
    A ${rr} ${rr} 0 0 1 ${left},${bottom - rr}
    L ${left},${top + rr}
    A ${rr} ${rr} 0 0 1 ${left + rr},${top}
    L ${cx},${top}
  `;

  const halfLength = (w - STROKE - 2 * rr) + (h - STROKE - 2 * rr) + Math.PI * rr;

  return { rightD, leftD, halfLength };
}

const DailyStepCard = () => {
  const { steps } = useAccelerometerSteps(true);
  const user = useUserStore((s) => s.user);
  const remaining = Math.max((user?.dailyGoalStepsConfig ?? 0) - steps, 0);

  const backgroundColor = useThemeColor({ light: "#84d08aac", dark: "rgba(19, 80, 46, 0.79)" }, "background");
  const fillColor = useThemeColor({ light: "rgba(40,140,24,0.7)", dark: "rgb(86,161,109)" }, "text");
  const textColor = useThemeColor({ light: "#005305", dark: "rgb(203,251,228)"}, 'text');

  const goal = user?.dailyGoalStepsConfig ?? 0;
  const progress = goal > 0 ? Math.min(steps / goal, 1) : 0;

  const [dims, setDims] = useState({ w: 0, h: 0 });

  const fillProgress = useSharedValue(0);
  const pathLength = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  const goalReachedRef = useRef(false);

  const { rightD, leftD, halfLength } = useMemo(() => buildPaths(dims.w, dims.h), [dims.w, dims.h]);

  useEffect(() => {
    pathLength.value = halfLength;
  }, [halfLength, pathLength]);

  useEffect(() => {
    fillProgress.value = withTiming(progress, { duration: 500 });
  }, [progress, fillProgress]);

  useEffect(() => {
    const hasReachedGoal = progress === 1;
    if (hasReachedGoal && !goalReachedRef.current) {
      goalReachedRef.current = true;
      pulseScale.value = withSequence(
        withTiming(1.05, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
      glowOpacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 200 })
      );
    } else if (!hasReachedGoal) {
      goalReachedRef.current = false;
    }
  }, [progress, pulseScale, glowOpacity]);

  const fillAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: pathLength.value * (1 - fillProgress.value),
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    borderWidth: 0,
    borderColor: `rgba(34, 184, 69, ${glowOpacity.value})`,
    shadowColor: fillColor,
    shadowOpacity: glowOpacity.value,
    shadowRadius: 8,
    elevation: glowOpacity.value * 8,
  }));

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setDims((prev) => {
      if (Math.round(prev.w) === Math.round(width) && Math.round(prev.h) === Math.round(height)) {
        return prev;
      }
      return { w: width, h: height };
    });
  };

  return (
    <Animated.View
      onLayout={handleLayout}
      style={[cardAnimatedStyle, { backgroundColor }]}
      className="mx-4 my-3 rounded-3xl px-10 pt-4 py-1 items-center"
    >
      <Svg
        width={dims.w}
        height={dims.h}
        style={{ position: "absolute", top: 0, left: 0 }}
        pointerEvents="none"
      >
        <Path d={rightD} stroke={backgroundColor} strokeWidth={STROKE} fill="none" strokeLinecap="round" />
        <Path d={leftD} stroke={backgroundColor} strokeWidth={STROKE} fill="none" strokeLinecap="round" />
        <AnimatedPath
          d={rightD}
          stroke={fillColor}
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={halfLength}
          animatedProps={fillAnimatedProps}
        />
        <AnimatedPath
          d={leftD}
          stroke={fillColor}
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={halfLength}
          animatedProps={fillAnimatedProps}
        />
      </Svg>

      <ThemedText type="default" style={{ color: textColor }} className="text-md font-medium">
        Steps Today
      </ThemedText>
      <View className="mt-2">
        <StepCounter />
      </View>
      <ThemedText type="default" style={{ color: textColor }} className="mt-2 text-sm">
        Daily Goal{goal > 0 ? `: ${goal.toLocaleString()}` : ""}
      </ThemedText>
    </Animated.View>
  );
};

export default DailyStepCard;
