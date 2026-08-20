import { ThemedText } from "@/src/components/themed-text";
import { useAuth } from "@/src/context/auth-context";
import { colors} from "@/src/styles/global";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View, Pressable, Text } from "react-native";
import ProfileStatCard from "../components/profile/ProfileStatCard";
import Header from "../components/profile/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import React from "react";
import {useThemeColor} from "@/src/hooks/use-theme-color";
import { format, parseISO } from "date-fns";
import {useFocusEffect} from "@react-navigation/native";
import {getPendingStepsSave} from "@/src/api/walk";
import { changeAvatar } from "@/src/api/user";
import { useUserStore } from "@/src/stores/useUserStore";
import AvatarPickerModal from "../components/profile/AvatarPickerModal";
import ChangePasswordModal from "../components/profile/ChangePasswordModal";
import {LinearGradient} from "expo-linear-gradient";

export default function ProfileView() {
  const { logout, userAuthState, refreshUser } = useAuth();
  const { setUser } = useUserStore();
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [statCardVisible, setStatCardVisible] = useState(false);

  useFocusEffect(
      React.useCallback(() => {
        // Wait for a just-triggered save (e.g. leaving the Walk tab) to land before
        // refreshing, otherwise this GET can race ahead of that POST and return stale totals.
        getPendingStepsSave()?.catch(() => {}).then(() => refreshUser()) ?? refreshUser();
        return () => {
          // cleanup if needed
        };
      }, [refreshUser])
  );

  const backgroundColor = useThemeColor({ light: colors.backgroundScreenProfile, dark: "#3183b3" }, "background");
  const changePWBackgroundColor = useThemeColor({ light: "#2476d4", dark: "#0b4575" }, "background");
  const changePWTextColor = useThemeColor({ light: "#e9f0ff", dark: "#fffbfb" }, "text");
  const textColor = useThemeColor({ light: "#0b0a0a", dark: "#cae5fa" }, "text");
  const titleTextColor = useThemeColor({ light: "#0d218c", dark: "#cae5fa" }, "text");
  const titleCardColor = useThemeColor({ light: "#cbe0e8", dark: "#0b4575" }, "background");
  const gradientColorStart = useThemeColor({ light: "#2476d4", dark: "rgba(14,84,143,0.85)" }, "background");
  const gradientColorEnd = useThemeColor({ light: "#92c5df", dark: "#3183b3" }, "background");

  const handleAvatarConfirm = async (avatar: string, headshotId: string) => {
    try {
      const updated = await changeAvatar(avatar, headshotId);
      setUser(updated);
      setAvatarModalVisible(false);
    } catch (e) {
      console.error('Failed to change avatar:', e);
    }
  };

  // @ts-ignore
  return (<>
    <SafeAreaView style={{backgroundColor}} className="flex-1" edges={['top']}>
      <View className="pt-6">
        <View style={{backgroundColor: titleCardColor}} className={"rounded-3xl pt-4 pb-2 px-6 mb-8 w-11/12  self-center"}>
          <Text
              className=" self-center text-6xl text-center font-lobster-bold"
              style={{color: titleTextColor}}
          >
            Profile
          </Text>
        </View>
      </View>
    <ScrollView style={{ flex: 1 }}
      contentContainerClassName="px-5 pb-8"
      showsVerticalScrollIndicator={false}>
      <Header className={""}>
        <View className="flex-row self-center gap-2 h-30 pt-4">
          <Pressable onPress={() => setAvatarModalVisible(true)}>
            <Image
            source={ userAuthState?.avatar === "avatar_m"
              ? require("@/src/assets/images/avatar/avatar1_headshot.png")
              : require("@/src/assets/images/avatar/avatar2_headshot.png")}
            style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 0, borderColor: textColor, backgroundColor: backgroundColor}}
          />
          </Pressable>
        </View>
        <View className="flex-1 self-center items-center py-6">
          <Text style={{color: textColor}} className="text-5xl font-lobster-bold-italic pb-2">
            {userAuthState?.username ?? 'Username'}
          </Text>
          <ThemedText style={{color: textColor}}  className="text-4xl text-gray-500" type="defaultSemiBold" >{userAuthState?.email ? userAuthState.email : "Email"}</ThemedText>
        </View>
      </Header>

      <View className="flex-row flex-wrap gap-y-4 -mx-2 mt-4">
        <View className="w-1/2 px-2">
          <ProfileStatCard>
            <ThemedText style={{color: textColor}} className="text-lg font-monomaniac" type="subtitle" >{
              userAuthState ? userAuthState?.totalSteps.toLocaleString("de-DE") : "N/A"}
            </ThemedText>
            <ThemedText style={{color: textColor}} >Total Steps</ThemedText>
          </ProfileStatCard>
        </View>
        <View className="w-1/2 px-2">
          <ProfileStatCard>
            <ThemedText style={{color: textColor}}  className="text-lg font-monomaniac" type="subtitle" >
              {userAuthState ?
                  (userAuthState.totalDistanceM > 1000 ?
                      (userAuthState.totalDistanceM / 1000).toFixed(2) + " km"
                      : userAuthState.totalDistanceM + " m")
                  : "N/A"}
            </ThemedText>
            <ThemedText style={{color: textColor}} >Total Distance</ThemedText>
          </ProfileStatCard>
        </View>
        <View className="w-1/2 px-2">
          <ProfileStatCard>
            <ThemedText style={{color: textColor}}  className="text-lg font-monomaniac" type="subtitle" >{userAuthState?.dailyGoalStepsConfig}</ThemedText>
            <ThemedText  style={{color: textColor}} >Todays Step Goal</ThemedText>
          </ProfileStatCard>
        </View>

        <View className="w-1/2 px-2">
          <ProfileStatCard>
            <ThemedText style={{color: textColor}}  className="text-lg font-monomaniac " type="subtitle">{userAuthState?.streakCount ?? 0} {userAuthState?.streakCount && userAuthState.streakCount > 0 ? "🔥" : ""}</ThemedText>
            <ThemedText  style={{color: textColor}} >Day Streak</ThemedText>
          </ProfileStatCard>
        </View>

        <View className="w-full px-2">
          <ProfileStatCard className={"items-center"}>
            <ThemedText style={{color: textColor}}  className="text-lg font-monomaniac" type="subtitle" >
              {userAuthState
                  ? format(parseISO(userAuthState?.createdAt.substring(0,10)), "dd MMMM yyyy")
                  : "N/A"}
            </ThemedText>
            <ThemedText style={{color: textColor}} >Roaming since</ThemedText>
          </ProfileStatCard>
        </View>

        {/* Unsichtbare card um daten zu prüfen*/}
        <Pressable style={{height: 30}} onPress={() => setStatCardVisible(!statCardVisible)}>
        <View className='w-full px-2'>
          <ProfileStatCard   className={statCardVisible ? "flex flex-row justify-around" : "hidden"}>
            <ThemedText style={{color: textColor}} className="text-lg font-bold" type="default" >{userAuthState?.dailyVirtualSteps}</ThemedText>
            <ThemedText style={{color: textColor}} >dailyVirtualSteps</ThemedText>
          </ProfileStatCard>
        </View>
        </Pressable>
      </View>
      <View className="px-4 pt-0 mt-0 flex-row gap-3">
        <TouchableOpacity style={{backgroundColor: changePWBackgroundColor}} className="flex-1 rounded-3xl items-center p-2" onPress={() => setPasswordModalVisible(true)}>
          <ThemedText style={{ color: changePWTextColor, fontWeight: "bold" }}>Edit Password</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 rounded-3xl bg-red-600 items-center p-2" onPress={logout}>
          <ThemedText style={{ color: changePWTextColor, fontWeight: "bold"}}>Log out</ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>

    <AvatarPickerModal
      visible={avatarModalVisible}
      currentAvatar={userAuthState?.avatar ?? null}
      onClose={() => setAvatarModalVisible(false)}
      onConfirm={handleAvatarConfirm}
    />

    <ChangePasswordModal
      visible={passwordModalVisible}
      onClose={() => setPasswordModalVisible(false)}
    />

    </SafeAreaView>


  </>);
}

// const styles = StyleSheet.create({});
