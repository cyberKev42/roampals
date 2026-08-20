import axios from "../api/client";
import { create } from "zustand";

type BaseCondition = {
    requiredSteps: number;
};

export type SpawnCondition = BaseCondition & (
    | { type: 'CREATURE'; creatureId: number; itemId?: never }
    | { type: 'ITEM'; itemId: number; creatureId?: never }
);

export type CatchUpSpawn = {
    type: 'CREATURE' | 'ITEM';
    creatureId?: number;
    itemId?: number;
} | null;

type StepsState = {
    steps: number;
    virtualSteps: number;
    lastStepAt: number;
    spawnConditions: SpawnCondition[]; // speichert die geladene tagesliste von user
    catchUpSpawn: CatchUpSpawn;
    setSteps: (steps: number) => void;
    setVirtualSteps: (virtualSteps: number) => void;
    setLastStepAt: (timestamp: number) => void;
    setCatchUpSpawn: (spawn: CatchUpSpawn) => void;
    reset: () => void;

    fetchSpawnCondition: () => Promise<void>;
    incrementVirtualStepsAndCheck: (
        amount: number,
        onSpawnTriggered: (type: 'creature' | 'item', id: number) => void
    ) => void
};

export const useStepsStore = create<StepsState>((set, get) => ({
    steps: 0,
    virtualSteps: 0,
    lastStepAt: 0,
    spawnConditions: [],
    catchUpSpawn: null,
    setSteps: (steps) => set({ steps }),
    setVirtualSteps: (virtualSteps) => set({ virtualSteps }),
    setLastStepAt: (lastStepAt) => set({ lastStepAt }),
    setCatchUpSpawn: (catchUpSpawn) => set({ catchUpSpawn }),
    reset: () => set({
        steps: 0,
        virtualSteps: 0,
        lastStepAt: 0,
        spawnConditions: [],
        catchUpSpawn: null
    }),

    fetchSpawnCondition: async () => {
    try {
        const response = await axios.get("/api/spawn-condition");
        //console.log("=== API RESPONSE DATA ===", JSON.stringify(response.data, null, 2));
        set({ spawnConditions: response.data });
        } catch (error) {
        console.error("Failed to load spawn-conditions:", error);
        }
    },
    
    incrementVirtualStepsAndCheck: (amount, onSpawnTriggered) => {
    const { virtualSteps: oldVirtualSteps, spawnConditions} = get();
    const newVirtualSteps = oldVirtualSteps + amount;

    // aktualisiert zuerst state
    set({ virtualSteps: newVirtualSteps });

    // prüft, ob in dem gegangenen intervall (von alt bis neu) meilenstein liegt
    const triggeredCondition = spawnConditions.find(
      (cond) => cond.requiredSteps > oldVirtualSteps && cond.requiredSteps <= newVirtualSteps
    );

    if (triggeredCondition) {
      // wenn ja aallback -> creatureId od itemId
      if (triggeredCondition.type === 'CREATURE') {
        onSpawnTriggered('creature', triggeredCondition.creatureId);
      } else if (triggeredCondition.type === 'ITEM') {
        onSpawnTriggered('item', triggeredCondition.itemId);
      }
    }
  }
}));
