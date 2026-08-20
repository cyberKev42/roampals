import client from "@/src/api/client";

type StepsDTO = {
    dailySteps: number,
    dailyVirtualSteps: number
}

export type DailyActivityDTO = {
    date: string;
    steps: number;
    distanceM: number;
    calories: number;
    activeMinutes: number;
    goalSteps: number;
};

// Tracks the most recent save so other screens (e.g. Profile, on focus) can wait for a
// just-triggered save to land before refreshing data that depends on it.
let pendingStepsSave: Promise<StepsDTO> | null = null;

export function saveStepsToBackend(dailySteps: number, dailyVirtualSteps: number, date: string): Promise<StepsDTO> {
    const request = client
        .post<StepsDTO>('/api/daily-activity/steps', { dailySteps, dailyVirtualSteps, date })
        .then(({ data }) => data);
    pendingStepsSave = request;
    return request;
}

export function getPendingStepsSave(): Promise<StepsDTO> | null {
    return pendingStepsSave;
}

export function getActivityHistory(days: number = 30): Promise<DailyActivityDTO[]> {
    return client
        .get<DailyActivityDTO[]>('/api/daily-activity/history', { params: { days } })
        .then(({ data }) => data);
}