import { Types } from "mongoose";

export interface PaymentTypes {
  _id?: Types.ObjectId | string;
  quotationId: Types.ObjectId | string; // reference to VehicleQuotation
  totalAmount: number;
  pendingAmount: number;
  amountPaid: number;
  paymentDate: Date;
  payment_person: string;
  paymentMethod: "cash" | "bank" | "online";
  status: "pending" | "partial" | "completed";
  createdAt?: Date;
  updatedAt?: Date;
}
