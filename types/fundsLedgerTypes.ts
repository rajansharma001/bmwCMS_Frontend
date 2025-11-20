import mongoose from "mongoose";

export interface FundsLedgerTypes {
  _id?: string;
  clientId: mongoose.Types.ObjectId;
  ticketBookingId: mongoose.Types.ObjectId;
  ticketTotalAmount: number;
  airline: "buddha_air" | "shree_air" | "yeti_air" | "nepal_air";
  balance: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
