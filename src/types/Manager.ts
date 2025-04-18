import mongoose from "mongoose";

export type Manager = {
    _id: string;
    userName: string;
    email: string;
    passwordHash: string;
    role: "BranchManager";
    isActive: boolean;
}

export type CreateManagerData = {
    userName: string;
    email: string;
    password: string;
    role: "HotelOwner";
    hotelId: string;
}