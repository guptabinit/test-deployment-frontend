import { Document, Types } from "mongoose";

interface Amenity {
  name: string;
  description: string;
}

interface GalleryItem {
  url: string;
  caption?: string;
}

interface Overview {
  name: string;
  hotelStreet: string;
  hotelCity: string;
  hotelState: string;
  hotelCountry: string;
  openingTime: string;
  closingTime: string;
  phoneNumber: string;
}

export interface About extends Document {
  overview: Overview;
  amenities: Amenity[];
  gallery: GalleryItem[];
  about: string | Record<string, any>; // Supports TipTap's JSON or HTML string
  hotelId: string;
}
