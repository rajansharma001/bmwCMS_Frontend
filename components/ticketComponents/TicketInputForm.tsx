"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { Loader, CreditCard } from "lucide-react";
import { toast } from "sonner";
import Button from "../Button";

// --- PLACEHOLDER TYPES AND STYLES (Replace with your actual imports) ---

// Placeholder for Client Type (assuming it has _id, clientName, companyName)
interface ClientType {
  _id: string;
  clientName: string;
  companyName?: string;
}

// Placeholder for the main form data structure
interface TicketFormData {
  clientId: string;
  bookingDate: string;
  departureFrom: string;
  destinationTo: string;
  departureDate: string;
  airlineName: string;
  flightNumber: string;
  seatClass: "Economy" | "Business" | "First" | string;
  noOfPassengers: number;
  baseFare: number;
  taxesAndFees: number;
  totalAmount: number; // Calculated
  bookedBy: string;
  issuedTicketNumber: string;
  remarks: string;
  // New Payment Fields
  initialPaymentAmount: number;
  initialPaymentMethod: "cash" | "esewa" | "bank" | string;
  initialTransactionId: string;
}

// Placeholder style classes using Tailwind defaults
const inputLable = "block text-sm font-medium text-gray-700 mb-1";
const formInput =
  "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-sm";
const inputHelp = "mt-1 text-xs text-gray-500";
// ---------------------------------------------------------------------

const defaultFormData: TicketFormData = {
  clientId: "",
  bookingDate: new Date().toISOString().split("T")[0], // Default to today
  departureFrom: "",
  destinationTo: "",
  departureDate: new Date().toISOString().split("T")[0],
  airlineName: "",
  flightNumber: "",
  seatClass: "Economy",
  noOfPassengers: 1,
  baseFare: 0,
  taxesAndFees: 0,
  totalAmount: 0,
  bookedBy: "",
  issuedTicketNumber: "",
  remarks: "",
  initialPaymentAmount: 0,
  initialPaymentMethod: "cash",
  initialTransactionId: "",
};

const paymentMethods = ["cash", "esewa", "bank"];
const seatClasses = ["Economy", "Business", "First"];

const TicketInputForm = ({ formClose, onSubmitSuccess }) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [clients, setClients] = useState<ClientType[] | null>([]);
  const [formData, setFormData] = useState<TicketFormData>(defaultFormData);

  // Calculate total amount whenever baseFare or taxesAndFees change
  const totalAmount = formData.baseFare + formData.taxesAndFees;

  // --- Client Fetching Logic ---
  useEffect(() => {
    let isMounted = true;
    const getClients = async () => {
      // Dummy API URL - REPLACE with actual process.env variable
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/clients/get-client`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const result = await res.json();
        if (isMounted && res.ok) {
          // Assuming result.getClients holds the client array
          setClients(result.getClients || []);
        } else if (!res.ok) {
          toast.error(result.error || "Failed to fetch clients.");
        }
      } catch (error) {
        if (isMounted) toast.error(`API Error fetching clients.`, error);
      }
    };
    getClients();
    return () => {
      isMounted = false;
    };
  }, []);
  // --- END Client Fetching ---

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "noOfPassengers" ||
        name === "baseFare" ||
        name === "taxesAndFees" ||
        name === "initialPaymentAmount"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    const dataToSend = { ...formData, totalAmount };

    // Final validation based on logic from the server
    if (dataToSend.initialPaymentAmount > dataToSend.totalAmount) {
      setIsSubmitLoading(false);
      return toast.error(
        "Initial payment cannot be greater than the total ticket amount."
      );
    }
    if (
      dataToSend.initialPaymentAmount > 0 &&
      dataToSend.initialPaymentMethod === ""
    ) {
      setIsSubmitLoading(false);
      return toast.error(
        "Payment method is required if an initial payment is made."
      );
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/new-ticket`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(dataToSend),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await res.json();
      setIsSubmitLoading(false);

      if (!res.ok) {
        toast.error(result.error || "Failed to create new ticket booking.");
      } else {
        onSubmitSuccess();
        setFormData(defaultFormData);

        toast.success("Ticket booking created successfully.");
        formClose();
      }
    } catch (error) {
      setIsSubmitLoading(false);
      toast.error(`API ERROR during booking creation.`, error);
    }
  };

  const handleReset = () => {
    setFormData(defaultFormData);
  };

  return (
    <div className="w-full flex justify-center items-center  ">
      {isSubmitLoading ? (
        <div className="p-10 bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
          <Loader size={30} className="animate-spin" />
          <h1 className="mt-2">Submitting ticket...</h1>
        </div>
      ) : (
        <form
          className="relative space-y-6 w-full max-w-4xl p-8 -mt-20 rounded-xl shadow-sm bg-white border border-gray-200 "
          onSubmit={handleSubmit}
          method="POST"
        >
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">
              New Ticket Booking
            </h2>
            <Button
              btnStyle="bg-red-500 hover:bg-red-600 text-white rounded-md"
              btnTitle="Close"
              clickEvent={formClose}
            />
          </div>

          {/* GRID START — 4 columns for dense input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Client ID */}
            <div className="lg:col-span-2">
              <label htmlFor="clientId" className={inputLable}>
                Client <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="clientId"
                  name="clientId"
                  className={formInput}
                  value={formData.clientId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select client</option>
                  {clients?.map((c) => (
                    <option key={c._id as string} value={c._id as string}>
                      {c.clientName} {c.companyName ? `(${c.companyName})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <p className={inputHelp}>
                Select the client associated with this booking.
              </p>
            </div>

            {/* Booking Date */}
            <div>
              <label htmlFor="bookingDate" className={inputLable}>
                Booking Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="bookingDate"
                  name="bookingDate"
                  type="date"
                  value={formData.bookingDate}
                  onChange={handleChange}
                  required
                  className={formInput}
                />
              </div>
            </div>

            {/* Departure From */}
            <div>
              <label htmlFor="departureFrom" className={inputLable}>
                Departure From <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="departureFrom"
                  name="departureFrom"
                  type="text"
                  value={formData.departureFrom}
                  onChange={handleChange}
                  required
                  className={formInput}
                  placeholder="e.g., NPJ"
                />
              </div>
            </div>

            {/* Destination To */}
            <div>
              <label htmlFor="destinationTo" className={inputLable}>
                Destination To <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="destinationTo"
                  name="destinationTo"
                  type="text"
                  value={formData.destinationTo}
                  onChange={handleChange}
                  required
                  className={formInput}
                  placeholder="e.g., KTM"
                />
              </div>
            </div>

            {/* Departure Date */}
            <div>
              <label htmlFor="departureDate" className={inputLable}>
                Departure Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="departureDate"
                  name="departureDate"
                  type="date"
                  value={formData.departureDate}
                  onChange={handleChange}
                  required
                  className={formInput}
                />
              </div>
            </div>

            {/* Airline Name */}
            <div>
              <label htmlFor="airlineName" className={inputLable}>
                Airline Name
              </label>
              <select
                name="airlineName"
                id="airlineName"
                onChange={handleChange}
                value={formData.airlineName}
                className={`${formInput}`}
              >
                <option value="">Select Airline</option>
                <option value="buddha_air">Buddha Air</option>
                <option value="shree_air">Shree Air</option>
                <option value="yeti_air">Yeti Air</option>
                <option value="nepal_air">Nepal Airlines</option>
              </select>
              <p className={inputHelp}>Select the airline of the fund.</p>
            </div>

            {/* Flight Number */}
            <div>
              <label htmlFor="flightNumber" className={inputLable}>
                Flight Number
              </label>
              <input
                id="flightNumber"
                name="flightNumber"
                type="text"
                value={formData.flightNumber}
                onChange={handleChange}
                className={formInput}
                placeholder="e.g., QR101"
              />
            </div>
            {/* Issued Ticket Number */}
            <div>
              <label htmlFor="issuedTicketNumber" className={inputLable}>
                Ticket Number <span className="text-red-500">*</span>
              </label>
              <input
                id="issuedTicketNumber"
                name="issuedTicketNumber"
                type="text"
                value={formData.issuedTicketNumber}
                onChange={handleChange}
                required
                className={formInput}
                placeholder="e.g., 123-4567890"
              />
            </div>

            {/* Base Fare */}
            <div>
              <label htmlFor="baseFare" className={inputLable}>
                Base Fare <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="baseFare"
                  name="baseFare"
                  type="number"
                  min="0"
                  value={formData.baseFare}
                  onChange={handleChange}
                  required
                  className={formInput}
                />
              </div>
            </div>

            {/* Taxes and Fees */}
            <div>
              <label htmlFor="taxesAndFees" className={inputLable}>
                Taxes and Fees <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="taxesAndFees"
                  name="taxesAndFees"
                  type="number"
                  min="0"
                  value={formData.taxesAndFees}
                  onChange={handleChange}
                  required
                  className={formInput}
                />
              </div>
            </div>

            {/* Total Amount (Calculated) */}
            <div className="">
              <label
                htmlFor="totalAmount"
                className={`${inputLable} font-bold`}
              >
                Total Ticket Amount
              </label>
              <div className="relative">
                <input
                  id="totalAmount"
                  name="totalAmount"
                  type="text"
                  value={`Rs. ${totalAmount.toFixed(2)}`}
                  readOnly
                  className={`${formInput} bg-sky-50 text-sky-700 font-bold cursor-not-allowed`}
                />
                <p className={inputHelp}>Base Fare + Taxes and Fees.</p>
              </div>
            </div>
            {/* Seat Class */}
            <div>
              <label htmlFor="seatClass" className={inputLable}>
                Seat Class
              </label>
              <select
                id="seatClass"
                name="seatClass"
                className={formInput}
                value={formData.seatClass}
                onChange={handleChange}
              >
                {seatClasses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* No. of Passengers */}
            <div>
              <label htmlFor="noOfPassengers" className={inputLable}>
                Passengers <span className="text-red-500">*</span>
              </label>
              <input
                id="noOfPassengers"
                name="noOfPassengers"
                type="number"
                min="1"
                value={formData.noOfPassengers}
                onChange={handleChange}
                required
                className={formInput}
              />
            </div>
            {/* Booked By */}
            <div>
              <label htmlFor="bookedBy" className={inputLable}>
                Booked By <span className="text-red-500">*</span>
              </label>
              <input
                id="bookedBy"
                name="bookedBy"
                type="text"
                value={formData.bookedBy}
                onChange={handleChange}
                required
                className={formInput}
                placeholder="Agent name"
              />
            </div>

            {/* --- INITIAL PAYMENT BLOCK --- */}
            <div className="lg:col-span-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" /> Initial Payment Details
              </h3>
            </div>

            {/* Initial Payment Amount */}
            <div>
              <label htmlFor="initialPaymentAmount" className={inputLable}>
                Initial Payment Amount
              </label>
              <input
                id="initialPaymentAmount"
                name="initialPaymentAmount"
                type="number"
                min="0"
                max={totalAmount}
                value={formData.initialPaymentAmount}
                onChange={handleChange}
                className={formInput}
              />
              {formData.initialPaymentAmount > totalAmount && (
                <p className={`${inputHelp} text-red-600 font-medium`}>
                  Payment cannot be greater than $ {totalAmount.toFixed(2)}.
                </p>
              )}
            </div>

            {/* Initial Payment Method */}
            <div>
              <label htmlFor="initialPaymentMethod" className={inputLable}>
                Payment Method
              </label>
              <select
                id="initialPaymentMethod"
                name="initialPaymentMethod"
                className={formInput}
                value={formData.initialPaymentMethod}
                onChange={handleChange}
                required={formData.initialPaymentAmount > 0}
              >
                <option value="">Select Method (If paying)</option>
                {paymentMethods.map((m) => (
                  <option key={m} value={m}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Initial Transaction ID */}
            <div className="lg:col-span-2">
              <label htmlFor="initialTransactionId" className={inputLable}>
                Transaction ID (Optional)
              </label>
              <input
                id="initialTransactionId"
                name="initialTransactionId"
                type="text"
                value={formData.initialTransactionId}
                onChange={handleChange}
                className={formInput}
                placeholder="Enter transaction or reference ID"
              />
            </div>

            {/* Remarks (Full Width) */}
            <div className="lg:col-span-2">
              <label htmlFor="remarks" className={inputLable}>
                Remarks / Notes
              </label>
              <textarea
                id="remarks"
                name="remarks"
                rows={3}
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Add any special notes or conditions..."
                className={`${formInput} w-full `}
              ></textarea>
              <p className={inputHelp}>Add any special notes or conditions.</p>
            </div>
            {/* Buttons */}
            <div className="  lg:col-span-2 flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <Button btnStyle="" btnTitle="Save" />
              <Button
                clickEvent={handleReset}
                btnStyle="bg-red-500 hover:bg-gray-400 text-gray-800 rounded-md h-10"
                btnTitle="Reset"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default TicketInputForm;
