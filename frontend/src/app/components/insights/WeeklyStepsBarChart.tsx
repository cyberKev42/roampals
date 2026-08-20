import React from 'react';
import { View, ScrollView } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { scaleBand, scaleLinear } from 'd3-scale';
import { format, parseISO } from 'date-fns';
import { ThemedText } from '@/src/components/themed-text';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { DailyActivityDTO } from '@/src/api/walk';
import InsightsStatCard from "@/src/app/components/insights/InsightsStatCard";

type WeeklyStepsBarChartProps = {
  data: DailyActivityDTO[];
  goal: number;
};

export default function WeeklyStepsBarChart({ data, goal }: WeeklyStepsBarChartProps) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const totalSteps = data.reduce((total, day) => total + day.steps, 0);
  const totalDistance = data.reduce((sum, day) => sum + day.distanceM, 0);
  const totalCalories = data.reduce((sum, day) => sum + day.calories, 0);
  const totalActiveMinutes = data.reduce((sum, day) => sum + day.activeMinutes, 0);

  const width = 340;
  const height = 220;
  const padding = { top: 10, right: 16, bottom: 30, left: 20 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const barColor = useThemeColor({ light: '#ff7315', dark: '#ffc70f' }, 'text');
  const goalLineColor = useThemeColor(
    { light: '#60a65a', dark: '#60a65a' },
    'text'
  );
  const textColor = useThemeColor({ light: '#3a3434', dark: '#f1d8c7' }, 'text');
  const cardBackgroundColor = useThemeColor({ light: 'rgb(255, 255, 255)', dark: '#532c03e0'}, 'background');


  const statTextColor = useThemeColor({ light: "#000", dark: "#ffe1cd" }, "text");

  if (data.length === 0) {
    return (
      <View style={{ paddingHorizontal: 16 }}>
        <ThemedText className="text-center opacity-60">No data available</ThemedText>
      </View>
    );
  }

  const maxSteps = Math.max(...data.map((d) => d.steps), goal) || goal;
  const yMax = Math.max(maxSteps, goal) * 1.15;

  const xScale = scaleBand().domain(data.map((_, i) => i.toString())).range([0, chartWidth]).padding(0.3);

  const yScale = scaleLinear().domain([0, yMax]).range([chartHeight, 0]);

  const goalY = yScale(goal);
  const barWidth = xScale.bandwidth();

  return (
    <View style={{ alignItems: "center"}}>
      <ThemedText className="text-sm mb-2">Current 7 Days</ThemedText>
      <View className="mx-1 rounded-3xl" style={{ backgroundColor: cardBackgroundColor }}>
      <Svg width={width} height={height}>
        {/* Baseline */}
        <Line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={padding.left + chartWidth}
          y2={padding.top + chartHeight}
          stroke={goalLineColor}
          strokeWidth={1}
          opacity={0.5}
        />

        {/* Goal line */}
        {goal > 0 && (
          <Line
            x1={padding.left}
            y1={padding.top + goalY}
            x2={padding.left + chartWidth}
            y2={padding.top + goalY}
            stroke={goalLineColor}
            strokeWidth={2}
            strokeDasharray="4,4"
            opacity={0.8}
          />
        )}

        {/* Bars */}
        {data.map((day, i) => {
          const x = padding.left + (xScale(i.toString()) || 0);
          const barHeight = chartHeight - yScale(day.steps);
          const y = padding.top + yScale(day.steps);

          return (
            <Rect
              key={`bar-${i}`}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={4}
              fill={barColor}
              opacity={0.9}
              onPress={() => setSelectedIndex(selectedIndex === i ? null : i)}
            />
          );
        })}

        {/* Day labels */}
        {data.map((day, i) => {
          const x = padding.left + (xScale(i.toString()) || 0) + barWidth / 2;
          const y = padding.top + chartHeight + 15;
          const dayStr = format(parseISO(day.date), 'EEE');

          return (
            <SvgText
              key={`label-${i}`}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize={12}
              fill={textColor}
              opacity={0.7}
            >
              {dayStr}
            </SvgText>
          );
        })}
      </Svg>

      {/* Tooltip overlay */}
      {selectedIndex !== null && (
        (() => {
          const day = data[selectedIndex];
          const barX = padding.left + (xScale(selectedIndex.toString()) || 0);
          const barCenterX = barX + barWidth / 2;
          const barY = padding.top + yScale(day.steps);

          const tooltipWidth = 100;
          const tooltipHeight = 50;
          const tooltipX = Math.max(
            padding.left,
            Math.min(barCenterX - tooltipWidth / 2, padding.left + chartWidth - tooltipWidth)
          );
          const tooltipY = barY - tooltipHeight - 14;

          const dayStr = format(parseISO(day.date), 'EEE, MMM d');

          return (
            <View
              style={{
                position: 'absolute',
                left: tooltipX,
                top: tooltipY,
                width: tooltipWidth,
                height: tooltipHeight,
                backgroundColor: cardBackgroundColor,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: textColor,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
              }}
            >
              <ThemedText className="font-bold text-sm" style={{ color: textColor }}>
                {day.steps.toLocaleString()}
              </ThemedText>
              <ThemedText className="text-xs opacity-70" style={{ color: textColor }}>
                {dayStr}
              </ThemedText>
            </View>
          );
        })()
      )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 2}}
        className="mt-4"
      >
        <View className="px-2">
          <InsightsStatCard>
            <ThemedText style={{ color: statTextColor}} className="text-sm opacity-60">Total</ThemedText>
            <ThemedText style={{ color: statTextColor}} className="text-2xl font-bold">{totalSteps.toLocaleString()}</ThemedText>
          </InsightsStatCard>
        </View>
        <View className="px-2">
          <InsightsStatCard>
            <ThemedText style={{ color: statTextColor}} className="text-sm opacity-60">Distance</ThemedText>
            <ThemedText style={{ color: statTextColor}} className="text-2xl font-bold">
              {(totalDistance / 1000).toFixed(1)} km
            </ThemedText>
          </InsightsStatCard>
        </View>
        <View className="px-2">
          <InsightsStatCard>
            <ThemedText style={{ color: statTextColor}} className="text-sm opacity-60">Calories</ThemedText>
            <ThemedText style={{ color: statTextColor}} className="text-2xl font-bold">{totalCalories} kcal</ThemedText>
          </InsightsStatCard>
        </View>
        <View className="px-2">
          <InsightsStatCard>
            <ThemedText style={{ color: statTextColor}} className="text-sm opacity-60">Active</ThemedText>
            <ThemedText style={{ color: statTextColor}} className="text-sm font-bold">{totalActiveMinutes} min</ThemedText>
          </InsightsStatCard>
        </View>
      </ScrollView>

    </View>
  );
}
