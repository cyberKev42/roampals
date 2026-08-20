import { ThemedText } from "@/src/components/themed-text";
import { colors } from "@/src/styles/global";
import { useUserStore } from "@/src/stores/useUserStore";
import { getMilestoneProgress, markMilestone, MilestoneProgressDTO } from "@/src/api/milestones";
import AchievementCard from "@/src/app/components/achievements/AchievementCard";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {ScrollView, Text, View} from "react-native";
import {useThemeColor} from "@/src/hooks/use-theme-color";
import {SafeAreaView} from "react-native-safe-area-context";

export default function AchievementsView() {
  const user = useUserStore((s) => s.user);
  const [milestones, setMilestones] = useState<MilestoneProgressDTO[]>([]);

  const backgroundColor = useThemeColor(
    { light: colors.backgroundScreenAchievements, dark: '#9c2c2c' }, 'background');
    const cardBackground = useThemeColor({ light: '#f4e0e0', dark: '#5c1717' }, 'background');
    const cardTextColor = useThemeColor({ light: "rgb(184,24,5)", dark: "#fadada" }, "text");


  useFocusEffect(
    useCallback(() => {
      if (!user?.username) return;
      getMilestoneProgress(user.username)
        .then(setMilestones)
        .catch(() => {});
    }, [user?.username])
  );

  const handleMark = (milestoneId: number) => {
    if (!user?.username) return;
    const username = user.username;
    markMilestone(milestoneId)
      .then(() => getMilestoneProgress(username))
      .then(setMilestones)
      .catch(() => {});
  };
  return (
      <SafeAreaView style={{backgroundColor}}>

          <View className="pt-6">
              {/*
          <ThemedText type="title" className="px-4 mb-8 self-center">Milestones130</ThemedText>
        <ThemedText type="title" className="px-4 mb-8 self-center font-bungee">Bungee-Regular130</ThemedText>
        <ThemedText type="subtitle" className="px-4 mb-8 self-center font-dangrek">Dangrek-Regular130</ThemedText>
        <ThemedText  className="px-4 mb-8 self-center font-lilita">LilitaOne-Regular130</ThemedText>
        <ThemedText type="title" className="px-4 mb-8 self-center font-lobster">LobsterTwo-Regular130</ThemedText>
        <ThemedText type="subtitle" className="px-4 mb-8 self-center font-shrikhand">Shrikhand-Regular130</ThemedText>
        <ThemedText type="subtitle" className="px-4 mb-8 self-center font-baloo">Milestones 0123 baloo Insights</ThemedText>
        <ThemedText type="default" className="px-4 mb-8 self-center font-fredoka">Milestones 0123 fredoka Insights</ThemedText>
        <ThemedText type="subtitle" className="px-4 mb-8 self-center font-nunito">Milestones 0123 nunito Insights</ThemedText>
        <ThemedText type="subtitle" className="px-4 mb-8 self-center font-quicksand">Milestones 0123 quicksand Insights</ThemedText>
          */}
              <View style={{backgroundColor: cardBackground}} className={"rounded-3xl w-11/12 pt-4 pb-2 px-6 mb-8 self-center"}>
                  <Text
                      className=" self-center text-6xl text-center font-lobster-bold"
                      style={{color: cardTextColor}}
                  >
                      Milestones
                  </Text>
              </View>
          </View>
    <ScrollView style={{ marginBottom: 100, backgroundColor}}>


      <View className="gap-3 px-4 pb-24">
        {milestones.map((milestone) => (
          <AchievementCard
            key={milestone.milestoneId}
            milestone={milestone}
            onMark={() => handleMark(milestone.milestoneId)}
          />
        ))}
      </View>
    </ScrollView>
      </SafeAreaView>
  );
}
