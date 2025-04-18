import mongoose from "mongoose";

export type Category = {
  _id: string;
  serviceId: string; // Since it’s stored as ObjectId in DB
  categoryName: string;
  categoryDesc: string;
  time: string;
  isActive: boolean;
  lastUpdated: Date;
  hotelId: string; // hotelId is also ObjectId in your schema
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCategoryData = {
  categoryName: string;
  categoryDesc: string;
  time: string;
  serviceId: string;
  hotelId: string;
};
