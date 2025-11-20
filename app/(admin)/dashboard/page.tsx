"use client";
import React, { useState, useEffect } from "react";
import {
  Car,
  Users,
  DollarSign,
  TrendingUp,
  XCircle,
  Plane,
  CreditCard,
  Clock,
  Wallet,
} from "lucide-react";

import { toast } from "sonner";
import { clientType } from "@/types/clientTypes";
import { tripTypes } from "@/types/tripTypes";
import { FundsLedgerTypes } from "@/types/fundsLedgerTypes";
import { MaintanaceTypes } from "@/types/MaintananceTypes";

// --- TYPES ---
interface TicketBookingTypes {
  _id: string;
  clientId: string;
  bookingDate: string;
  status: "pending" | "confirmed" | "cancelled" | "completed" | string;
  departureFrom: string;
  destinationTo: string;
  departureDate: string;
  airlineName?: string;
  flightNumber?: string;
  seatClass: "Economy" | "Business" | "First" | string;
  noOfPassengers: number;
  baseFare: number;
  taxesAndFees: number;
  totalAmount: number;
  bookedBy: string;
  issuedTicketNumber?: string;
  remarks?: string;
  // Virtuals
  totalPaidAmount?: number;
  balanceDue?: number;
  paymentStatus?: "pending" | "paid" | "partial" | string;

  createdAt: Date;
  updatedAt: Date;
}

const KpiCard = ({
  title,
  value,
  icon: Icon,
  theme = "primary",
  isCurrency = true,
}) => {
  const textClass = theme === "primary" ? "text-white" : "text-secondary";
  const bgClass = theme === "primary" ? "bg-primary/10" : "bg-secondary/10";

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition duration-300">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-full ${bgClass}`}>
          <Icon className={`w-6 h-6 ${textClass}`} />
        </div>
        <p className="text-sm font-semibold text-gray-400">{title}</p>
      </div>
      <div className="mt-4">
        <h3 className={`text-3xl font-bold ${textClass}`}>
          {isCurrency
            ? value !== undefined && value !== null
              ? `Rs. ${value.toLocaleString()}`
              : "Rs. 0"
            : (value || 0).toLocaleString()}
        </h3>
      </div>
    </div>
  );
};

/**
 * Airline Fund Card
 */
const AirlineFundCard = ({ airline, amount }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow border-l-4  flex flex-col justify-between hover:bg-gray-750 transition-colors border-r border-t border-b border-gray-700">
    <div className="flex justify-between items-start mb-2">
      <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">
        {airline}
      </span>
      <Plane className="w-4 h-4 text-primary/40" />
    </div>
    <span className="text-xl font-bold text-gray-100">
      Rs. {amount !== undefined ? amount.toLocaleString() : "0"}
    </span>
  </div>
);

// --- MAIN DASHBOARD COMPONENT ---

const Dashboard = () => {
  const [clients, setClients] = useState<clientType[] | null>([]);
  const [tripDetails, setTripDetails] = useState<tripTypes[] | null>([]);
  const [fundsLedger, setFundsLedger] = useState<FundsLedgerTypes[] | null>([]);
  const [ticketBookings, setTicketBookings] = useState<
    TicketBookingTypes[] | null
  >([]);

  const [maintnanceDetails, setMaintnanceDetails] = useState<
    MaintanaceTypes[] | null
  >([]);

  useEffect(() => {
    let isMounted = true;
    const getClients = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/clients/get-client`,
          { method: "GET", credentials: "include" }
        );
        const result = await res.json();
        if (isMounted && res.ok) setClients(result.getClients);
      } catch (error) {
        if (isMounted) toast.error(`API ERROR: ${error}`);
      }
    };
    getClients();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // 1. Fetch Trip Details
    let isMounted = true;
    const handleFetch = async () => {
      // ... (API call for get-trip) ...
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/trips/get-trip`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const result = await res.json();
        if (!res.ok) {
          if (isMounted) {
            toast.error(result.error);
          }
        } else {
          if (isMounted) {
            setTripDetails(result.getTrips);
          }
        }
      } catch (error) {
        if (isMounted) {
          toast.error(`API ERROR: ${error}`);
        }
      }
    };

    handleFetch();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const handleLedgerFetch = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/ledgers/get-ledger`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const result = await res.json();
        if (!res.ok) {
          if (isMounted) {
            toast.error(result.error);
          }
        } else {
          if (isMounted) {
            setFundsLedger(result.getFundsLedgerTable);
          }
        }
      } catch (error) {
        if (isMounted) {
          toast.error(`API ERROR: ${error}`);
        }
      }
    };

    handleLedgerFetch();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const handleFetch = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/get-ticket`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const result = await res.json();
        if (!res.ok) {
          if (isMounted) toast.error(result.error);
        } else {
          if (isMounted) {
            setTicketBookings(result.getTicketBookings || []);
          }
        }
      } catch (error) {
        if (isMounted) toast.error(`API ERROR: ${error}`);
      }
    };
    handleFetch();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const handleFetch = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle-maintanance/get-maintanance`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const result = await res.json();
        if (!res.ok) {
          if (isMounted) {
            toast.error(result.error);
          }
        } else {
          if (isMounted) {
            setMaintnanceDetails(result.getMaintananceRecord);
          }
        }
      } catch (error) {
        if (isMounted) {
          toast.error(`API ERROR. : ${error}`);
        }
      }
    };

    handleFetch();
    return () => {
      isMounted = false;
    };
    // refresh table when new vehicle submited
  }, []);

  const clientsWithTicketsCount = clients.filter((client) =>
    ticketBookings.some((ticket) => ticket.clientId === client._id)
  ).length;

  const clientsWithTripsCount = clients.filter((client) =>
    tripDetails.some((trip) => trip.clientId === client._id)
  ).length;

  return (
    <div className="h-screen bg-gray-900 font-sans p-4 sm:p-6 lg:p-8 text-gray-100 scroll-auto  overflow-scroll">
      <header className="mb-8 pb-4 border-b border-gray-800">
        <h1 className="text-3xl font-extrabold text-white flex items-center">
          <TrendingUp className="w-8 h-8 mr-3 text-primary" />
          Operations & Financial Dashboard
        </h1>
        <p className="text-gray-400 mt-1">
          Welcome Admin, here is your real-time performance overview.
        </p>
      </header>

      {/* --- 1. VEHICLE REPORT KPIs (Using SECONDARY Color) --- */}
      <section className="mb-10">
        <div className="flex items-center mb-4">
          <div className="w-1 h-6 bg-secondary rounded mr-3"></div>
          <h2 className="text-xl font-bold text-gray-100">
            Vehicle Report Summary
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Vehicle Customers"
            value={clientsWithTripsCount}
            icon={Users}
            theme="secondary"
            isCurrency={false}
          />
          <KpiCard
            title="Total Maintanance Cost"
            value={`Rs. ${maintnanceDetails.reduce(
              (total, maintain) => total + (maintain.cost || 0),
              0
            )}`}
            icon={Car}
            theme="secondary"
            isCurrency={false}
          />

          <KpiCard
            title="Total Trip Bookings"
            value={tripDetails
              .filter(
                (trip) =>
                  trip.paymentStatus === "completed" ||
                  trip.paymentStatus === "partial"
              )
              .reduce((total, trip) => total + (trip.totalAmount || 0), 0)}
            icon={DollarSign}
            theme="secondary"
            isCurrency={true}
          />
          <KpiCard
            title="Pending Trip Amount"
            value={tripDetails
              .filter(
                (trip) =>
                  trip.paymentStatus === "completed" ||
                  trip.paymentStatus === "partial"
              )
              .reduce((total, trip) => total + (trip.balanceDue || 0), 0)}
            icon={XCircle}
            theme="secondary"
            isCurrency={true}
          />
        </div>
      </section>

      {/* --- 2. TICKET REPORT KPIs (Using PRIMARY Color) --- */}
      <section className="mb-10">
        <div className="flex items-center mb-4">
          <div className="w-1 h-6 bg-primary rounded mr-3"></div>
          <h2 className="text-xl font-bold text-gray-100">
            Ticket Report Summary
          </h2>
        </div>

        {/* Main Ticket KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <KpiCard
            title="Ticket Customers"
            value={clientsWithTicketsCount}
            icon={Clock}
            theme="primary"
            isCurrency={false}
          />
          <KpiCard
            title="Total Available Funds"
            value={fundsLedger.reduce(
              (total, fund) => total + (fund.balance || 0),
              0
            )}
            icon={Wallet}
            theme="primary"
            isCurrency={true}
          />
          <KpiCard
            title="Total Ticket Bookings"
            value={ticketBookings.reduce(
              (total, ticket) => total + (ticket.totalAmount || 0),
              0
            )}
            icon={Plane}
            theme="primary"
            isCurrency={true}
          />
          <KpiCard
            title="Pending Ticket Amount"
            value={ticketBookings.reduce(
              (total, ticket) => total + (ticket.balanceDue || 0),
              0
            )}
            icon={CreditCard}
            theme="primary"
            isCurrency={true}
          />
        </div>

        {/* Airline Wallet Balances Breakdown */}
        <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
          Airline Wallet Balances
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AirlineFundCard
            airline="Buddha Air"
            amount={
              fundsLedger.find((ledger) => ledger.airline === "buddha_air")
                ?.balance || 0
            }
          />
          <AirlineFundCard
            airline="Shree Airlines"
            amount={
              fundsLedger.find((ledger) => ledger.airline === "shree_air")
                ?.balance || 0
            }
          />
          <AirlineFundCard
            airline="Yeti Airlines"
            amount={
              fundsLedger.find((ledger) => ledger.airline === "yeti_air")
                ?.balance || 0
            }
          />
          <AirlineFundCard
            airline="Nepal Airlines"
            amount={
              fundsLedger.find((ledger) => ledger.airline === "nepal_air")
                ?.balance || 0
            }
          />
        </div>
      </section>

      <footer className="mt-10 pt-4 border-t border-gray-800 text-center text-sm text-gray-500">
        {/* Dashboard auto-refreshed at  {new Date().toLocaleTimeString()} */}
      </footer>
    </div>
  );
};

export default Dashboard;
