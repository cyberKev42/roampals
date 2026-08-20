import {
  Image,
  View,
  useColorScheme,
  Alert,
  TouchableOpacity, Text,
} from "react-native";
import { colors } from "@/src/styles/global";
import DailyStepCard from "../components/walking/DailyStepCard";
import MarkedMilestoneBar from "../components/walking/MarkedMilestoneBar";
import WalkingAnimation from "../components/walking/WalkingAnimation";
import WeatherBadge from "../components/walking/WeatherBadge";
import React, { useEffect, useRef, useState } from "react";
import {
  CreatureResponseDTO,
  getCreatureById,
  getItemById,
  ItemResponseDTO,
  saveSpawnedCreature,
  saveSpawnedItem,
} from "@/src/api/inventory";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { saveStepsToBackend } from "@/src/api/walk";
import { useStepsStore } from "@/src/stores/useStepsStore";
import { toLocalDateString } from "@/src/hooks/use-accelerometer-steps";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { getCreatureImage } from "@/src/constants/CreatureImages";
import CreaturePopUp from "../components/walking/CreaturePopUp";
import {getMilestoneProgress, MilestoneProgressDTO} from "@/src/api/milestones";
import { useUserStore } from "@/src/stores/useUserStore";
import { ThemedText } from "@/src/components/themed-text";
import ItemPopUp from "../components/walking/ItemPopUp";
import { getItemImage } from "@/src/constants/ItemImages";


export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const user = useUserStore((state) => state.user);
  const virtualSteps = useStepsStore((state) => state.virtualSteps);
  const fetchSpawnConditions = useStepsStore((state) => state.fetchSpawnCondition);
  const incrementVirtualStepsAndCheck = useStepsStore((state) => state.incrementVirtualStepsAndCheck,);
  const catchUpSpawn = useStepsStore((state) => state.catchUpSpawn);
  const setCatchUpSpawn = useStepsStore((state) => state.setCatchUpSpawn);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [spawnedCreature, setSpawnedCreature] = useState<CreatureResponseDTO | null>(null);
  const [spawnedItem, setSpawnedItem] = useState<ItemResponseDTO | null>(null);
  const [saveCreature, setSaveCreature] = useState<boolean>(false);
  const [saveItem, setSaveItem] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const spawnConditions = useStepsStore((state) => state.spawnConditions);
  const [markedMilestone, setMarkedMilestone] = useState<MilestoneProgressDTO | null>(null);

  const handleSpawnTrigger = async ({ creatureId, itemId }: { creatureId?: number; itemId?: number }) => {
    try {
      setLoading(true);

        if (creatureId) {
            const creatureData = await getCreatureById(creatureId);
            setSpawnedCreature(creatureData);
        } else if (itemId) {
            const itemData = await getItemById(itemId);
            setSpawnedItem(itemData);
        }
      setIsModalVisible(true);
    } catch (error) {
      console.log("Failed to load Creature or Item.", error);
    } finally {
      setLoading(false);
    }
  };

  // spawn conditions aus backend holen sobald screen lädt
  useEffect(() => {
    fetchSpawnConditions();
  }, []);

  // zeigt alert wenn während geschlossener app zeit ein spawn passiert ist
  useEffect(() => {
    if (!catchUpSpawn) return;
    const label = catchUpSpawn.type === 'CREATURE' ? 'creature' : 'item';
    Alert.alert(
      "Welcome back!",
      `A new ${label} appeared since your last visit!`,
      [
        {
          text: "OK",
          onPress: () =>
            handleSpawnTrigger({
              creatureId: catchUpSpawn.creatureId,
              itemId: catchUpSpawn.itemId,
            }),
        },
      ]
    );
    setCatchUpSpawn(null);
  }, [catchUpSpawn]);

  const lastStepsRef = useRef<number>(0);

  // hier live-check
  useEffect(() => {
    console.log("Steps at start:", virtualSteps);
    if (virtualSteps === 0) return;
    const prevSteps = lastStepsRef.current;

    lastStepsRef.current = virtualSteps; // Merken für den nächsten Schrittwechsel

  if (!spawnConditions || spawnConditions.length === 0) {
    console.log("Cancel: spawnConditions is empty.");
    return;
  }

  //liest alle bedingungen in einer einzigen liste (kreaturen und items)
    const flattenedConditions = spawnConditions.flat(); 

    const triggeredCondition = flattenedConditions.find((condition) => {
    const reqSteps = condition?.requiredSteps || 0;
    return reqSteps > prevSteps && reqSteps <= virtualSteps;
  });

    // wenn bedingung erfüllt -> get details der kreatur oder item
    if (triggeredCondition){
      if(triggeredCondition.type === 'CREATURE'){
        handleSpawnTrigger({creatureId: triggeredCondition.creatureId });
      } else if (triggeredCondition.type === 'ITEM'){
        handleSpawnTrigger({itemId: triggeredCondition.itemId});
      } else {
        console.log("No conditions between", prevSteps, "and", virtualSteps, "found.");
      }
    }
  }, [virtualSteps, spawnConditions]); // wird getriggert wenn sich schritte ändern

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // Runs when tab loses focus (user leaves)
        const { steps, virtualSteps } = useStepsStore.getState();
        if (steps > 0) {
          saveStepsToBackend(
            steps,
            virtualSteps,
            toLocalDateString(new Date()),
          ).catch((error) => {
            console.error("Failed to save steps to backend:", error);
          });
        }
      };
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (!user?.username) return;
      getMilestoneProgress(user.username)
        .then((list) => setMarkedMilestone(list.find((m) => m.marked) ?? null))
        .catch(() => {});
    }, [user?.username])
  );

  const handleSave = async (): Promise<void> => {
    if (!user) {
      Alert.alert("Failed. You have to be logged in to save the creature!");
      return;
    }
    if (!spawnedCreature && !spawnedItem) return;

    try {
      if (spawnedCreature) {
        setSaveCreature(true);
        const creatureId = spawnedCreature.creatureId;
        console.log(creatureId);
        console.log(spawnedCreature);

      const result = await saveSpawnedCreature(creatureId);
      //Alert.alert("Creature successfully saved!");
      console.log("Server Response: ", result);

      setSpawnedCreature(null);
      }

      if (spawnedItem) {
        setSaveItem(true);
        const itemId = spawnedItem.itemId;
        console.log(itemId);
        console.log(spawnedItem);

        const resultItem = await saveSpawnedItem(itemId);
        console.log("Server Resonse:", resultItem);

        setSpawnedItem(null);
      }
      setIsModalVisible(false);
    } catch (error) {
      console.log("Failed at saving creature:", error);
    } finally {
      setSaveCreature(false);
      setSaveItem(false);
    }
  };

  const handleClose = (): void => {
    setSaveCreature(false);
    setSaveItem(false);
    setIsModalVisible(false);
    setSpawnedCreature(null);
    setSpawnedItem(null);
  };
  const backgroundColor = useThemeColor({ light: colors.backgroundScreenHome, dark: "#2c6549" }, "background"); // #7cba7d , #539f82
  const buttonTextColor = useThemeColor({ light: "#205531", dark: "#a3ecba"}, "text");

    // @ts-ignore
  return (
    <SafeAreaView style={{backgroundColor}} className="flex-1" edges={['top']}>
        <View className="justify-around flex-row">
          <WeatherBadge />
          <View className="flex-row items-center">
            <ThemedText style={{ color: buttonTextColor }} className="mt-1 text-md">
              {user?.streakCount ?? 0} {user?.streakCount && user?.streakCount > 0 ? "🔥" : ""} day streak
            </ThemedText>
          </View>
        </View>
        <DailyStepCard />
        <MarkedMilestoneBar milestone={markedMilestone} />
        <TouchableOpacity
          style={{position: "absolute",
            left: 260,
            top: 320,
            zIndex: 99,
            height: 300,
            width: 130}}
          onPress={() =>
            useStepsStore
              .getState()
              .incrementVirtualStepsAndCheck(3, (type, id) => {
                if (type === 'creature') {
                handleSpawnTrigger({ creatureId: id });
              } else if (type === 'item') {
                handleSpawnTrigger({ itemId: id });
              }
              })
            }
        >
          <ThemedText type="title" style={{ color: buttonTextColor, fontSize: 20, textAlign: "center", paddingTop:100,minHeight: 350}}>

          </ThemedText>
        </TouchableOpacity>
        <View className="w-full overflow-hidden h-80 border-green-300">
          <Image style={{width: "100%", height: 230, opacity: 1}}
                 resizeMode="cover"
                 source={
                  colorScheme === "dark"
                     ? require("@/src/assets/images/moon.png")
                      : require("@/src/assets/images/sun.png")}
          />
        </View>
        <WalkingAnimation/>
      {/* Use this bar when creature spawn and save works
        <ProgressBar progress={0.7} text=" Next creature in 260 steps" />
      */}
      {isModalVisible && spawnedCreature && (
        <CreaturePopUp
          visible={isModalVisible}
          spawnedCreature={spawnedCreature}
          steps={virtualSteps}
          onClose={handleClose}
          onSave={handleSave}
          getCreatureImage={getCreatureImage}
        />
        )}

      {isModalVisible && spawnedItem && (
        <ItemPopUp
        visible={isModalVisible}
        spawnedItem={spawnedItem}
        steps={virtualSteps}
        onClose={handleClose}
        onSave={handleSave}
        getItemImage={getItemImage}
        />
      )}
    </SafeAreaView>
  );
}
