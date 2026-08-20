import client from "./client";

export enum Rarity {
  COMMON = "common",
  RARE = "rare",
  EPIC = "epic",
  LEGENDARY = "legendary",
}

export enum ItemType {
    STEP_BOOST = "stepboost",
    CREATURE_BOOST = "creatureboost",
    ITEM_BOOST = "itemboost"
}

export type CreatureDTO = {
  creatureName: string;
  rarity: Rarity;
  description?: string;
  species?: string;
};

export type CreatureResponseDTO = {
  creatureId: number;
  creatureName: string;
  rarity: Rarity;
  description?: string;
  species?: string;
};

export type ItemDTO = {
  itemName: string;
  imgUrl: string;
  description: string;
};

export type ItemResponseDTO = {
  itemId: number;
  itemName: string;
  description: string;
  itemType: ItemType;
  bonusValue: number;
}

type SaveResponse = {
  success: boolean;
  message?: string;
};


export async function saveSpawnedCreature(creatureId: number): Promise<SaveResponse> {
  const { data } = await client.post<SaveResponse>( "/api/creature/save",
    {
      creatureName: "",
      Rarity: Rarity,
      wantToSave: true,
    },
    {
      params: {
        creatureId: creatureId,
      },
    },
  );
  return data;
}

export async function saveSpawnedItem(itemId: number) : Promise<SaveResponse> {
  const { data } = await client.post<SaveResponse>("/api/item/save",
    {
      itemName: "",
      itemDescription: "",
      wantToSave: true
    },
    {
      params: {
        itemId: itemId
      }
    }
  );
  return data
}

export async function getUserInventoryForCreatures(): Promise<CreatureResponseDTO[]> {
  const { data } = await client.get<CreatureResponseDTO[]>(
    "/api/creature/inventory",
  );
  return data;
}
export async function getUserInventoryForItems(): Promise<ItemResponseDTO[]> {
  const { data } = await client.get<ItemResponseDTO[]>(
    "/api/item/inventory",
  );
  return data;
}

export const getCreatureById = async (creatureId: number): Promise<any> => {
  const response = await client.get(`/api/creature/${creatureId}`);
  return response.data; // CreatureResponseDTO (id, name, rarity, description, species)
};

export const getItemById = async (itemId: number): Promise<any> => {
  const respone = await client.get(`/api/item/${itemId}`);
  return respone.data;
}
