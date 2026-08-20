import { ItemResponseDTO } from "@/src/api/inventory";
import { Modal, Text, TouchableOpacity, View} from "react-native";
import Animation from "../Animation";
import React from "react";
import {useThemeColor} from "@/src/hooks/use-theme-color";
import { ThemedText } from "@/src/components/themed-text";

// Definition der Props, die das Modal erwartet
type ItemModalProps = {
  visible: boolean;
  spawnedItem: ItemResponseDTO | null;
  steps: number;
  onClose: () => void;
  onSave: () => void;
  getItemImage: (url: string) => any;
}

export default function ItemPopUp({
  visible,
  spawnedItem,
  steps,
  onClose,
  onSave,
  getItemImage,
}: ItemModalProps): React.JSX.Element {

  const backgroundColor = useThemeColor({ light: '#fcf267', dark: "#f3d425" }, "background"); // #7cba7d , #539f82
  // #127c14 , #539f82, #f04a4a,#b52424, #fdd431
  const popUpBorderColor = useThemeColor({light: '#fdd431 ', dark: '#e5b700 '}, "text");
const saveButtonColor = useThemeColor({light: '#539f54', dark: '#08600c'}, "tint");
const saveButtonBorderColor = useThemeColor({light: '#0b640d', dark: '#0a4100'}, "tint");
const closeButtonColor = useThemeColor({light: '#f04a4a', dark: '#d12121'}, "tint");
const closeButtonBorderColor = useThemeColor({light: '#bb0a0a', dark: '#9c0101'}, "tint");

  return (
    <>
    <Modal transparent={true} visible={visible} animationType="fade">
      <View className="flex-1 w-full justify-center items-center bg-black/50 px-4">
        <View style={{backgroundColor: backgroundColor}} className=" p-6 rounded-3xl w-5/6 max-w-sm shadow-xl items-center">
          <ThemedText type="subtitle" className="text-2xl font-fredoka mb-2" lightColor="#232323" darkColor="#ffffff">
            Item found!{" "}
          </ThemedText>
          
          {spawnedItem && (
                <View className="bg-white w-5/6 pt-4 rounded-2xl items-center border-2 border-[#e5b700]">
                  <Text className="font-fredoka text-2xl pb-2">{spawnedItem.itemName}</Text>
                  <Text className="font-fredoka mb-5">{spawnedItem.description}</Text>
                  <Animation
                    source={getItemImage(spawnedItem.itemName)}
                    frameCount={20}
                    frameSize={512}
                  />
                </View>
              )}
          <View className="flex-row w-full mt-5 justify-center gap-10">
            <TouchableOpacity
              onPress={onSave}
              className="py-[10px] px-[30px] rounded-[20px] border-[2px]" style={{backgroundColor: saveButtonColor, borderColor: saveButtonBorderColor}}
            >
              <Text className="text-white font-fredoka">Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              className="py-[10px] px-[30px] rounded-[20px] border-[2px]" style={{backgroundColor: closeButtonColor, borderColor: closeButtonBorderColor}}
            >
              <Text className="text-white font-fredoka">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    </>
  );
}
