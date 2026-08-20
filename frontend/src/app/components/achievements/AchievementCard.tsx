import React from 'react';
import { Pressable, View } from 'react-native';
import { ThemedText } from '@/src/components/themed-text';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { IconSymbol } from '@/src/components/ui/icon-symbol.ios';
import type { MilestoneProgressDTO } from '@/src/api/milestones';

function formatValue(type: MilestoneProgressDTO['milestoneType'], value: number): string {
  if (type === 'DISTANCE') {
    return `${(value / 1000).toFixed(1)} km`;
  }
  return Math.floor(value).toLocaleString();
}

function formatAccomplishedDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = String(date.getFullYear()).slice(-2);
  return `${day} ${month} ${year}`;
}

export default function AchievementCard({ milestone, onMark }: { milestone: MilestoneProgressDTO; onMark?: () => void }) {
  const { milestoneName, description, milestoneType, goalCount, currentValue, completed, accomplishedDate, marked } = milestone;

  const cardBackground = useThemeColor({ light: '#ffffff', dark: '#5c1717' }, 'background');
  const trackColor = useThemeColor({ light: '#f0ccc677', dark: '#7d2822ba' }, 'background');
  const fillColor = useThemeColor({ light: '#e92b15', dark: '#eea4a4f0' }, 'text');
  const completedFillColor = useThemeColor({ light: '#4ad50a', dark: '#7bb65f' }, 'text');
  const cardTextColor = useThemeColor({ light: "#000", dark: "#fffbfb" }, "text");


  const progress = goalCount > 0 ? Math.min(currentValue / goalCount, 1) : 0;

  return (
    <View style={{ backgroundColor: cardBackground }} className="rounded-3xl px-4 pt-5 pb-3 gap-2">
      <View className="flex-row items-center justify-between">
        <ThemedText style={{ color: cardTextColor}} type="subtitle" className="font-lilita">{milestoneName}</ThemedText>
        {completed && accomplishedDate ? (
          <ThemedText type="default" className="" style={{ color: cardTextColor, fontSize: 12, opacity: 0.6 }}>
            {`Achieved ${formatAccomplishedDate(accomplishedDate)}`}
          </ThemedText>
        ) : (
          <Pressable onPress={onMark} hitSlop={8}>
            <IconSymbol name={marked ? 'bookmark.fill' : 'bookmark'} size={20} color={cardTextColor} />
          </Pressable>
        )}
      </View>

      <ThemedText type="default" className="" style={{ color: cardTextColor, fontSize: 13, opacity: 0.6 }}>
        {description}
      </ThemedText>

      <View style={{ backgroundColor: trackColor }} className="h-3 rounded-full overflow-hidden mt-1">
        <View
          style={{
            width: `${progress * 100}%`,
            backgroundColor: completed ? completedFillColor : fillColor,
          }}
          className="h-full rounded-full"
        />
      </View>

      <ThemedText type="default" className="font-monomaniac" style={{ color: cardTextColor, fontSize: 12, opacity: 0.7, alignSelf: 'flex-end' }}>
        {formatValue(milestoneType, currentValue)} / {formatValue(milestoneType, goalCount)}
      </ThemedText>
    </View>
  );
}
