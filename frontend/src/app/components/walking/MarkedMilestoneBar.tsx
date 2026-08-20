import React from "react";
import { Text, View } from "react-native";
import { ThemedText } from "@/src/components/themed-text";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import type { MilestoneProgressDTO } from "@/src/api/milestones";
import {colors} from "@/src/styles/global";
import {IconSymbol} from "@/src/components/ui/icon-symbol.ios";

function formatValue(type: MilestoneProgressDTO['milestoneType'], value: number): string {
  if (type === 'DISTANCE') return `${(value / 1000).toFixed(0)} km`;
  return Math.floor(value).toLocaleString();
}

export default function MarkedMilestoneBar({ milestone }: { milestone: MilestoneProgressDTO | null }) {
  const trackColor = useThemeColor({ light: "#4ade8066", dark: "rgba(141,236,175,0.79)" }, 'background'); // 'rgba(255,255,255,0.29)'
  const fillColor = useThemeColor({ light: 'rgba(112,200,71,0.98)', dark: "#028c4a" }, 'text');
  const textColor = useThemeColor({ light: "#005305", dark: "rgb(203,251,228)"}, 'text');
  const markIconColor = useThemeColor({ light: "rgba(92,166,58,0.98)", dark: "rgba(141,236,175,0.79)"}, 'text');

  const progress = milestone && milestone.goalCount > 0
    ? Math.min(milestone.currentValue / milestone.goalCount, 1)
    : 0;

  let symbol = "";
    switch (milestone?.milestoneType) {
        case "STEPS":
            symbol = "shoeprints.fill";
            break;
        case "DISTANCE":
            symbol = "road.lanes";
            break;
        case "ITEMS":
            symbol = "cricket.ball.fill";
            break;
        case "CREATURES":
            symbol = "lizard.fill";
            break;
        default:
            symbol = "";
            break;
    }

  const text = milestone
    ? `${formatValue(milestone.milestoneType, milestone.currentValue)} / ${formatValue(milestone.milestoneType, milestone.goalCount)}`
    : '';

  return (
    <>
      <View className="mx-8 mb-3 flex-row items-center gap-2" style={{ opacity: milestone ? 1 : 0 }}>
          <IconSymbol name='bookmark.fill' size={20} color={markIconColor} />
          <View style={{ backgroundColor: trackColor }} className="flex-1 h-2 rounded-full overflow-hidden">
          <View style={{ width: `${progress * 100}%`, backgroundColor: fillColor }} className="h-full rounded-full" />
        </View>
        <ThemedText type="default" style={{ color: textColor, fontSize: 12, opacity: 0.8 }}>
          {text}
        </ThemedText>
          <IconSymbol name={`${symbol}`} size={20} color={markIconColor} />

      </View>
    </>
  );
}
