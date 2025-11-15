export interface tripTypes {
  _id?: string;
  clientId: string;
  vehicleId: string;
  startLocation: string;
  endLocation: string;
  noOfDays: number;
  ratePerDay: number;
  paidAmount: number;
  paymentMethod?: string;
  totalAmount?: number;
  avgKM: number;
  startKM: number;
  endKM: number;
  terms: string;
  status?: string;
  totalPaidAmount?: number;
  balanceDue?: number;
  paymentStatus?: string;
  payments?: [];
}
