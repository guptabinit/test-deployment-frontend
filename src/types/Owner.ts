import mongoose from "mongoose";

export type Owner = {
    _id: string;
    userName: string;
    email: string;
    passwordHash?: string;
    role: "HotelOwner";
    isActive: boolean;
}

export type CreateOwnerData = {
    userName: string;
    email: string;
    role: "HotelOwner";
}