import React, { useState } from 'react';
import {ScrollView, Text, View} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from '@react-navigation/native';
import { ThemedText } from '@/src/components/themed-text';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { useInsightsData } from '@/src/hooks/use-insights-data';
import { useStepsStore } from '@/src/stores/useStepsStore';
import { useUserStore } from '@/src/stores/useUserStore';
import GoalRing from '../components/insights/GoalRing';
import WeeklyStepsBarChart from '@/src/app/components/insights/WeeklyStepsBarChart';
import TrendAreaChart from '@/src/app/components/insights/TrendAreaChart';
import DailyGoalOverlay from '@/src/app/components/insights/DailyGoalOverlay';
import { colors } from '@/src/styles/global';
import { parseISO, isToday } from 'date-fns';
import { updateDailyGoal } from '@/src/api/user';

export default function InsightsView() {
  const backgroundColor = useThemeColor(
    { light: colors.backgroundScreenInsights, dark: '#be5c00' }, 'background');
  const cardBackgroundColor = useThemeColor({ light: 'rgb(246, 238, 216)', dark: '#532c03e0'}, 'background');
  const textColor = useThemeColor({ light: 'rgba(83,44,3,0.88)', dark: '#fae9c6' }, 'text');


  const { history, loading, error, refresh } = useInsightsData();
  const liveSteps = useStepsStore((s) => s.steps);
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const dailyGoal = user?.dailyGoalStepsConfig ?? 10000;

  const [goalOverlayVisible, setGoalOverlayVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleConfirmGoal = async (newGoal: number) => {
    try {
      const updatedUser = await updateDailyGoal(newGoal);
      setUser(updatedUser);
      setGoalOverlayVisible(false);
    } catch (error) {
      console.error('Failed to update daily goal:', error);
      setGoalOverlayVisible(false);
    }
  };

  // Determine today's steps and goal
  let todaySteps = liveSteps;
  if (history.length > 0) {
    const lastEntry = history[history.length - 1];
    if (isToday(parseISO(lastEntry.date))) {
      todaySteps = lastEntry.steps;
    }
  }

  // Get 7-day view (last 7 entries from history)
  const sevenDayData = history.slice(-7);

  const renderContent = () => {
    if (loading && history.length === 0) {
      return (
        <View style={{ paddingVertical: 40, alignItems: 'center' }}>
          <ThemedText className="opacity-60">Loading your stats…</ThemedText>
        </View>
      );
    }

    if (error && history.length === 0) {
      return (
        <View style={{ paddingVertical: 40, alignItems: 'center' }}>
          <ThemedText className="opacity-60">Could not load stats</ThemedText>
        </View>
      );
    }

    return (
      <>
        {/* Goal Ring*/}
        <View className="items-center mb-8">
          <GoalRing
            steps={todaySteps}
            goal={dailyGoal}
            size={180}
            onPress={() => setGoalOverlayVisible(true)}
          />
        </View>

        {/* Weekly Chart */}
        <View className="mb-6">
          <View className="rounded-3xl " style={{ backgroundColor }}>
            <WeeklyStepsBarChart data={sevenDayData} goal={dailyGoal} />
          </View>
        </View>

        {/* Trend Chart */}
        <View className="mb-6 mt-8">
          <View className="rounded-3xl" style={{ backgroundColor }}>
            <TrendAreaChart data={history} goal={dailyGoal} />
          </View>
        </View>

      </>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <View className="pt-6">
        <View style={{backgroundColor: cardBackgroundColor}} className={"rounded-3xl pt-4 pb-2 px-6 mb-8 w-11/12  self-center"}>
          <Text
              className=" self-center text-6xl text-center font-lobster-bold"
              style={{color: textColor}}
          >
            Insights
          </Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1, marginBottom: 40, backgroundColor }} showsVerticalScrollIndicator={false}>

        {renderContent()}
      </ScrollView>
      <DailyGoalOverlay
        visible={goalOverlayVisible}
        currentGoal={dailyGoal}
        onClose={() => setGoalOverlayVisible(false)}
        onConfirm={handleConfirmGoal}
      />
    </SafeAreaView>
  );
}
