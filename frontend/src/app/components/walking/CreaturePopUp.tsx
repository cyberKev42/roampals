import { CreatureResponseDTO } from "@/src/api/inventory";
import { Modal, Text, TouchableOpacity, View} from "react-native";
import Animation from "../Animation";
import React from "react";
import {useThemeColor} from "@/src/hooks/use-theme-color";
import {colors} from "@/src/styles/global";
import { ThemedText } from "@/src/components/themed-text";

// Definition der Props, die das Modal erwartet
type CreatureModalProps = {
  visible: boolean;
  spawnedCreature: CreatureResponseDTO | null;
  steps: number;
  onClose: () => void;
  onSave: () => void;
  getCreatureImage: (url: string) => any;
}

export default function CreaturePopUp({
  visible,
  spawnedCreature,
  steps,
  onClose,
  onSave,
  getCreatureImage,
}: CreatureModalProps): React.JSX.Element {

  const backgroundColor = useThemeColor({ light: "#b0f6a4", dark: "#589b5d" }, "background"); // #7cba7d , #539f82
//"#22a72d",
const popupBorderColor = useThemeColor({light: '#13aa1a',dark: '#006503'}, "tint");
const saveButtonColor = useThemeColor({light: '#539f54', dark: '#08600c'}, "tint");
const saveButtonBorderColor = useThemeColor({light: '#0a7e0c', dark: '#0a4100'}, "tint");
const closeButtonColor = useThemeColor({light: '#f04a4a', dark: '#d12121'}, "tint");
const closeButtonBorderColor = useThemeColor({light: '#c60d0d', dark: '#9c0101'}, "tint");
  
return (
    <>
    {/* <Pressable onPress={handleCreatureSpawn} /> */}
    <Modal transparent={true} visible={visible} animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50 px-4">
        <View style={{backgroundColor: backgroundColor}} className=" p-6 rounded-3xl w-5/6 max-w-sm shadow-xl items-center">
          <ThemedText type="subtitle" className="text-xl font-fredoka mb-2" lightColor="#232323" darkColor="#ffffff">
            Creature spawned!{" "}
          </ThemedText>
          {spawnedCreature && (
                <View className="bg-white w-5/6 pt-4 rounded-2xl items-center border-2" style={{borderColor: popupBorderColor, borderWidth: 2}}>
                  <Text className="font-fredoka text-2xl pb-2">{spawnedCreature.creatureName}</Text>
                  <Text className="font-fredoka mb-5">{spawnedCreature.rarity}</Text>
                  <Animation
                    source={getCreatureImage(spawnedCreature.creatureName.toLowerCase())}
                    frameCount={20}
                    frameSize={512}
                  />
                </View>
              )}
          <View className="flex-row mt-5 justify-center w-full gap-10">
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
