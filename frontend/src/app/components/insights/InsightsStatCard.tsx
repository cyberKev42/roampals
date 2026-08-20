import React from "react";
import { View } from "react-native";
import { useThemeColor } from "@/src/hooks/use-theme-color";

export default function InsightsStatCard({children,
                                            className = "",
                                        }: {
    children: React.ReactNode;
    className?: string;
}) {
    const backgroundColor = useThemeColor({ light: "#ffffff", dark: '#532c03e0' }, "background");

    return (
        <View
            style={{ backgroundColor}}
            className={` rounded-3xl px-4 py-2 ${className}`}
        >
            {children}
        </View>
    );
}