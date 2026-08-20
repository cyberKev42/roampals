import React, { createContext, useCallback, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {type AuthDTO, apiLogin, apiRegister} from '../api/auth';
import { getUser } from '../api/user';
import { deleteToken, getToken, isTokenExpired, saveToken } from '../utils/token';
import {UserDTO, useUserStore} from "@/src/stores/useUserStore";
import { LAST_CLOSED_KEY } from '../hooks/use-accelerometer-steps';

type AuthState = {
  userAuthState: UserDTO | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  //const [user, setUser] = useState<AuthDTO | null>(null);
  const {user, setUser , deleteUser} = useUserStore();

  // true while we check SecureStore on app launch — prevents a flash of the login screen
  const [isLoading, setIsLoading] = useState(true);

  // Runs once when the app opens. Checks if there's a saved, still-valid JWT.
  useEffect(() => {
    async function restoreSession() {
      try {
        const jwt = await getToken();

        if (jwt && !isTokenExpired(jwt)) {
          // Get user info from payload (middle segment of JWT) by decoding it from base64url and parsing the JSON
          const payloadBase64 = jwt.split('.')[1];
          const normalized = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(atob(normalized));

          // Reconstruct the user object from what's in the token.
          // Note: userId isn't in our JWT payload (TokenService only puts Role + sub),
          // so we set it to 0 as a placeholder until the app fetches a full profile.
          const user: UserDTO | null = await getUser(payload.username);
          setUser(user);
          /*setUser({
            username: payload.username,
            email: payload.sub,
            profilePicture: "",
            totalSteps: 0,
            totalDistanceM: 0,
            dailyVirtualSteps: 0,
            avatar: "",
            dailyGoalStepsConfig: 0,
            streakCount: 0
          });*/
        } else if (jwt) {
          // Delete token if expired
          await deleteToken();
        }
      } catch {
        await deleteToken();
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  function authToUser(authDTO: AuthDTO) {
    return {
      username: authDTO.username,
      email: authDTO.email,
      profilePicture: authDTO.profilePicture,
      totalSteps: authDTO.totalSteps,
      totalDistanceM: authDTO.totalDistanceM,
      dailyVirtualSteps: authDTO.dailyVirtualSteps,
      avatar: authDTO.avatar,
      dailyGoalStepsConfig: authDTO.dailyGoalStepsConfig,
      streakCount: authDTO.streakCount,
      createdAt: authDTO.createdAt
    }
  }

  async function login(username: string, password: string) {
    const authDTO = await apiLogin(username, password);
    await saveToken(authDTO.jwt);
    if (__DEV__) {
      console.log('[Health import] JWT for Shortcut:', authDTO.jwt);
    }
    const savedToken = await getToken();
    setUser(authToUser(authDTO));
  }

  async function register(username: string, email: string, password: string) {
    const authDTO = await apiRegister(username, email, password);
    await saveToken(authDTO.jwt);
    setUser(authToUser(authDTO));
    await AsyncStorage.setItem(LAST_CLOSED_KEY, Date.now().toString());
  }

  async function logout() {
    await deleteToken();
    deleteUser();
  }

  const refreshUser = useCallback(async () => {
    if (!user?.username) return;
    try {
      const fresh = await getUser(user.username);
      if (fresh) setUser(fresh);
    } catch {
      // dont log out, keep existing user data
    }
  }, [user?.username]);

  return (
    <AuthContext.Provider value={{ userAuthState: user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — any component calls useAuth() to get the auth state and functions
export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
