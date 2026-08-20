import React from 'react';
import { Text, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { arc } from 'd3-shape';
import { useThemeColor } from '@/src/hooks/use-theme-color';

type GoalRingProps = {
  steps: number;
  goal: number;
  size?: number;
  onPress?: () => void;
};

const TAU = Math.PI * 2;

export default function GoalRing({ steps, goal, size = 180, onPress }: GoalRingProps) {
  const strokeWidth = 16;
  const outerRadius = size / 2;
  const innerRadius = outerRadius - strokeWidth;

  const progress = goal > 0 ? Math.min(steps / goal, 1) : 0;
  const reached = steps >= goal;

  const trackColor = useThemeColor(
    { light: '#fff4eac7', dark: '#592d0481' },
    'background'
  );
  const fillColor = useThemeColor({ light: '#ff6f0f', dark: '#ffc70f' }, 'text');
  const textColor = useThemeColor({ light: '#392002', dark: '#f8e7b5' }, 'text');

  const ringArc = arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(strokeWidth / 2);

  const trackPath = ringArc({ startAngle: 0, endAngle: TAU } as any)!;
  const fillPath = ringArc({ startAngle: 0, endAngle: progress * TAU } as any)!

  const innerContent = (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Path
          d={trackPath}
          fill={trackColor}
          transform={`translate(${outerRadius}, ${outerRadius})`}
        />
        <Path
          d={fillPath}
          fill={fillColor}
          transform={`translate(${outerRadius}, ${outerRadius})`}
        />
      </Svg>

      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: textColor }} className="text-2xl font-fredoka mb-1">Today</Text>
        <Text style={{ color: textColor }} className="text-5xl font-lilita">{steps.toLocaleString()}</Text>
        <Text style={{ color: textColor }} className="text-md  font-fredoka opacity-60">
          {reached ? 'goal reached!' : `of ${goal} steps`}
        </Text>
      </View>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{innerContent}</Pressable>;
  }

  return innerContent;
}
