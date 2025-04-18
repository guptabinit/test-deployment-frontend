import mongoose from "mongoose";
import { ApplicableItem, Addon } from "./Addons";

export type Item = {
  _id: string;
  itemName: string;
  itemDesc: string | null;
  itemImage: string | null;
  price: number;
  pricePer: string;
  isFood: boolean;
  vegNonVeg: "Veg" | "Non-Veg" | "Egg" | null;
  calories: number | null;
  portionSize: string | null;
  tags: string[];
  isAvailable: boolean;
  willHaveAddon: boolean;
  addons: Addon[] | []; // Should match ApplicableItemSchema structure from your addon file
  subCategoryId: string | null;
  categoryId: string;
  serviceId: string;
  hotelId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateItemData = {
  itemName: string;
  itemDesc: string | null;
  itemImage: string;
  price: number;
  pricePer: string;
  isFood: boolean;
  vegNonVeg: "Veg" | "Non-Veg" | "Egg" | null;
  calories?: number | null;
  portionSize?: string | null;
  tags?: string[];
  willHaveAddon: boolean;
  addons?: string[]; // Usually you'll just pass IDs or names of applicable addons here when creating
  subCategoryId: string | null;
  categoryId: string;
  serviceId: string;
  hotelId: string;
};
