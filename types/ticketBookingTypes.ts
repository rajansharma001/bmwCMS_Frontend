import { Types } from "mongoose";

export interface TicketBooking extends Document {
  clientId: Types.ObjectId | string;
  bookingDate: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";

  // Travel Details
  tripType: "one-way" | "round-trip" | "multi-city";
  departureFrom: string;
  destinationTo: string;
  departureDate: string;
  returnDate?: string;
  airlineName?: string;
  flightNumber?: string;
  seatClass?: "Economy" | "Business" | "First";
  noOfPassengers: number;

  // Pricing & Payment
  baseFare: number;
  taxesAndFees?: number;
  totalAmount: number;
  currency: string;
  paymentMethod: "cash" | "card" | "bankTransfer" | "credit";
  paymentStatus: "pending" | "paid" | "refunded";
  transactionId?: string;

  // Meta
  bookedBy: string;
  issuedTicketNumber?: string;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}
