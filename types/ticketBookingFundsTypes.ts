export type TicketBookingFundsTypes = {
  _id?: string;
  fundsFor: string;
  newFund: number;
  totalFund?: number;
  availableFund?: number;
  status?: "completed" | "reversed-out" | "reversal-in";
  reversedFundId?: string;
  description?: string;
  usedFund?: number;
  createdAt?: Date;
  updatedAt?: Date;
};
