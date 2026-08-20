import { ImageSourcePropType } from 'react-native';

export const itemImages: {[key: string] : ImageSourcePropType} = {
  'Step-Boost': require ("../assets/images/spritesheets/items/step_boost_spritesheet.png"),
  'Creature-Magnet': require ("../assets/images/spritesheets/items/creature_boost_spritesheet.png"),
  'Item-Magnet': require ("../assets/images/spritesheets/items/item_boost_spritesheet.png")
}

export const getItemImage = (imagekey: string) => {
  return itemImages[imagekey] || require ("../assets/images/questionmark.png")
}