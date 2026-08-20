import React from 'react';
import {ScrollView, View, PanResponder} from 'react-native';
import Svg, { Path, Line, Text as SvgText } from 'react-native-svg';
import { scaleLinear } from 'd3-scale';
import { line, area, curveMonotoneX } from 'd3-shape';
import { format, parseISO } from 'date-fns';
import { ThemedText } from '@/src/components/themed-text';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { DailyActivityDTO } from '@/src/api/walk';
import InsightsStatCard from "@/src/app/components/insights/InsightsStatCard";

type TrendAreaChartProps = {
  data: DailyActivityDTO[];
  goal: number;
};

export default function TrendAreaChart({ data, goal }: TrendAreaChartProps) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const hideTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalSteps = data.reduce((total, day) => total + day.steps, 0);
  const totalDistance = data.reduce((sum, day) => sum + day.distanceM, 0);
  const totalCalories = data.reduce((sum, day) => sum + day.calories, 0);
  const totalActiveMinutes = data.reduce((sum, day) => sum + day.activeMinutes, 0);
  const daysGoalMet = data.filter(d => d.steps >= goal).length;

  const width = 340;
  const height = 240;
  const padding = { top: 20, right: 16, bottom: 35, left: 40 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const lineColor = useThemeColor({ light: '#ff7315', dark: '#ffcb22' }, 'text');
  const areaColor = useThemeColor({ light: '#ff9742', dark: '#ffc978' }, 'text');
  const gridColor = useThemeColor(
    { light: '#e1e0d9', dark: '#fff4ee' },
    'text'
  );
  const goalLineColor = useThemeColor(
    { light: '#60a65a', dark: '#60a65a' },
    'text'
  );
  const textColor = useThemeColor({ light: '#3a3434', dark: '#f1d8c7' }, 'text');

  const statTextColor = useThemeColor({ light: "#000", dark: "#f1d8c7" }, "text");
  const cardBackgroundColor = useThemeColor({ light: 'rgb(255,255,255)', dark: '#592d04' }, 'background');


  if (data.length === 0) {
    return (
      <View style={{ alignItems: "center" }}>
        <ThemedText className="text-center opacity-60">No data available</ThemedText>
      </View>
    );
  }

  const maxSteps = Math.max(...data.map((d) => d.steps), goal) || goal;
  const yMax = Math.max(maxSteps, goal) * 1.1;

  const xScale = scaleLinear().domain([0, data.length - 1]).range([0, chartWidth]);

  const yScale = scaleLinear().domain([0, yMax]).range([chartHeight, 0]);
  const goalY = yScale(goal);

  React.useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        const locationX = evt.nativeEvent.locationX - padding.left;
        const clampedX = Math.max(0, Math.min(locationX, chartWidth));
        const index = Math.round(xScale.invert(clampedX));
        const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
        setSelectedIndex(clampedIndex);
      },
      onPanResponderMove: (evt) => {
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        const locationX = evt.nativeEvent.locationX - padding.left;
        const clampedX = Math.max(0, Math.min(locationX, chartWidth));
        const index = Math.round(xScale.invert(clampedX));
        const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
        setSelectedIndex(clampedIndex);
      },
      onPanResponderRelease: () => {
        hideTimeoutRef.current = setTimeout(() => {
          setSelectedIndex(null);
          hideTimeoutRef.current = null;
        }, 1000);
      },
      onPanResponderTerminate: () => {
        hideTimeoutRef.current = setTimeout(() => {
          setSelectedIndex(null);
          hideTimeoutRef.current = null;
        }, 1000);
      },
    })
  ).current;

  // Prepare data points
  const points = data.map((d, i) => ({
    x: xScale(i),
    y: yScale(d.steps),
    steps: d.steps,
  }));

  type Point = typeof points[0];

  // Create line and area paths
  const linePath = line<Point>()
    .x((d: Point) => d.x)
    .y((d: Point) => d.y)
    .curve(curveMonotoneX)(points);

  const areaPath = area<Point>()
    .x((d: Point) => d.x)
    .y0(() => chartHeight)
    .y1((d: Point) => d.y)
    .curve(curveMonotoneX)(points);

  return (
    <View style={{ alignItems: "center" }}>
      <ThemedText className="text-sm font-semibold mb-2">30-Day Trend</ThemedText>
      <ThemedText className="text-xs opacity-70 mb-3">Goal met on {daysGoalMet}/{data.length} days</ThemedText>
      <View className=" rounded-3xl" style={{ backgroundColor: cardBackgroundColor }}>
      <View style={{ position: 'relative' }}>
      <Svg width={width} height={height}>
        {/* Baseline */}
        <Line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={padding.left + chartWidth}
          y2={padding.top + chartHeight}
          stroke={gridColor}
          strokeWidth={1}
          opacity={0.7}
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

        {/* Guide line for selected day */}
        {selectedIndex !== null && (
          <Line
            x1={padding.left + points[selectedIndex].x}
            y1={padding.top + points[selectedIndex].y}
            x2={padding.left + points[selectedIndex].x}
            y2={padding.top + chartHeight}
            stroke={lineColor}
            strokeWidth={1}
            opacity={0.4}
          />
        )}

        {/* Area fill */}
        {areaPath && (
          <Path
            d={areaPath}
            fill={areaColor}
            opacity={0.35}
            transform={`translate(${padding.left}, ${padding.top})`}
          />
        )}

        {/* Line stroke */}
        {linePath && (
          <Path
            d={linePath}
            stroke={lineColor}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={`translate(${padding.left}, ${padding.top})`}
          />
        )}

        {/* Date labels (sparse: every ~5th point) */}
        {data.map((day, i) => {
          const labelInterval = Math.ceil(data.length / 6);
          if (i % labelInterval !== 0) return null;
          const x = padding.left + xScale(i);
          const y = padding.top + chartHeight + 18;
          const dateStr = format(parseISO(day.date), 'MMM d');

          return (
            <SvgText
              key={`label-${i}`}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize={11}
              fill={textColor}
              opacity={0.7}
            >
              {dateStr}
            </SvgText>
          );
        })}
      </Svg>

      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width,
          height,
        }}
        {...panResponder.panHandlers}
      />

      {/* Tooltip overlay */}
      {selectedIndex !== null && (
        (() => {
          const day = data[selectedIndex];
          const pointX = padding.left + xScale(selectedIndex);
          const pointY = padding.top + yScale(day.steps);

          const tooltipWidth = 110;
          const tooltipHeight = 60;
          const tooltipX = Math.max(
            padding.left,
            Math.min(pointX - tooltipWidth / 2, padding.left + chartWidth - tooltipWidth)
          );
          const tooltipY = pointY - tooltipHeight - 14;

          const dayStr = format(parseISO(day.date), 'EEE, MMM d');
          const goalMet = day.steps >= goal;

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
                borderColor: goalMet ? lineColor : textColor,
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
