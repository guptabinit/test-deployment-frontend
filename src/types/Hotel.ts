import mongoose from "mongoose";

export type Hotel = {
  _id: string;
  hotelName: string;
  hotelCity: string;
  hotelState: string;
  description: string;
  isActive: boolean;
  menuId?: string;
  ownerId: string;
  handlingManagerId?: string;
};

export type CreateHotelData = {
  hotelName: string;
  hotelCity: string;
  hotelState: string;
  description: string;
};
