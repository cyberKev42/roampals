import React, { useEffect, useState } from 'react';
import {Modal, Pressable, View, Text, TextInput, ActivityIndicator, TouchableOpacity} from 'react-native';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { ThemedText } from '@/src/components/themed-text';
import { changePassword } from '@/src/api/user';
import {colors} from "@/src/styles/global";

type ChangePasswordModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function ChangePasswordModal({ visible, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const backgroundColor = useThemeColor({light: colors.backgroundScreenProfile, dark: "#3183b3"}, 'background');
  const textColor = useThemeColor({}, 'text');
  const placeholderTextColor = useThemeColor({light: "rgba(72,116,151,0.87)", dark: "rgba(173,237,255,0.82)"}, 'text');
  const borderColor = useThemeColor({ light: "#508ed3", dark: "#1b5567" }, "background");
  const uiColor = useThemeColor({light: 'rgb(80,142,211)', dark: '#0b4575'}, 'background');


  useEffect(() => {
    if (visible) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setSuccess(false);
    }
  }, [visible]);

  const handleConfirm = async () => {
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 1) {
      setError('New password must not be blank');
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Password change failed');
    } finally {
      setIsLoading(false);
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
          className="w-11/12 rounded-3xl p-5 items-center gap-3"
          style={{ backgroundColor }}
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-2xl  font-fredoka mb-3" style={{ color: textColor }}>
            Change Password
          </Text>

          {!success ? (
            <>
              <TextInput
                style={{borderColor: borderColor}}
                className="w-full border  rounded-2xl p-3 text-2xl font-fredoka text-[#11181C] dark:text-[#ECEDEE]"
                placeholder="Current Password"
                placeholderTextColor={placeholderTextColor}
                secureTextEntry
                autoCapitalize="none"
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />

              <TextInput
                style={{borderColor: borderColor}}
                className="w-full border  rounded-2xl p-3 text-2xl font-fredoka text-[#11181C] dark:text-[#ECEDEE]"
                placeholder="New Password"
                placeholderTextColor={placeholderTextColor}
                secureTextEntry
                autoCapitalize="none"
                value={newPassword}
                onChangeText={setNewPassword}
              />

              <TextInput
                style={{borderColor: borderColor}}
                className="w-full border rounded-2xl p-3 text-2xl font-fredoka text-[#11181C] dark:text-[#ECEDEE]"
                placeholder="Confirm New Password"
                placeholderTextColor={placeholderTextColor}
                secureTextEntry
                autoCapitalize="none"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              {error ? (
                <ThemedText lightColor="#e53e3e" darkColor="#ff6b6b" className="text-sm">
                  {error}
                </ThemedText>
              ) : null}

              <View className="flex-row gap-3 mt-3 w-full">
                <Pressable
                  className="flex-1 bg-gray-400 px-4 py-3 rounded-full items-center"
                  onPress={onClose}
                  disabled={isLoading}
                >
                  <Text className="text-white text-base  font-fredoka">Cancel</Text>
                </Pressable>

                <TouchableOpacity
                  style={{backgroundColor: uiColor}}
                  className="flex-1  px-4 py-3 rounded-full items-center"
                  onPress={handleConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white text-base  font-fredoka">Confirm</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <ThemedText className="text-lg  font-fredoka text-emerald-700">Password changed successfully!</ThemedText>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
