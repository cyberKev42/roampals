import {useThemeColor} from "@/src/hooks/use-theme-color";
import {Image, ImageComponent, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import React from "react";


export default function LoginHeader() {
    const backgroundColor = useThemeColor({ light: "#ffffff", dark: "#1f2937" }, "background");
    const gradientColorStart = useThemeColor({ light: "rgba(49,190,234,0.83)", dark: "rgba(22, 100, 196,0.83)" }, "background");
    const gradientColorEnd = useThemeColor({ light: "rgba(9,125,223,0.71)", dark: "rgba(3, 48, 115,0.83)" }, "background");

    return (
        <View className="w-full rounded-3xl overflow-hidden mb-8">
            <Image source={require("../../assets/images/loginHeader.png")}
                    style={{width: "100%", height: 200}}
            />
        </View>
    );
}