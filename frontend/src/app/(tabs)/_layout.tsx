import React from "react";
import { useColorScheme } from "react-native";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import {useAuth} from "@/src/context/auth-context";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const tabTintColor = isDark ? "hsl(103, 59%, 48%)" : "hsl(128, 74%, 33%)";

  const { userAuthState } = useAuth();

  return (
    <NativeTabs tintColor={tabTintColor}>
        <NativeTabs.Trigger name="index">
            <Label>Walk</Label>
            <Icon
                sf={{
                    default: "figure.walk.circle",
                    selected: "figure.walk.circle.fill",
                }}
                drawable="custom_android_drawable"
            />
        </NativeTabs.Trigger>


      <NativeTabs.Trigger name="insights">
        <Label>Insights</Label>
        <Icon
          sf={{
            default: "chart.bar",
            selected: "chart.bar.fill",
          }}
          drawable="custom_android_drawable"
        />
      </NativeTabs.Trigger>

        <NativeTabs.Trigger name="inventory">
            <Label>Collection</Label>
            <Icon
                sf={{
                    default: "lizard", // fossil.shell
                    selected: "lizard.fill",
                }}
                drawable="custom_android_drawable"
            />
        </NativeTabs.Trigger>


      <NativeTabs.Trigger name="achievements">
        <Label>Milestones</Label>
        <Icon
          sf={{
            default: "flag.2.crossed", // trophy
            selected: "flag.2.crossed.fill",
          }}
          drawable="custom_android_drawable"
        />
      </NativeTabs.Trigger>
        {/*
            sf={{
            default: "person",
            selected: "person.fill",
          }}
            */}
      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <Icon
            src={ userAuthState?.avatar === "avatar_m"
                ? require("@/src/assets/images/avatar/avatar_m_headshot_mini.png")
                : require("@/src/assets/images/avatar/avatar_w_headshot_mini.png")}
          drawable="custom_android_drawable"
        />
      </NativeTabs.Trigger>
    </NativeTabs>

  );
}
