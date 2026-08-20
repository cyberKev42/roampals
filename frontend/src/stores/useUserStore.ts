import { create } from "zustand";

export type UserDTO = {
    username: string;
    email: string;
    profilePicture: string;
    totalSteps: number;
    totalDistanceM: number;
    dailyVirtualSteps: number;
    avatar: string;
    dailyGoalStepsConfig: number;
    streakCount: number;
    createdAt: string;
};

type UserState = {
    user: UserDTO | null,
    setUser: (user: UserDTO) => void,
    deleteUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set((state) => ({user: user})),
    deleteUser: () => set((state) => ({user: null}))
}))