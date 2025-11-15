import { Types } from "mongoose";

export interface VehicleQuotationType {
  _id?: Types.ObjectId | string;
  clientId: Types.ObjectId | string;
  date: string;
  totalAmount: number;
  status: "draft" | "sent" | "accepted" | "cancelled";
  termsAndConditions: string;
}
