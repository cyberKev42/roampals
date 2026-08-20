import React, { useEffect, useState } from 'react';
import { Modal, Pressable, View, Image, Text, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { AVATAR_OPTIONS } from '@/src/constants/avatars';
import {colors} from "@/src/styles/global";

type AvatarPickerModalProps = {
  visible: boolean;
  currentAvatar: string | null;
  onClose: () => void;
  onConfirm: (avatar: string, headshotId: string) => void;
};

export default function AvatarPickerModal({
  visible,
  currentAvatar,
  onClose,
  onConfirm,
}: AvatarPickerModalProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(currentAvatar);
  const [isLoading, setIsLoading] = useState(false);

  const backgroundColor = useThemeColor({ light: colors.backgroundScreenProfile, dark: "#3183b3" }, "background");
  const uiColor = useThemeColor({light: 'rgb(80,142,211)', dark: '#0b4575'}, 'background');
  const borderColor = useThemeColor({light: 'rgb(4,120,116)', dark: '#0b4575'}, 'background');
  const textColor = useThemeColor({}, 'text');

  useEffect(() => {
    if (visible) {
      setSelectedAvatar(currentAvatar);
      setIsLoading(false);
    }
  }, [visible, currentAvatar]);

  const handleConfirm = async () => {
    if (!selectedAvatar) return;

    setIsLoading(true);
    const option = AVATAR_OPTIONS.find((opt) => opt.id === selectedAvatar);
    if (option) {
      onConfirm(selectedAvatar, option.headshotId);
    }
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
          <Text className="text-3xl  font-fredoka mb-5" style={{ color: textColor }}>
            Choose Avatar
          </Text>

          <View className="flex-row justify-around gap-4 w-full mb-5">
            {AVATAR_OPTIONS.map((option) => (
              <Pressable
                key={option.id}
                onPress={() => setSelectedAvatar(option.id)}
                className={`flex-1 rounded-2xl border-2 `}
                style={ selectedAvatar === option.id ? {borderColor: uiColor, backgroundColor: uiColor} : {borderColor: '#8cb8dcc0'}}
              >
                <Image
                  source={option.image}
                  className="w-full h-96 rounded-2xl"
                  resizeMode="cover"
                />
              </Pressable>
            ))}
          </View>

          <Pressable
            className="bg-emerald-700 px-8 py-3 rounded-full mt-5"
            onPress={handleConfirm}
            disabled={isLoading}
            style={{backgroundColor: uiColor}}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base  font-fredoka">Confirm</Text>
            )}
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
