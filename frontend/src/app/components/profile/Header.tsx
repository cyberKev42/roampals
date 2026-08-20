import { LinearGradient } from "expo-linear-gradient";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { View } from "react-native";
import React from "react";


export default function Header({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const backgroundColor = useThemeColor({ light: "#ffffff", dark: "#1f2937" }, "background");
  const gradientColorStart = useThemeColor({ light: "#2476d4", dark: "#0b4575" }, "background");
  const gradientColorEnd = useThemeColor({ light: "#92c5df", dark: "#3183b3" }, "background");

  return (
    <View className="w-full rounded-3xl overflow-hidden">
    <LinearGradient
      colors={[gradientColorStart, gradientColorEnd]}
      start={{ x: 0.5, y: 0.35 }}
      end={{ x: 0.5, y: 0.97 }}
      style={{ backgroundColor }}
      className={`p-6 ${className}`}
    >
      {children}
    </LinearGradient>
    </View>
  );
}