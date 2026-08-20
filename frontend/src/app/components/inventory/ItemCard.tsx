import {View, Text, TouchableOpacity, ColorValue} from "react-native";
import type { Items } from "../../../assets/types/types";
import { styles } from "@/src/styles/inventorystyles";
import React from "react";
import Animation from "@/src/app/components/Animation";
import { LinearGradient } from "expo-linear-gradient";
import { getItemImage } from "@/src/constants/ItemImages";

const cardTitle = "text-lg font-fredoka text-center text-[#333]";
const cardSubtitle = "text-xs font-fredoka text-[#5d5d5d] mt-2 text-center";

type ItemCardPops = {
  item: Items;
  onPress: (item: Items) => void;
};

export default function ItemCard({ item, onPress }: ItemCardPops) {

    let gradientColors: [ColorValue, ColorValue, ...ColorValue[]];
    switch (item.name) {
        case "Step-Boost":
            gradientColors = ['rgba(31, 219, 194, 0.94)','rgba(94,205,190,0.62)','rgba(94, 205, 190, 0.5)'];
            break;
        case "Creature-Magnet":
            gradientColors = ['rgba(78, 210, 111, 0.94)','rgba(89,197,116,0.62)','rgba(89, 197, 116, 0.5)'];
            break;
        case "Item-Magnet":
            gradientColors = ['rgba(255, 205, 78, 0.94)','rgba(240, 189, 51, 0.62)','rgba(246, 185, 106, 0.5)'];
            break;
        default:
            gradientColors = ['rgba(255,255,255,0.83)','rgba(255,255,255,0.38)','rgba(255,255,255,0.13)'];
            break;
    }
  return (
      <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0.3 }}
          end={{ x: 0.5, y: 1 }}
          style={{ borderRadius: 13, padding: 2.5, margin: 2 }}
      >
        <TouchableOpacity style={styles.card} className="pb-4" onPress={()=> onPress(item)}>
          <View className="w-full aspect-square justify-center items-center mb-8">
              <Animation style={{transform: [{scale: 0.7}]}}
                         source={getItemImage(item.name)}
                         frameCount={20}
                         frameSize={256}/>
          </View>
          <Text className={`${cardTitle} `} numberOfLines={1}>
            {item.name}
          </Text>
            <Text className={`${cardSubtitle}`}>Uses left: {item.quantity} </Text>
            {/*
            <Text className={`${cardSubtitle}`}>{item.description}</Text>
            <Text className={`${cardSubtitle}`}>{item.isActive}</Text>
            */}
        </TouchableOpacity>
      </LinearGradient>
  );
}
