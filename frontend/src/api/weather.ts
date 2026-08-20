import { OPENWEATHER_API_KEY } from "@/src/constants/weather";

export type CurrentWeather = {
  tempC: number;
  description: string;
  icon: string;
};

export async function getCurrentWeather(
  lat: number,
  lon: number
): Promise<CurrentWeather> {
  if (!OPENWEATHER_API_KEY) {
    throw new Error(
      "Missing EXPO_PUBLIC_OPENWEATHER_API_KEY - copy frontend/.env.example to frontend/.env"
    );
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather");
  const data = await res.json();
  return {
    tempC: Math.round(data.main.temp),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
  };
}
