import mongoose from "mongoose";

export type SuperAdmin = {
  _id: string; 
  userName: string;
  email: string;
  role: "SuperAdmin";
  isActive: boolean;
  numOfBranches: number;
};

export type CreateSuperAdminData = {
  userName: string;
  email: string;
  password: string;
  role: "SuperAdmin";
};
