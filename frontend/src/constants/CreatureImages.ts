
import { ImageSourcePropType } from 'react-native';

// Asset-Mapping

export const creatureImages: {[key: string]: ImageSourcePropType} = {
    lumo: require ("../assets/images/spritesheets/creatures/lumo-idle-spritesheet.png"),
    hedgespike: require ("../assets/images/spritesheets/creatures/hedgespike-idle-spritesheet.png"),
    kitritual: require ("../assets/images/spritesheets/creatures/kitritual-idle-spritesheet.png"),
    aerogon: require ("../assets/images/spritesheets/creatures/aerogon-idle-spritesheet.png"),
    bobabbit: require ("../assets/images/spritesheets/creatures/bobabbit-idle-spritesheet.png"),
    whaleus: require ("../assets/images/spritesheets/creatures/whaleus-idle-spritesheet.png")
}

export const getCreatureImage = (imagekey: string) => {
  return creatureImages[imagekey] || require("../assets/images/questionmark.png");
};