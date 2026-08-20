import React, { useState, useEffect } from 'react';
import { Modal, Pressable, View, Text } from 'react-native';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import {colors} from "@/src/styles/global";

type DailyGoalOverlayProps = {
  visible: boolean;
  currentGoal: number;
  onClose: () => void;
  onConfirm: (newGoal: number) => void;
};

export default function DailyGoalOverlay({
  visible,
  currentGoal,
  onClose,
  onConfirm,
}: DailyGoalOverlayProps) {
  const [pendingGoal, setPendingGoal] = useState(currentGoal);

  const backgroundColor = useThemeColor({light: colors.backgroundScreenInsights, dark: "#b57602"}, 'background');
  const textColor = useThemeColor({}, 'text');

  useEffect(() => {
    if (visible) {
      setPendingGoal(currentGoal);
    }
  }, [visible, currentGoal]);

  const handleMinus = () => {
    setPendingGoal((g) => Math.max(500, g - 500));
  };

  const handlePlus = () => {
    setPendingGoal((g) => g + 500);
  };

  const handleConfirm = () => {
    onConfirm(pendingGoal);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onPress={onClose}
      >
        <Pressable
          className="w-11/12 rounded-3xl p-5 items-center"
          style={{ backgroundColor }}
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-2xl font-bold mb-5 font-fredoka" style={{ color: textColor }}>
            Set Daily Goal
          </Text>

          <View className="flex-row justify-around w-full my-5">
            <Pressable
              className="w-16 h-16 rounded-full justify-center items-center bg-emerald-700"
              onPress={handleMinus}
            >
              <Text className="text-5xl font-bold text-white font-fredoka">−</Text>
            </Pressable>

            <Text className="text-6xl font-bold pt-1.5  font-fredoka" style={{ color: textColor }}>
              {pendingGoal.toLocaleString()}
            </Text>

            <Pressable
              className="w-16 h-16 rounded-full justify-center items-center bg-emerald-700"
              onPress={handlePlus}
            >
              <Text className="text-5xl font-bold text-white font-fredoka">+</Text>
            </Pressable>
          </View>

          <Text className="text-xl opacity-60 font-fredoka" style={{ color: textColor }}>
            steps
          </Text>

          <Pressable
            className="bg-emerald-700 px-8 py-3 rounded-full mt-5"
            onPress={handleConfirm}
          >
            <Text className="text-white text-base font-semibold font-fredoka">Confirm</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
