export interface tripsPaymentTypes {
  _id?: string;
  amount: number;
  paymentMethod: "none" | "cash" | "bank" | "esewa";
  date: string;
}
