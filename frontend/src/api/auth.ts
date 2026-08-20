
//const BASE_URL = 'http://172.20.10.10:8090'; // Android emulator → localhost. Change to your machine's LAN IP for a real device.
import client from './client';

export type AuthDTO = {
  userId: number;
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
  role: string;
  jwt: string;
};

export async function apiLogin(username: string, password: string): Promise<AuthDTO> {
  const { data } = await client.post<AuthDTO>('/api/auth/login', { username, password });
  // console.log('apiLogin response data:', data); // Log the response data
  return data;
}

export async function apiRegister(username: string, email: string, password: string): Promise<AuthDTO> {
  const { data } = await client.post<AuthDTO>('/api/auth/register', { username, email, password });
  return data;
}
