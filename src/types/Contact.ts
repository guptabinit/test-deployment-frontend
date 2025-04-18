import mongoose from "mongoose";

export type CreateContactData = {
  name: string;
  serviceId: string;
  landlineContact: string;
  mobileContact?: string;
};

export type Contact = {
  _id: string;
  name: string;
  serviceId: string;
  landlineContact: string;
  mobileContact?: string;
};

export type Dialer = {
  hotelId: string;
  contacts: Contact[];
};