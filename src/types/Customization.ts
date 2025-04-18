import mongoose from "mongoose";

export type Customization = {
  _id: string;
  hotelId: string;
  hotelLogo: string;
  hotelColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    backgroundColor: string;
    textColor?: string;
  };
  banners: {
    bannerImage: string;
    bannerText: string;
  }[];
};

export type CreateCustomizationData = {
  hotelLogo: string;
  hotelColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    backgroundColor: string;
    textColor?: string;
  };
  banners: {
    bannerImage: string;
    bannerText: string;
  }[];
};