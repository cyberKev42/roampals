import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {colors} from "@/src/styles/global";
import type { Creatures, GroupedCreature, GroupedItem, Items, TabType } from "../../assets/types/types";
import { SPECIES_COLOR, DEFAULT_SPECIES_COLOR, RARITY_COLOR, styles } from "@/src/styles/inventorystyles";
import CreatureCard from "../components/inventory/CreatureCard";
import ItemCard from "../components/inventory/ItemCard";
import React from "react";
import { getCreatureImage } from "@/src/constants/CreatureImages";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { ThemedText } from "@/src/components/themed-text";
import Animation from "@/src/app/components/Animation";
import { getUserInventoryForCreatures, getUserInventoryForItems } from "@/src/api/inventory";
import {useFocusEffect} from "@react-navigation/native";
import { getItemImage } from "@/src/constants/ItemImages";
import TitleCard from "@/src/app/components/TitleCard";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";


export default function InventoryView() {
  const backgroundColor = useThemeColor(
    { light: colors.backgroundScreenInventory, dark: "rgba(74,33,152,0.87)" },
    "background",
  );

  const titleCardColor = useThemeColor(
    { light: "rgb(227,229,253)", dark: 'rgba(51,9,120,0.87)' },
    "background",
  );
  const titleCardTextColor = useThemeColor({ light: '#4a0573', dark: 'rgb(219,200,248)' }, 'text');

  const activeTabButtonBackgroundColor = useThemeColor(
    { light: "rgb(255,255,255)", dark: colors.backgroundScreenInventory },
    "background",
  );
  const activeTabButtonTextColor = useThemeColor(
    { light: "rgba(84,49,156,0.87)", dark: "rgba(60, 18, 134, 0.87)" },
    "text",
  );
  const tabButtonTextColor = useThemeColor(
    { light: "rgb(123, 123, 124)", dark: colors.backgroundScreenInventory },
    "text",
  );

  const gradientColorStart = useThemeColor({ light: "#2476d4", dark: "rgba(14,84,143,0.85)" }, "background");
  const gradientColorEnd = useThemeColor({ light: "#92c5df", dark: "rgba(91,48,172,0.87)" }, "background");


  const [collectedCreatures, setCollectedCreatures] = useState<Creatures[]>([]);
  const [collectedItems, setCollectedItems] = useState<Items[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<Creatures | Items | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<"all" | "common" | "rare" | "epic" | "legendary">("all");
  const [activeTab, setActiveTab] = useState<TabType>("creatures");

  useEffect(() => {
    const fetchInventory = async () => {
      setRefreshing(true);
      try {
        const [creatureData, itemData] = await Promise.all([
          getUserInventoryForCreatures(),
          getUserInventoryForItems()
        ]);

        setLoading(true);

        const creatureList: Creatures[] = creatureData.map((item: any) => {
          const rarityLower = item.rarity.toLowerCase() as "common" | "rare" | "epic" | "legendary";
          const imagekeyLowerCase = getCreatureImage(item.creatureName.toLowerCase());

          return {
            id: item.creatureId,
            name: item.creatureName,
            imagekey: imagekeyLowerCase,
            unlocked: true,
            rarity: rarityLower,
            description: item.description,
            species: item.species,
          };
        });

        const itemList: Items[] = itemData.map((item: any) => {
          return {
            id: item.itemId,
              name: item.itemName,
              imagekey: item.itemImage,
              description: item.description,
              requiredSteps: item.requiredSteps,
              isActive: item.isActive,
          };
        });

      setCollectedCreatures(creatureList);
      setCollectedItems(itemList);
      } catch (error) {
        console.log("Fehler beim Laden des Inventars: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const handleOpenPopup = useCallback((item: Creatures | Items) => {
    setSelectedItem(item);
  }, []);
  const handleClosePopup = useCallback(() => {
    setSelectedItem(null);
  }, []);
  const handleActivateItem = useCallback(() => {
    setSelectedItem(null);
  },[]);

  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
      React.useCallback(() => {
        const loadInventory = async () => {
          setRefreshing(true);
          try {
        const [creatureData, itemData] = await Promise.all([
          getUserInventoryForCreatures(),
          getUserInventoryForItems()
        ]);

        setLoading(true);

        const creatureList: Creatures[] = creatureData.map((item: any) => {
          const rarityLower = item.rarity.toLowerCase() as "common" | "rare" | "epic" | "legendary";
          const imagekeyLowerCase = getCreatureImage(item.creatureName.toLowerCase());

          return {
            id: item.creatureId,
            name: item.creatureName,
            imagekey: imagekeyLowerCase,
            unlocked: true,
            rarity: rarityLower,
            description: item.description,
            species: item.species,
          };
        });

        const itemList: Items[] = itemData.map((item: any) => {
          return {
            id: item.itemId,
              name: item.itemName,
              imagekey: item.itemImage,
              description: item.description,
              requiredSteps: item.requiredSteps,
              isActive: item.isActive,
          };
        });
            setCollectedCreatures(creatureList);
            setCollectedItems(itemList);
          } catch (error) {
            console.log("Fehler beim Aktualisieren des Inventars:", error);
          } finally {
            setRefreshing(false);
          }
        };
        loadInventory();
      }, [])
);

const groupCreatures = (creatures: Creatures[]): GroupedCreature[] => {
  const map = new Map<string, GroupedCreature>();

  creatures.forEach((creature => {
    // name der creature als key zum gruppieren
    if(map.has(creature.name)) {
      const exisit = map.get(creature.name)!;
      exisit.quantity += 1;
    } else {
      map.set(creature.name, {...creature, quantity: 1});
    }
  }));
  return Array.from(map.values());
};

const groupItems = (items: Items[]): GroupedItem[] => {
  const map = new Map<string, GroupedItem>();

  items.forEach((item) => {
    if(map.has(item.name)){
      const exisit = map.get(item.name)!;
      exisit.quantity += 1;
    } else {
      map.set(item.name, {...item, quantity: 1});
    }
  })
  return Array.from(map.values());
}

// filterung
const filteredCreature = collectedCreatures.filter((creature) => {
  if (selectedRarity === "all") return true;
  return creature.rarity === selectedRarity;
});

const displayedCreatures = groupCreatures(filteredCreature);
const displayedItems = groupItems(collectedItems);


  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor }}>
      <View className="py-6">
        <View style={{backgroundColor: titleCardColor}} className={"rounded-3xl w-11/12 pt-4 pb-2 px-6 self-center"}>
          <Text
            style={{color: titleCardTextColor}}
            className=" self-center text-6xl text-center font-lobster-bold"
          >
            Collection
          </Text>
        </View>
      </View>

      <View className="flex-row">
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "creatures" && [
              styles.activeTabButton,
              {
                backgroundColor: activeTabButtonBackgroundColor,
                borderColor: activeTabButtonBackgroundColor,
              },
            ],
          ]}
          onPress={() => setActiveTab("creatures")}
        >
          <ThemedText
            style={[
              styles.tabText,
              { color: tabButtonTextColor },
              activeTab === "creatures" && styles.activeTabText,
                activeTab === "creatures" && {color: activeTabButtonTextColor}
            ]}
            className="font-lilita"
          >
            Creatures
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "items" && [
              styles.activeTabButton,
              {
                backgroundColor: activeTabButtonBackgroundColor,
                borderColor: activeTabButtonBackgroundColor,
              },
            ],
          ]}
          onPress={() => setActiveTab("items")}
        >
          <ThemedText
            style={[
              styles.tabText,
              { color: tabButtonTextColor },
              activeTab === "items" && styles.activeTabText,
              activeTab === "items" && {color: activeTabButtonTextColor}
            ]}
            className="font-lilita"
          >
            Items
          </ThemedText>
        </TouchableOpacity>
      </View>

      {activeTab === "creatures" ? (
        <>
            <ThemedText className="mr-6 mb-2 text-md color-[#434343] text-right">
            {collectedCreatures.length} collected
          </ThemedText>
          <View className="mb-4 mt-2">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            >
              <TouchableOpacity
                onPress={() => setSelectedRarity("all")}
                className={`px-4 py-1.5 rounded-full border ${
                  selectedRarity === "all"
                    ? "bg-[#417254] border-[#417254]"
                    : "bg-[#f0f0f0] border-[#e0e0e0]"
                }`}
              >
                <Text
                  className={`text-sm font-fredoka ${selectedRarity === "all" ? "text-white" : "text-[#5d5d5d]"}`}
                >
                  All
                </Text>
              </TouchableOpacity>

              {(["common", "rare", "epic", "legendary"] as const).map(
                (rarity) => {
                  const isSelected = selectedRarity === rarity;
                  const capsuleColor = RARITY_COLOR[rarity][2];

                  return (
                    <TouchableOpacity
                      key={rarity}
                      onPress={() => setSelectedRarity(rarity)}
                      style={
                        isSelected
                          ? {
                              backgroundColor: capsuleColor,
                              borderColor: capsuleColor,
                            }
                          : {}
                      }
                      className={`px-4 py-1.5 rounded-full border ${isSelected ? "" : "bg-[#f0f0f0] border-[#e0e0e0]"}`}
                    >
                      <Text
                        className={`text-sm font-fredoka capitalize ${isSelected ? "text-white" : "text-[#5d5d5d]"}`}
                      >
                        {rarity}
                      </Text>
                    </TouchableOpacity>
                  );
                },
              )}
            </ScrollView>
          </View>
          <FlatList
            data={displayedCreatures}
            renderItem={({ item }) => (
              <CreatureCard item={item} onPress={handleOpenPopup} />
            )}
            keyExtractor={(item) => item.name}
            numColumns={3}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
          <Modal
            visible={selectedItem !== null} // Sichtbar, wenn ein Creature ausgewählt ist
            transparent={true}
            animationType="fade" // Einblenden
            onRequestClose={handleClosePopup}
          >
            <Pressable style={styles.modalOverlay} onPress={handleClosePopup}>
              <Pressable
                style={styles.modalContent}
                onPress={(e) => e.stopPropagation()}
              >
                {selectedItem && activeTab === "creatures" && (
                  <>
                    <View style={{backgroundColor: "white", borderColor: "#4a0573"}} className="rounded-2xl px-6 my-0 border-2">
                      <View style={{backgroundColor: "#fff"}} className="rounded-2xl w-full items-center pt-4 m-4 self-center">
                        <Animation
                            source={selectedItem.imagekey}
                            frameCount={20}
                            frameSize={256}
                            style={{transform: [{scale: 1.7}], zIndex: 99}}
                        />
                      </View>
                      <Text className="text-4xl font-lobster py-0 self-center">
                      {selectedItem.name}
                      </Text>
                    <View className="flex flex-row gap-4 w-full px-0 pt-4">
                      <Text
                        className="text-md font-fredoka"
                        style={{ color: SPECIES_COLOR[(selectedItem as Creatures).species || ""] ?? DEFAULT_SPECIES_COLOR }}
                      >
                        {(selectedItem as Creatures).species}
                      </Text>
                      <Text
                        className="text-xs font-bold px-2 border-2 rounded-full"
                        style={{
                          borderColor: RARITY_COLOR[(selectedItem as Creatures).rarity][2],
                          backgroundColor: RARITY_COLOR[(selectedItem as Creatures).rarity][2],
                          color: "#fff"
                        }}
                      >
                        {(selectedItem as Creatures).rarity?.toUpperCase()}
                      </Text>
                    </View>
                    <Text className="text-sm font-fredoka mb-7 mt-3">
                      {(selectedItem as Creatures).description}
                    </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={handleClosePopup}
                    >
                      <Text style={{color: '#00000077'}} className=" font-fredoka text-base">
                        X
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </Pressable>
            </Pressable>
          </Modal>
        </>
      ) : (
        <>
        <ThemedText className="mr-6 mb-2 text-md color-[#434343] text-right">
            {collectedItems.length} collected
          </ThemedText>
          <FlatList
            data={displayedItems}
            renderItem={({ item }) => (
              <ItemCard item={item} onPress={handleOpenPopup} />
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
          <Modal
            visible={selectedItem !== null} // Sichtbar, wenn ein Item ausgewählt ist
            transparent={true}
            animationType="fade" // Einblenden
            onRequestClose={handleClosePopup}
          >
            <Pressable style={styles.modalOverlay} onPress={handleClosePopup}>
              <Pressable
                style={styles.modalContent}
                onPress={(e) => e.stopPropagation()}
              >
                {selectedItem && activeTab === "items" && (
                  <>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={handleClosePopup}
                    >
                    <Text style={{color: '#000000'}} className=" font-fredoka text-xl">
                      X
                    </Text>
                  </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.activateButton}
                        onPress={handleActivateItem}>
                      <Text className="color-[#fff] font-bold text-base">
                        Use
                      </Text>
                    </TouchableOpacity>
                    <View style={{backgroundColor: "white", borderColor: "#4a0573"}} className="rounded-2xl border-2 px-6 pt-4 my-0 flex-column gap-3 items-start">
                      <View style={{backgroundColor: "#fff"}} className="rounded-2xl w-full items-center m-4 self-center">
                        <Animation style={{transform: [{scale: 1.0}]}}
                                   source={getItemImage(selectedItem.name)}
                                   frameCount={20}
                                   frameSize={128}/>
                      </View>
                      <View style={{backgroundColor: "#ffffff00"}} className="rounded-2xl w-full self-center ">
                        <Text style={{minWidth: 210}} className="text-4xl font-lobster py-4 self-center text-center">{selectedItem.name}</Text>
                      </View>
                      {"quantity" in selectedItem && (
                          <Text className="text-base font-fredoka text-center px-5 ">
                            Uses left: {selectedItem.quantity}
                          </Text>                      )}
                       {"description" in selectedItem && selectedItem.description ?
                      (<Text style={{minHeight: 48}} className="text-base color-[#000] font-fredoka px-5 mb-8">{selectedItem.description}</Text>) : null}
                    </View>
                  </>
                )}
              </Pressable>
            </Pressable>
          </Modal>
        </>
      )}
    </SafeAreaView>
  );
}
