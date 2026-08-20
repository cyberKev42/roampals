import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { useAuth } from '../context/auth-context';
import LoginHeader from "@/src/app/components/LoginHeader";
import {colors} from "@/src/styles/global";
import {useThemeColor} from "@/src/hooks/use-theme-color";

export default function LoginScreen() {
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await login(username, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }

    const textColor = useThemeColor({ light: "#226ff8", dark: "rgb(61,145,243)"}, 'text');

  return (
    <ThemedView className="flex-1" lightColor={colors.backgroundScreenHome} darkColor={"#2c6549"}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1"
            contentContainerClassName="flex-grow justify-center items-center px-8 gap-3"
            keyboardShouldPersistTaps="handled"
          >
            <ThemedText type="title" className="mb-8">Roam Pals</ThemedText>

            <LoginHeader/>

            <TextInput
              className={`${input}`}
              placeholder="Username"
              placeholderTextColor="#00000060"
              autoCapitalize="none"
              autoCorrect={false}
              value={username}
              onChangeText={setUsername}
            />

            <TextInput
              className={`${input}`}
              placeholder="Password"
              placeholderTextColor="#00000060"
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />

            {error
                ? <ThemedText lightColor="#e53e3e" darkColor="#ff6b6b" className="text-sm">
                    Unauthorized: error {error.substring(error.length - 3, error.length)}
                  </ThemedText>
                : null}

            <TouchableOpacity
              className="w-full bg-[#22d14b] p-3.5 rounded-full items-center mt-8 "
              onPress={handleLogin} disabled={isLoading}>
              {isLoading
                ? <ActivityIndicator color="#fff" />
                : <ThemedText lightColor="#fff" darkColor="#fff" className="font-semibold text-base">Log in</ThemedText>
              }
            </TouchableOpacity>

            <Link href="/register"  className="mt-8">
              <ThemedText type="link" style={{color: textColor}}>Do not have an account? Register</ThemedText>
            </Link>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const input = "w-full border border-[#00000060] dark:border-[#ffffff60] rounded-2xl p-3 text-2xl text-[#11181C] dark:text-[#ffffffff]";
