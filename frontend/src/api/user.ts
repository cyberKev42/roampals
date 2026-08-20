import client from './client';
import { UserDTO } from '@/src/stores/useUserStore';

export async function getUser(nameOrEmail: string): Promise<UserDTO> {
    const { data } = await client.get('/api/user/' + nameOrEmail);
    return data;
}

export async function updateDailyGoal(dailyGoalStepsConfig: number): Promise<UserDTO> {
    const { data } = await client.post<UserDTO>('/api/user/goal', { dailyGoalStepsConfig });
    return data;
}

export async function completeOnboarding(avatar: string, profilePicture: string, dailyGoalStepsConfig: number): Promise<UserDTO> {
    const { data } = await client.post<UserDTO>('/api/user/onboarding', { avatar, profilePicture, dailyGoalStepsConfig });
    return data;
}

export async function changeAvatar(avatar: string, profilePicture: string): Promise<UserDTO> {
    const { data } = await client.post<UserDTO>('/api/user/avatar', { avatar, profilePicture });
    return data;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<UserDTO> {
    const { data } = await client.post<UserDTO>('/api/user/change-password', { currentPassword, newPassword });
    return data;
}
