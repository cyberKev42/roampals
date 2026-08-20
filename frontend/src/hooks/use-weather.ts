import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";
import { getCurrentWeather, CurrentWeather } from "@/src/api/weather";

export function useWeather() {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setPermissionDenied(true);
        setError(null);
        return;
      }
      setPermissionDenied(false);
      const { coords } = await Location.getCurrentPositionAsync({});
      const data = await getCurrentWeather(coords.latitude, coords.longitude);
      setWeather(data);
      console.log("Weather loaded");
      setError(null);
    } catch (error) {
      setError("Failed to load weather");
      console.log("Weather error:", error);
    }
  }, []);

  useEffect(() => {
    loadWeather();
    const interval = setInterval(loadWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadWeather]);

  return { weather, permissionDenied, error, requestPermission: loadWeather };
}
