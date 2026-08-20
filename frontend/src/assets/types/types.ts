export type Creatures = {
  id: number;
  name: string;
  requiredSteps?: number;
  imagekey: any;
  unlocked: boolean;
  rarity: "all" | "common" | "rare"| "epic" | "legendary";
  quantity?: number;
  description?: string;
  species?: string;
};

export interface GroupedCreature extends Creatures {
  quantity: number;
}

export type Items = {
  id: number;
  name: string;
  description: string;
  requiredSteps: number;
  isActive: boolean;
  imagekey: any;
  quantity?: number;
};

export type GroupedItem = Items & { quantity: number };

export type PopupItem = {
  id: number;
  name: string;
  image: any;
  description?: string;
  rarity?: any;
}

export type TabType = "creatures" | "items";