import mongoose from "mongoose";

export type Tag = {
  _id: string;
  tagName: string;
  tagDesc?: string;
  hotelId?: string; // as per model
};

export type CreateTagData = {
  tagName: string;
  tagDesc?: string;
  hotelId?: string;
};
