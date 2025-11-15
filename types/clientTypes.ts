import { Types } from "mongoose";
export interface clientType {
  _id?: Types.ObjectId | string;
  clientName: string;
  companyName?: string | null;
  email?: string;
  phone: string;
  mobile: string;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
}
