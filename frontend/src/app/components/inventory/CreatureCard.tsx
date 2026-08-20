import { View, Text, TouchableOpacity } from "react-native";
import type { Creatures } from "../../../assets/types/types";
import { RARITY_COLOR, styles } from "@/src/styles/inventorystyles";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { getCreatureImage } from "@/src/constants/CreatureImages";
import Animation from "@/src/app/components/Animation";

const imageContainer = "w-full aspect-square justify-center items-center mb-6";
const cardTitle = "text-xl font-fredoka text-center text-[#333] pb-4";
const cardSubtitle = "text-xs text-[#5d5d5d] mt-2 text-center";

type CreatureCardProps = {
  item: Creatures;
  onPress: (item: Creatures) => void;
};


export default function CreatureCard({item, onPress}: CreatureCardProps) {
  //console.log("DEBUG: item.name ist ->", JSON.stringify(item.name));
  const gradientColors = RARITY_COLOR[item.rarity];
  const isLegendary = item.rarity === "legendary";

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0.3 }}
      end={{ x: 0.5, y: 1 }}
      style={{ borderRadius: 13, padding: 2.5, margin: 2 }}
    >
      <TouchableOpacity
        style={[
          styles.card,
          isLegendary && {
            shadowColor: gradientColors[1],
            shadowOpacity: 0.7,
            shadowRadius: 5,
            shadowOffset: { width: 1, height: 1 },
          },
        ]}
        onPress={() => onPress(item)}
      >
        <View className={`${imageContainer} `}>
          <LinearGradient
              colors={["#fbfbfb", gradientColors[0]]}
              start={{ x: 0.5, y: 0.0 }}
              end={{ x: 0.8, y: 0.8 }}
              style={{ width: "100%", height: "100%",
                borderRadius: 8, borderBottomLeftRadius:12, borderBottomRightRadius:12,
                justifyContent: "center",
                alignItems: "center"}}
          >
            <Animation source={getCreatureImage(item.name.toLowerCase())}
                               frameCount={20}
                               frameSize={256}
            />
          </LinearGradient>
        </View>
        <Text className={`${cardTitle} `} numberOfLines={1}>
          {item.name}
        </Text>
       {item.quantity && item.quantity > 1 && (
        <View style={styles.quantityBadge}>
          <Text style={styles.quantityText}>x{item.quantity}</Text>
        </View>
      )}
      </TouchableOpacity>
    </LinearGradient>
  );
}
