import { View, Text, Image, Pressable } from "react-native";
import { useWeather } from "@/src/hooks/use-weather";
import {useThemeColor} from "@/src/hooks/use-theme-color";
import React from "react";
import {ThemedText} from "@/src/components/themed-text";

const WeatherBadge = () => {
  const { weather, permissionDenied, error, requestPermission } = useWeather();

  const backgroundColor = useThemeColor({ light: "#84D08AAC", dark: "#4E9665B0" }, "background");
  const textColor = useThemeColor({ light: "#005305", dark: "rgb(203,251,228)"}, 'text');


  const containerClass = "flex-row items-center justify-center h-10";

  if (permissionDenied) {
    return (
      <Pressable onPress={requestPermission} className={containerClass}>
        <Text style={{color: textColor}} className="text-sm font-medium ">
          Activate GPS permission
        </Text>
      </Pressable>
    );
  }

  if (error) {
    return (
      <Pressable onPress={requestPermission} className={containerClass}>
        <Text className="text-sm font-medium text-red-600">{error}</Text>
      </Pressable>
    );
  }

  if (!weather) {
    return <View className={containerClass} />;
  }

  return (
    <Pressable onPress={requestPermission} className={containerClass}>
      <Image
        source={{ uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png` }}
        style={{ width: 32, height: 32 , backgroundColor: backgroundColor, borderRadius: 20}}
      />
      <ThemedText style={{color: textColor}} className="text-sm font-medium  ml-1">
        {weather.tempC}°C, {weather.description}
      </ThemedText>
    </Pressable>
  );
};

export default WeatherBadge;
