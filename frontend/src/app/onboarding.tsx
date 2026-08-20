import React, { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { completeOnboarding } from '../api/user';
import { useUserStore } from '../stores/useUserStore';
import { AVATAR_OPTIONS } from '../constants/avatars';

export default function OnboardingScreen() {
  const [selectedAvatar, setSelectedAvatar] = useState<'avatar_m' | 'avatar_w' | null>(null);
  const [stepGoal, setStepGoal] = useState(10000);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, setUser } = useUserStore();

  const backgroundColor = useThemeColor({ light: 'rgba(70,202,156,0.15)', dark: 'rgb(4,120,106)'}, 'background');
  const uiColor = useThemeColor({light: 'rgb(4,120,116)', dark: 'rgb(3,76,70)'}, 'background');
  const borderColor = useThemeColor({light: 'rgb(4,120,116)', dark: 'rgb(1,71,70)'}, 'background');
  const textColor = useThemeColor({}, 'text');

  const handleMinus = () => {
    setStepGoal((g) => Math.max(500, g - 500));
  };

  const handlePlus = () => {
    setStepGoal((g) => g + 500);
  };

  const handleConfirm = async () => {
    if (!selectedAvatar || !user) return;

    setError('');
    setIsLoading(true);

    try {
      const option = AVATAR_OPTIONS.find((opt) => opt.id === selectedAvatar);
      if (!option) throw new Error('Invalid avatar selection');

      const updated = await completeOnboarding(selectedAvatar, option.headshotId, stepGoal);
      setUser(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Onboarding failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1" contentContainerClassName="flex-grow justify-center" style={{backgroundColor}}>
      <ThemedView className="flex-1 justify-center items-center px-8 gap-6" style={{backgroundColor}}>
        <ThemedText type="title" className="mb-4">
          Choose your Avatar
        </ThemedText>

        {/* Avatar Picker */}
        <View className="w-full gap-2">
          <View className="flex-row justify-around gap-4 h-fit w-full">
            {AVATAR_OPTIONS.map((option) => (
              <Pressable
                key={option.id}
                onPress={() => setSelectedAvatar(option.id)}
                className={`flex-1 rounded-2xl overflow-hidden border-2`}
                style={option.id === selectedAvatar ? {backgroundColor: uiColor} : {}}

              >
                <Image
                  source={option.image}
                  className="w-full h-96"
                  resizeMode="cover"
                />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Step Goal Picker */}
        <View className="w-full gap-2">
          <ThemedText type="subtitle" className="self-center text-lg font-semibold">Daily Step Goal</ThemedText>
          <View className="flex-row justify-around items-center my-4" >
            <Pressable
              className="w-16 h-16 rounded-full justify-center items-center"
              style={{backgroundColor: uiColor}}
              onPress={handleMinus}
            >
              <Text className="text-4xl font-bold text-white">−</Text>
            </Pressable>

            <Text className="text-5xl font-fredoka" style={{ color: textColor }}>
              {stepGoal.toLocaleString()}
            </Text>

            <Pressable
              className="w-16 h-16 rounded-full justify-center items-center "
              style={{backgroundColor: uiColor}}
              onPress={handlePlus}
            >
              <Text className="text-4xl font-bold text-white">+</Text>
            </Pressable>
          </View>
          <Text className="text-center text-sm opacity-60 font-fredoka" style={{ color: textColor }}>
            steps per day (minimum 500)
          </Text>
        </View>

        {error ? (
          <ThemedText lightColor="#e53e3e" darkColor="#ff6b6b" className="text-sm">
            {error}
          </ThemedText>
        ) : null}

        <Pressable
          className={`w-full p-3.5 rounded-full items-center mt-6 `}
          style={ selectedAvatar ? {backgroundColor: uiColor} : {backgroundColor: '#9ca3af'}}
          onPress={handleConfirm}
          disabled={!selectedAvatar || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText lightColor="#fff" darkColor="#fff" className="font-semibold text-base">
              Get Started
            </ThemedText>
          )}
        </Pressable>
      </ThemedView>
    </ScrollView>
  );
}
