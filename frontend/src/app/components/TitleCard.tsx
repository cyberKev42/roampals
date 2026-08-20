import { useThemeColor } from "@/src/hooks/use-theme-color";
import { View } from "react-native";
import React from "react";


export default function TitleCard({
                                      children,
                                      className = "",
                                      style
                                  }: {
    children: React.ReactNode,
    className?: string,
    style?: unknown
}) {

    return (
        <View className={`w-full rounded-3xl overflow-hidden ${className}`}>
                {children}
        </View>
    );
}