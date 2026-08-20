import { Dimensions, StyleSheet } from 'react-native';
import type { Creatures }  from '../assets/types/types'
import {colors} from "@/src/styles/global";
import {useThemeColor} from "@/src/hooks/use-theme-color";

const SCREEN_WIDTH = Dimensions.get("window").width;
export const CARD_WIDTH = (SCREEN_WIDTH - 48) / 3;

export const RARITY_COLOR: Record<Creatures["rarity"], [string, string, string]> = {
  all: ["#d7d7d7","#d7d7d7","#d7d7d7"],
  common: ["#cdffc7","#1eff00", "#00ae09"],
  rare: ["#c1e9ff","#4fa7ff","#0c32ca"],
  epic: ["#f4caff","#c15cf0","#9122c4"],
  legendary: ["#fffdd7","#fff200","#ffc800"]
}

export const SPECIES_COLOR: Record<string, string> = {
  "Glow Wisp": "#eabc06",
  "Thistleback": "#4a7c59",
  "Moon Familiar": "#8b5cf6",
  "Sky Serpent": "#38bdf8",
  "Bubble Hare": "#f472b6",
  "Tide Leviathan": "#1343e1",
};

export const DEFAULT_SPECIES_COLOR = "#60a5fa";


export const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 2,
    paddingBottom: 80,
  },
  row: {
    justifyContent: "flex-start",
    gap: 1,
    marginBottom: 10,
  },
  image: {
    margin: 5,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 8
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 3
  },
  card: {
    backgroundColor: "rgba(250, 247, 247, 0.60)",
    width: CARD_WIDTH,
    borderRadius: 10,
    padding: 2,
    margin: 2,
    alignItems: "center",
  },
  tabButton: {
    flex: 2,
    marginLeft:15,
    marginRight:15,
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
    textAlign: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "white"
  },
  activeTabButton: {
    flex: 2,
    borderColor: "green",
    textAlign: "center",
    alignItems: "center"
  },
  tabText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#7e7d7d",
  },
  activeTabText: {
    fontWeight: "600",
  },
  quantityBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(3, 107, 55, 0.86)', 
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12
  },
  quantityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  //styles für pop-up fenster
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "70%",
    backgroundColor: "#E3E5FDFF",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },
  bigImage: {
    width: "100%",
    height: "100%",
    marginBottom: 20
  },
  closeButton: {
      backgroundColor: "#faf2ffee",
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 40,
      borderWidth: 1,
      borderColor: "#aeabab",
      position: "absolute",
      left: 244,
      top: -8,
      zIndex: 100
  },
  activateButton: {
    backgroundColor: "#ffbe0b",
    borderWidth: 2,
    borderColor: "#f88f06",
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 22,
    position: "absolute",
    left: 91,
    top: 360,
    zIndex: 100

  },
});