import mongoose from "mongoose";

export interface FundsLedgerTypes {
  clientId: mongoose.Types.ObjectId;
  ticketBookingId: mongoose.Types.ObjectId;
  ticketTotalAmount: number;
  airline: "buddha" | "shree" | "yeti" | "nepalair";
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}
