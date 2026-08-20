import React from 'react';
import {Text} from 'react-native';
import { useAccelerometerSteps } from '@/src/hooks/use-accelerometer-steps';
import {useThemeColor} from "@/src/hooks/use-theme-color";

export default function StepCounter() {
  const { steps } = useAccelerometerSteps(true);

  const textColor = useThemeColor({ light: "#005305", dark: "rgb(203,251,228)"}, 'text');

  return <Text style={{color: textColor}} className="text-8xl font-lilita">{steps}</Text>;
}
