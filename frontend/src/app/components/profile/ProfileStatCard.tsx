import React from "react";
import { View } from "react-native";
import { useThemeColor } from "@/src/hooks/use-theme-color";

export default function ProfileStatCard({children,
                                            className = "",
                                        }: {
    children: React.ReactNode;
    className?: string;
}) {
    const backgroundColor = useThemeColor({ light: "#ffffff", dark: "#0b4575" }, "background");

    return (
        <View
            style={{ backgroundColor}}
            className={` rounded-3xl p-4 ${className}`}
        >
            {children}
        </View>
    );
}