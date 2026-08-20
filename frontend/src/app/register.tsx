import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { useAuth } from '../context/auth-context';
import React from 'react';
import LoginHeader from "@/src/app/components/LoginHeader";
import {colors} from "@/src/styles/global";
import {useThemeColor} from "@/src/hooks/use-theme-color";

export default function RegisterScreen() {
  const { register } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister() {
    if (!username || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6 || !/\d/.test(password)) {
      setError('Password must be at least 6 characters long and contain a number');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await register(username, email, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  }
    const textColor = useThemeColor({ light: "#226ff8", dark: "rgb(61,145,243)"}, 'text');

    const input = "w-full border border-[#00000060] dark:border-[#ffffff60] rounded-2xl p-3 text-2xl text-[#11181C] dark:text-[#ffffffff]";

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
            <ThemedText type="title" className="mb-8 mt-10">Create account</ThemedText>
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
              placeholder="Email"
              placeholderTextColor="#00000060"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
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

            {error ? <ThemedText lightColor="#e53e3e" darkColor="#ff6b6b" className="text-sm">{error}</ThemedText> : null}

            <TouchableOpacity
              className="w-full bg-[#22d14b] p-3.5 rounded-full items-center mt-8"
              onPress={handleRegister} disabled={isLoading}>
              {isLoading
                ? <ActivityIndicator color="#fff" />
                : <ThemedText lightColor="#fff" darkColor="#fff" className="font-semibold text-base">Register</ThemedText>
              }
            </TouchableOpacity>

            <Link href="/" className="mt-8">
              <ThemedText type="link" style={{color: textColor}}>Already have an account? Log in</ThemedText>
            </Link>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
