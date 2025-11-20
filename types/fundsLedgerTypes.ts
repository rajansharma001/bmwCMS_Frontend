import mongoose from "mongoose";

export interface FundsLedgerTypes {
  _id?: string;
  clientId: mongoose.Types.ObjectId;
  ticketBookingId: mongoose.Types.ObjectId;
  ticketTotalAmount: number;
  airline: "buddha" | "shree" | "yeti" | "nepalair";
  balance: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
