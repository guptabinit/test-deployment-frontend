import mongoose from "mongoose";

export type Pdf = {
  _id: string;
  pdfName: string;
  pdfLink: string;
  pdfDescription: string;
  pdfType: string;
  hotelId?: string; 
};

export type CreatePdfData = {
  pdfName: string;
  pdfLink: string;
  pdfDescription: string;
  pdfType: string;
};