import mongoose from "mongoose";

export type ApplicableItem = {
  _id: string;
  name: string;
  price: number;
  pricePer: string;
};

export type Addon = {
  _id: string;
  addonName: string;
  addonDesc: string | null;
  type: "single-select" | "multi-select";
  hotelId: string; // hotelId is required in your model
  applicableItems: ApplicableItem[];
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAddonData = {
  addonName: string;
  addonDesc: string | null;
  type: "single-select" | "multi-select";
  hotelId: string;
  applicableItems: {
    name: string;
    price: number;
    pricePer: string;
  }[];
};
