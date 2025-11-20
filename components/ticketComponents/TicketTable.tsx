"use client";
import React, { useEffect, useMemo, useState } from "react";
import Button from "../Button";
import { formInput } from "@/styles/styles";
import { toast } from "sonner";
import Alert from "../alertAndNotification/Alert";
import TicketUpdateForm from "./TicketUpdateForm";
import { clientType } from "@/types/clientTypes";
import { Loader } from "lucide-react";
import AddTicketPaymentForm from "./AddTicketPaymentForm";

// Placeholder for a single payment sub-document
interface PaymentTypes {
  _id?: string;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
  date: Date;
}

// Placeholder for the main TicketBooking document type
// This should match the ITicketBookingDocument from your model
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
  payments: PaymentTypes[];

  // Virtuals
  totalPaidAmount?: number;
  balanceDue?: number;
  paymentStatus?: "pending" | "paid" | "partial" | string;

  createdAt: Date;
  updatedAt: Date;
}

const TicketTable = ({ refreshTable }: { refreshTable: boolean }) => {
  const [ticketBookings, setTicketBookings] = useState<
    TicketBookingTypes[] | null
  >([]);
  const [ticketId, setTicketId] = useState("");
  const [globalRefreshTable, setGlobalRefreshTable] = useState(false);
  const [clients, setClients] = useState<clientType[] | null>([]);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [deleteAlertPop, setDeleteAlertPop] = useState(false);
  const [updateAlertPop, setUpdateAlertPop] = useState(false);
  const [updateFormPop, setUpdateFormPop] = useState(false);
  const [payAlertPop, setPayAlertPop] = useState(false);
  const [payFormPop, setPayFormPop] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [extraTicketData, setExtraTicketData] = useState<
    Partial<TicketBookingTypes>
  >({});

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
  }, [refreshTable, globalRefreshTable]);

  useEffect(() => {
    let isMounted = true;
    const getClients = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/clients/get-client`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const result = await res.json();
        if (isMounted && res.ok) setClients(result.getClients || []);
      } catch (error) {
        if (isMounted) toast.error(`API ERROR: ${error}`);
      }
    };
    getClients();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredData = useMemo(() => {
    if (!search.trim()) return ticketBookings;

    const lower = search.toLowerCase();

    return ticketBookings?.filter((item) => {
      const client = clients?.find((c) => c._id === item.clientId);
      const clientName = client?.clientName?.toLowerCase() || "";

      return (
        item.departureFrom?.toLowerCase().includes(lower) ||
        item.destinationTo?.toLowerCase().includes(lower) ||
        item.airlineName?.toLowerCase().includes(lower) ||
        item.flightNumber?.toLowerCase().includes(lower) ||
        item.issuedTicketNumber?.toLowerCase().includes(lower) ||
        item.status?.toLowerCase().includes(lower) ||
        clientName.includes(lower)
      );
    });
  }, [search, ticketBookings, clients]);

  const startIndex = (currentPage - 1) * rowsPerPage;

  const paginatedData =
    filteredData?.slice(startIndex, startIndex + rowsPerPage) || [];

  const totalPages = Math.ceil((filteredData?.length || 0) / rowsPerPage);

  // --- Delete Logic ---
  const handleDelete = async () => {
    setDeleteAlertPop(false);
    setIsSubmitLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/delete-ticket/${ticketId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const result = await res.json();
      setGlobalRefreshTable((prev) => !prev);
      if (!res.ok) {
        setIsSubmitLoading(false);
        toast.error(result.error);
      } else {
        toast.success("Ticket booking deleted successfully.");
        setIsSubmitLoading(false);
      }
    } catch (error) {
      toast.error(`API ERROR : ${error}`);
      setIsSubmitLoading(false);
    }
  };

  // --- PAYMENT Logic ---

  const fetchTicketForPayment = async (id: string) => {
    setIsSubmitLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/get-ticket/${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await res.json();
      console.log("Ticket: ", result);

      if (!res.ok) {
        toast.error(result.error);
      } else {
        const ticket = result.getTicketBookingById;

        if (ticket) {
          setExtraTicketData({
            totalAmount: ticket.totalAmount || 0,
            totalPaidAmount: ticket.totalPaidAmount || 0,
            balanceDue: ticket.balanceDue || 0,
            paymentStatus: ticket.paymentStatus || "",
            payments: ticket.payments || [],
          });
          setPayFormPop(true);
        } else {
          toast.error("Error: Ticket data missing from API response.");
        }
      }
    } catch (error) {
      // Note: The original toast was inside catch, which is correct, but let's clean it up:
      toast.error(`API ERROR fetching ticket: ${error}`);
    } finally {
      setIsSubmitLoading(false); // <--- STOP LOADING HERE
    }
  };

  const handlePaymentSuccess = () => {
    toast.success("Payment added successfully.");
    handlePayFormClose();
    setGlobalRefreshTable((prev) => !prev);
  };

  const handlePayFormClose = () => {
    setPayFormPop(false);
    setTicketId("");
    setExtraTicketData({});
  };

  // --- Alert & Utility Handlers ---

  const handlePayClick = (id: string) => {
    setTicketId(id);
    setPayAlertPop(true);
  };

  const handleEditClick = (id: string) => {
    setTicketId(id);
    setUpdateAlertPop(true);
  };

  const handleDeleteClick = (id: string) => {
    setTicketId(id);
    setDeleteAlertPop(true);
  };

  const handleAlertConfirmForUpdate = async () => {
    setUpdateAlertPop(false);
    setUpdateFormPop(true);
  };

  const handleAlertConfirmForPay = async () => {
    setPayAlertPop(false);
    if (ticketId) {
      fetchTicketForPayment(ticketId);
    } else {
      toast.error("Error: Ticket ID is missing.");
    }
  };

  // For Table
  const clientName = (id: string) =>
    clients?.find((c) => c._id === id)?.clientName || "Unknown";

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-center">
        {isSubmitLoading && (
          <div className="w-fit p-10 bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
            <Loader size={30} className="animate-spin" />
            <h1 className="mt-2">Deleting ticket...</h1>
          </div>
        )}
      </div>
      {/* Search Bar */}
      <div className="flex justify-end py-5">
        <input
          type="text"
          placeholder="Search Airline, Client, Flight No, TKT No..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className={`${formInput} w-full max-w-sm`}
        />
      </div>

      {/* Ticket Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-black text-sm text-left min-w-[1200px]">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-3">S.No.</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Airline</th>
              <th className="px-4 py-3">Flight No.</th>
              <th className="px-4 py-3">Departure</th>
              <th className="px-4 py-3">Destination</th>
              <th className="px-4 py-3">TKT No.</th>
              <th className="px-4 py-3">Total Fare</th>
              <th className="px-4 py-3">Total Paid</th>
              <th className="px-4 py-3">Balance Due</th>
              <th className="px-4 py-3">Payment Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((details, index) => (
                <tr
                  key={details._id as string}
                  className="border-b hover:bg-gray-100 transition text-white hover:text-black"
                >
                  <td className="px-4 py-3 font-medium">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-3">
                    {clientName(details.clientId as string)}
                  </td>
                  <td className="px-4 py-3">{details.airlineName}</td>
                  <td className="px-4 py-3">{details.flightNumber}</td>
                  <td className="px-4 py-3">{details.departureFrom}</td>
                  <td className="px-4 py-3">{details.destinationTo}</td>
                  <td className="px-4 py-3">{details.issuedTicketNumber}</td>
                  <td className="px-4 py-3">
                    Rs. {details.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-green-400 font-medium">
                    Rs. {(details.totalPaidAmount || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        (details.balanceDue || 0) > 0
                          ? "text-red-400"
                          : "text-green-400"
                      }
                    >
                      Rs. {(details.balanceDue || 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                        details.paymentStatus === "pending"
                          ? "bg-red-100 text-red-700"
                          : details.paymentStatus === "partial"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {details.paymentStatus || "pending"}
                    </span>
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center py-2 gap-2">
                      <button
                        onClick={() => handlePayClick(details._id)}
                        disabled={details.paymentStatus === "paid"}
                        className={` ${
                          details.paymentStatus === "paid"
                            ? "bg-gray-300 hover:text-white"
                            : "bg-green-600 hover:bg-green-700"
                        } text-white h-10 flex items-center justify-center rounded-sm py-4 px-7 hover:text-gray-300 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm`}
                      >
                        Pay
                      </button>
                      <button
                        disabled={details.paymentStatus === "paid"}
                        className={` ${
                          details.paymentStatus === "paid"
                            ? "bg-gray-300 hover:text-white"
                            : "bg-primary hover:bg-gray-300"
                        } text-white h-10 flex items-center justify-center rounded-sm py-4 px-7 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm`}
                        onClick={() => handleEditClick(details._id)}
                      >
                        Edit
                      </button>

                      <button
                        disabled={details.paymentStatus === "paid"}
                        className={` ${
                          details.paymentStatus === "paid"
                            ? "bg-gray-300 hover:gray-300"
                            : "bg-secondary hover:bg-gray-300"
                        } text-white h-10 flex items-center justify-center rounded-sm py-4 px-7  cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm`}
                        onClick={() => {
                          handleDeleteClick(details._id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={12}
                  className="text-center py-6 text-gray-500 italic"
                >
                  No ticket booking records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-300">
          Page {currentPage} of {totalPages}
        </p>
        <div className="space-x-2 flex justify-center items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={` text-white h-10 flex items-center justify-center rounded-sm py-4 px-7 bg-primary hover:bg-gray-500 hover:text-gray-300 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Prev
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={` text-white h-10 flex items-center justify-center rounded-sm py-4 px-7 bg-primary hover:bg-gray-500 hover:text-gray-300 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Alerts popup */}
      <div className="w-full absolute top-50">
        {payAlertPop && (
          <Alert
            cancel={() => {
              setPayAlertPop(false);
              setTicketId("");
            }}
            confirm={handleAlertConfirmForPay}
            desc="You want to record a payment for this Ticket?"
          />
        )}
        {deleteAlertPop && (
          <Alert
            cancel={() => {
              setDeleteAlertPop(false);
              setTicketId("");
            }}
            confirm={handleDelete}
            desc="You want to delete this Ticket booking?"
          />
        )}
        {updateAlertPop && (
          <Alert
            cancel={() => {
              setUpdateAlertPop(false);
              setTicketId("");
            }}
            confirm={handleAlertConfirmForUpdate}
            desc="You want to update this Ticket booking?"
          />
        )}
      </div>

      {/* Update Form Modal */}
      {updateFormPop && (
        <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <TicketUpdateForm
            // refreshTable={refreshTable}
            ticketId={ticketId}
            handleStateForUpdate={() => setUpdateFormPop(true)}
            closeForm={() => setUpdateFormPop(false)}
          />
        </div>
      )}

      {/* pay form model (Payment Modal) */}
      {payFormPop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          {isSubmitLoading ? (
            <div className="p-10 bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
              <Loader size={30} className="animate-spin" />
              <h1 className="mt-2">Fetching Ticket Details...</h1>
            </div>
          ) : (
            <div className="relative w-full md:w-[90%] lg:w-[450px] p-6 rounded-lg bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
                Record Payment for Ticket ID: {ticketId}
              </h2>

              {/* Close Button */}
              <div className="absolute top-3 right-3">
                <Button
                  btnStyle="bg-secondary text-white"
                  btnTitle="Close"
                  clickEvent={handlePayFormClose}
                />
              </div>

              {/* Current Balance Display */}
              <div className="text-center p-3 mb-4 rounded-md border border-blue-200 bg-blue-50">
                <p className="text-sm text-gray-700">Ticket Balance Due:</p>
                <p className="text-2xl font-extrabold text-blue-700">
                  Rs. {(extraTicketData.balanceDue || 0).toFixed(2)}
                </p>
              </div>

              {/* The Actual Payment Form Component */}
              <AddTicketPaymentForm
                ticketId={ticketId}
                currentBalance={extraTicketData.balanceDue}
                onPaymentSuccess={handlePaymentSuccess}
              />

              {/* Optional: Payment History Quick View */}
              {extraTicketData.payments &&
                extraTicketData.payments.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Recent Payments
                    </h4>
                    <ul className="list-disc list-inside text-xs text-gray-600 max-h-20 overflow-y-auto pl-4">
                      {extraTicketData.payments.map((p, index) => (
                        <li key={p._id || index}>
                          Rs. {p.amount} ({p.paymentMethod}) on{" "}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketTable;
