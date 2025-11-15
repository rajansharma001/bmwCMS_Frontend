export type TicketBookingFundsTypes = {
  _id?: string;
  fundsFor: "buddha_air" | "shree_air" | "yeti_air" | "nepal_air";
  newFund: number;
  totalFund: number;
  availableFund: number;
  status: "completed" | "reversed";
  reversedFundId?: string;
  usedFund: number;
  createdAt?: Date;
  updatedAt?: Date;
};
