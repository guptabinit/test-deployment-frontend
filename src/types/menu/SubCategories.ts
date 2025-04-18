import mongoose from "mongoose";

export type SubCategory = {
  _id: string;
  categoryId: string;
  subCategoryName: string;
  subCategoryDesc: string;
  time: string;
  isActive: boolean;
  lastUpdated: Date;
  hotelId: string;
};

export type CreateSubCategoryData = {
  subCategoryName: string;
  subCategoryDesc: string;
  time: string;
  categoryId: string;
  hotelId: string;
};
