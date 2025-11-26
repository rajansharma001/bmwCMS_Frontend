"use client";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import Button from "../Button";
import { tripTypes } from "@/types/tripTypes";
import { clientType } from "@/types/clientTypes";
import { VehicleType } from "@/types/vehicleTypes";
import { formInput, inputHelp, inputLable } from "@/styles/styles";
import { toast } from "sonner";
import Alert from "../alertAndNotification/Alert";
import { Loader } from "lucide-react";
import { tripsPaymentTypes } from "@/types/tripsPaymentTypes";
import { AddPaymentForm } from "./AddPaymentForm";

const initialFormDataState: Omit<tripTypes, "payments" | "paymentMethod"> = {
  clientId: "",
  vehicleId: "",
  startLocation: "",
  endLocation: "",
  noOfDays: 0,
  ratePerDay: 0,
  totalAmount: 0,
  paidAmount: 0,
  avgKM: 0,
  startKM: 0,
  endKM: 0,
  terms: "",
};

const TripTable = ({ refreshTable }: { refreshTable: boolean }) => {
  const [tripDetails, setTripDetails] = useState<tripTypes[] | null>([]);
  const [clients, setClients] = useState<clientType[] | null>([]);
  const [vehicles, setVehicles] = useState<VehicleType[] | null>([]);
  const [tripId, setTripId] = useState("");
  const [globalRefreshTable, setGlobalRefereshTable] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [deleteAlertPop, setDeleteAlertPop] = useState(false);
  const [updateAlertPop, setUpdateAlertPop] = useState(false);
  const [updateFormPop, setUpdateFormPop] = useState(false);
  const [payAlertPop, setPayAlertPop] = useState(false);
  const [payFormPop, setPayFormPop] = useState(false); // State for the payment modal

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // State to hold the data for the update form
  const [formData, setFormData] = useState<tripTypes | Omit<tripTypes, "_id">>(
    initialFormDataState as Omit<tripTypes, "_id">
  );

  // State to hold extra trip data, including virtuals and payments, for both update and pay modals
  const [extraTripData, setExtraTripData] = useState<Partial<tripTypes>>({});

  // --- Data Fetching Hooks (Omitted for brevity, but kept logic intact) ---
  // ... (useEffect blocks for fetching trips, clients, and vehicles remain here) ...

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
  }, [refreshTable, globalRefreshTable]);

  useEffect(() => {
    // 2. Fetch Clients
    let isMounted = true;
    const getClients = async () => {
      // ... (API call for get-client) ...
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
    // 3. Fetch Vehicles
    let isMounted = true;
    const getVehicle = async () => {
      // ... (API call for get-vehicles) ...
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle/get-vehicles`,
          { method: "GET", credentials: "include" }
        );
        const result = await res.json();
        if (isMounted && res.ok) {
          setVehicles(result.getVehicle);
        } else {
          if (isMounted) console.log("Something went wrong fetching vehicles.");
        }
      } catch (error) {
        if (isMounted) toast.error(`API ERROR: ${error}`);
      }
    };
    getVehicle();
    return () => {
      isMounted = false;
    };
  }, []);

  // --- Filtering & Pagination Logic (Omitted for brevity) ---
  // ... (filteredData, startIndex, paginatedData, totalPages logic remains here) ...
  const filteredData = useMemo(() => {
    if (!search.trim()) return tripDetails;
    const lower = search.toLowerCase();
    return tripDetails?.filter(
      (item) =>
        item.clientId?.toString().toLowerCase().includes(lower) ||
        item.startLocation?.toLowerCase().includes(lower) ||
        item.endLocation?.toLowerCase().includes(lower) ||
        item.noOfDays?.toString().toLowerCase().includes(lower) ||
        item.ratePerDay?.toString().toLowerCase().includes(lower) ||
        item.totalAmount?.toString().toLowerCase().includes(lower) ||
        item.paidAmount?.toString().toLowerCase().includes(lower) ||
        item.startKM?.toString().toLowerCase().includes(lower) ||
        item.endKM?.toString().toLowerCase().includes(lower) ||
        item.terms?.toLowerCase().includes(lower) ||
        item.status?.toLowerCase().includes(lower) ||
        clients
          ?.find((c) => c._id === item.clientId)
          ?.clientName?.toLowerCase()
          .includes(lower) ||
        vehicles
          ?.find((v) => v._id === item.vehicleId)
          ?.v_number?.toLowerCase()
          .includes(lower)
    );
  }, [search, tripDetails, clients, vehicles]);

  // Calculate paginated data
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData =
    filteredData?.slice(startIndex, startIndex + rowsPerPage) || [];
  const totalPages = Math.ceil((filteredData?.length || 0) / rowsPerPage);

  // --- Delete Logic (Omitted for brevity) ---
  const handleDelete = async () => {
    // ... (DELETE API call logic remains here) ...
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trips/delete-trip/${tripId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error);
      } else {
        setDeleteAlertPop(false);
        setGlobalRefereshTable((prev) => !prev);
        toast.success("Trip deleted successfully.");
      }
    } catch (error) {
      toast.error(`API ERROR. : ${error}`);
    }
  };

  // --- UPDATE Logic ---

  const fetchTripById = async (id: string) => {
    setIsSubmitLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trips/get-trip/${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error);
        setUpdateAlertPop(false);
      } else {
        const trip = result.tripById;

        // Set the fields that are directly editable in the form
        setFormData({
          vehicleId: trip.vehicleId,
          clientId: trip.clientId,
          startLocation: trip.startLocation,
          endLocation: trip.endLocation,
          avgKM: trip.avgKM,
          ratePerDay: trip.ratePerDay,
          noOfDays: trip.noOfDays,
          startKM: trip.startKM,
          endKM: trip.endKM,
          terms: trip.terms || "",
          totalAmount: trip.totalAmount,
          paidAmount: trip.paidAmount || 0,
        });

        // Set derived/virtual fields for display in the payment summary section
        setExtraTripData({
          totalAmount: trip.totalAmount, // Keep original total for comparison
          totalPaidAmount: trip.totalPaidAmount,
          balanceDue: trip.balanceDue,
          paymentStatus: trip.paymentStatus,
          payments: trip.payments || [],
        });

        setUpdateFormPop(true);
      }
    } catch (error) {
      toast.error(`API ERROR. : ${error}`);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Convert numeric inputs to number type for calculations/state, otherwise keep as string
    const newValue = [
      "noOfDays",
      "ratePerDay",
      "avgKM",
      "startKM",
      "endKM",
      "paidAmount",
    ].includes(name)
      ? Number(value)
      : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    const calculatedTotalAmount =
      Number(formData.ratePerDay) * Number(formData.noOfDays);

    const updatePayload = {
      ...formData,
      noOfDays: Number(formData.noOfDays),
      ratePerDay: Number(formData.ratePerDay),
      avgKM: Number(formData.avgKM),
      startKM: Number(formData.startKM),
      endKM: Number(formData.endKM),
      totalAmount: calculatedTotalAmount,
      paidAmount: Number(formData.paidAmount),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trips/update-trip/${tripId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatePayload),
        }
      );

      const result = await res.json();
      if (!res.ok) {
        setIsSubmitLoading(false);

        toast.error(result.error);
      } else {
        setIsSubmitLoading(false);

        setUpdateFormPop(false);
        setGlobalRefereshTable((prev) => !prev);
        toast.success("Trip details updated successfully.");
      }
    } catch (error) {
      toast.error(`API ERROR. : ${error}`);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // --- PAYMENT Logic ---

  const fetchTripForPayment = async (id: string) => {
    setIsSubmitLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trips/get-trip/${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error);
      } else {
        const trip = result.tripById;

        // Set derived/virtual fields for display in the payment form
        setExtraTripData({
          totalAmount: trip.totalAmount,
          totalPaidAmount: trip.totalPaidAmount,
          balanceDue: trip.balanceDue,
          paymentStatus: trip.paymentStatus,
          payments: trip.payments || [],
        });

        setPayFormPop(true); // Open the payment form
      }
    } catch (error) {
      toast.error(`API ERROR. : ${error}`);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast.success("Payment added successfully.");
    handlePayFormClose(); // Reset state and close the form
    setGlobalRefereshTable((prev) => !prev); // Refresh the main table data
  };

  const handlePayFormClose = () => {
    setPayFormPop(false);
    setTripId("");
    setExtraTripData({});
  };

  // --- Alert & Utility Handlers ---

  const handleReset = () => {
    setFormData(initialFormDataState as Omit<tripTypes, "_id">);
    setExtraTripData({}); // Also clear extra data
  };

  const handlePayClick = (id: string) => {
    setTripId(id);
    setPayAlertPop(true);
  };

  const handleEditClick = (id: string) => {
    setTripId(id);
    setUpdateAlertPop(true);
  };

  const handleDeleteClick = (id: string) => {
    setTripId(id);
    setDeleteAlertPop(true);
  };

  const handleAlertConfirmForUpdate = async () => {
    setUpdateAlertPop(false);
    await fetchTripById(tripId);
  };

  const handleAlertConfirmForPay = async () => {
    setPayAlertPop(false);
    await fetchTripForPayment(tripId);
  };

  // --- Derived Values for Display ---

  const currentTotalAmount =
    Number(formData.ratePerDay) * Number(formData.noOfDays);
  const currentBalanceDue =
    currentTotalAmount - (extraTripData.totalPaidAmount || 0);

  const clientName = (id: string) =>
    clients?.find((c) => c._id === id)?.clientName || "Unknown";
  const vehicleNumber = (id: string) =>
    vehicles?.find((v) => v._id === id)?.v_number || "Unknown";

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="flex justify-end py-5">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset page on search
          }}
          className={`${formInput}`}
        />
      </div>

      {/* Trip Table */}
      <table className="w-full border-collapse bg-black text-sm text-left scroll-auto">
        <thead className="bg-primary text-white">
          <tr>
            <th className="px-4 py-3">S.No.</th>
            <th className="px-4 py-3">Client</th>
            <th className="px-4 py-3">Vehicle</th>
            <th className="px-4 py-3">Start Location</th>
            <th className="px-4 py-3">End Location</th>
            <th className="px-4 py-3">Rate/Day</th>
            <th className="px-4 py-3">Days</th>
            <th className="px-4 py-3">Total Amount</th>
            {/* UPDATED: Total Paid Amount (Virtual) */}
            <th className="px-4 py-3">Total Paid</th>
            {/* UPDATED: Balance Due (Virtual) */}
            <th className="px-4 py-3">Balance Due</th>
            {/* UPDATED: Payment Status (Virtual) */}
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
                {/* S.No */}
                <td className="px-4 py-3 font-medium">
                  {startIndex + index + 1}
                </td>

                {/* Client Name */}
                <td className="px-4 py-3">
                  {clientName(details.clientId as string)}
                </td>

                {/* Vehicle */}
                <td className="px-4 py-3">
                  {vehicleNumber(details.vehicleId as string)}
                </td>

                {/* Locations */}
                <td className="px-4 py-3">{details.startLocation}</td>
                <td className="px-4 py-3">{details.endLocation}</td>

                {/* KM & Rate */}
                <td className="px-4 py-3">Rs. {details.ratePerDay}</td>
                <td className="px-4 py-3">{details.noOfDays}</td>

                {/* Amounts */}
                <td className="px-4 py-3">Rs. {details.totalAmount}</td>

                {/* 🔴 UPDATED: Total Paid Amount (Using Virtual) */}
                <td className="px-4 py-3 text-green-400 font-medium">
                  Rs. {details.totalPaidAmount || 0}
                </td>

                {/* 🔴 UPDATED: Balance Due (Using Virtual) */}
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

                {/* 🔴 UPDATED: Payment status (Using Virtual) */}
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

                {/* Action Buttons */}
                <td className="">
                  <div className="flex items-center justify-center py-2 gap-2">
                    <button
                      onClick={() => handlePayClick(details._id)}
                      disabled={details.paymentStatus === "completed"}
                      className={` ${
                        details.paymentStatus === "completed"
                          ? "bg-gray-300 hover:text-white"
                          : "bg-green-600 hover:bg-green-700"
                      }   text-white h-10 flex items-center justify-center rounded-sm  py-4 px-7  hover:text-gray-300 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm `}
                    >
                      Pay
                    </button>
                    <Button
                      btnStyle="bg-primary"
                      btnTitle="Edit"
                      clickEvent={() => handleEditClick(details._id)}
                    />
                    <Button
                      btnStyle="bg-secondary"
                      btnTitle="Delete"
                      clickEvent={() => handleDeleteClick(details._id)}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={16} // Updated colspan to 16
                className="text-center py-6 text-gray-500 italic"
              >
                No trip records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
              setTripId("");
            }}
            confirm={handleAlertConfirmForPay}
            desc="You want to record a payment for this Trip?"
          />
        )}

        {deleteAlertPop && (
          <Alert
            cancel={() => {
              setDeleteAlertPop(false);
              setTripId("");
            }}
            confirm={handleDelete}
            desc="You want to delete this Trip record?"
          />
        )}

        {updateAlertPop && (
          <Alert
            cancel={() => {
              setUpdateAlertPop(false);
              setTripId("");
            }}
            confirm={handleAlertConfirmForUpdate}
            desc="You want to update this Trip record?"
          />
        )}
      </div>

      {/* Update Form Modal (Omitted for brevity, but remains here) */}
      {updateFormPop && (
        <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          {isSubmitLoading ? (
            <div className="w-full flex justify-center items-center absolute top-0 left-0 h-full bg-black/30">
              <div className="p-10 w-fit bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
                <Loader size={30} className="animate-spin" />
                <h1 className="mt-2">Updating Trip...</h1>
              </div>
            </div>
          ) : (
            <form
              className="relative space-y-6 w-full md:w-[85%] lg:w-[70%] p-10 rounded-sm bg-white max-h-[90vh] overflow-y-auto"
              onSubmit={handleUpdate}
              method="POST"
            >
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
                Update Trip Details
              </h2>

              <div className="absolute top-2 right-2">
                <Button
                  btnStyle="bg-secondary text-white"
                  btnTitle="Close"
                  clickEvent={() => {
                    setUpdateFormPop(false);
                    setTripId("");
                    handleReset();
                  }}
                />
              </div>

              {/* GRID START — 1 / 2 / 3 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Client ID */}
                <div>
                  <label htmlFor="clientId" className={inputLable}>
                    Client
                  </label>
                  <select
                    id="clientId"
                    name="clientId"
                    className={formInput}
                    value={formData.clientId as string}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select client</option>
                    {clients?.map((c) => (
                      <option key={c._id as string} value={c._id as string}>
                        {c.clientName} - {c.companyName}
                      </option>
                    ))}
                  </select>
                  <p className={inputHelp}>
                    Select the client associated with this trip.
                  </p>
                </div>

                {/* Vehicle ID */}
                <div>
                  <label htmlFor="vehicleId" className={inputLable}>
                    Vehicle
                  </label>
                  <select
                    id="vehicleId"
                    name="vehicleId"
                    className={formInput}
                    value={formData.vehicleId as string}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Vehicle</option>
                    {vehicles?.map((v) => (
                      <option key={v._id as string} value={v._id as string}>
                        {v.v_number} - {v.v_brand}
                      </option>
                    ))}
                  </select>
                  <p className={inputHelp}>
                    Choose the vehicle that is used for this trip.
                  </p>
                </div>

                {/* Start Location */}
                <div>
                  <label htmlFor="startLocation" className={inputLable}>
                    Start Location
                  </label>
                  <input
                    id="startLocation"
                    name="startLocation"
                    type="text"
                    value={formData.startLocation}
                    onChange={handleChange}
                    required
                    className={formInput}
                    placeholder="Enter start location"
                  />
                </div>

                {/* End Location */}
                <div>
                  <label htmlFor="endLocation" className={inputLable}>
                    End Location
                  </label>
                  <input
                    id="endLocation"
                    name="endLocation"
                    type="text"
                    value={formData.endLocation}
                    onChange={handleChange}
                    required
                    className={formInput}
                    placeholder="Enter end location"
                  />
                </div>

                {/* Number of Days */}
                <div>
                  <label htmlFor="noOfDays" className={inputLable}>
                    Number of Days
                  </label>
                  <input
                    id="noOfDays"
                    name="noOfDays"
                    type="number"
                    value={formData.noOfDays}
                    onChange={handleChange}
                    required
                    className={formInput}
                    min="0"
                  />
                </div>

                {/* Rate Per Day */}
                <div>
                  <label htmlFor="ratePerDay" className={inputLable}>
                    Rate Per Day
                  </label>
                  <input
                    id="ratePerDay"
                    name="ratePerDay"
                    type="number"
                    value={formData.ratePerDay}
                    onChange={handleChange}
                    required
                    className={formInput}
                    min="0"
                  />
                </div>

                {/* Total Amount (Read-Only) */}
                <div>
                  <label htmlFor="totalAmount" className={inputLable}>
                    New Total Amount
                  </label>
                  <input
                    id="totalAmount"
                    name="totalAmount"
                    type="number"
                    // This calculates the NEW total as you type
                    value={currentTotalAmount}
                    readOnly
                    className={`${formInput} bg-gray-100 cursor-not-allowed`}
                  />
                  <p className={inputHelp}>Auto-calculated (Rate × Days).</p>
                </div>

                {/* Avg KM */}
                <div>
                  <label htmlFor="avgKM" className={inputLable}>
                    Average KM
                  </label>
                  <input
                    id="avgKM"
                    name="avgKM"
                    type="number"
                    value={formData.avgKM}
                    onChange={handleChange}
                    required
                    className={formInput}
                    min="0"
                  />
                </div>

                {/* Start KM */}
                <div>
                  <label htmlFor="startKM" className={inputLable}>
                    Start KM
                  </label>
                  <input
                    id="startKM"
                    name="startKM"
                    type="number"
                    value={formData.startKM}
                    onChange={handleChange}
                    required
                    className={formInput}
                    min="0"
                  />
                </div>

                {/* End KM */}
                <div>
                  <label htmlFor="endKM" className={inputLable}>
                    End KM
                  </label>
                  <input
                    id="endKM"
                    name="endKM"
                    type="number"
                    value={formData.endKM}
                    onChange={handleChange}
                    required
                    className={formInput}
                    min="0"
                  />
                </div>

                {/* Paid Amount - Note: This field will be deprecated once payment is managed by the new payments array */}
                <div>
                  <label htmlFor="paidAmount" className={inputLable}>
                    Paid Amount (Initial/Total)
                  </label>
                  <input
                    id="paidAmount"
                    name="paidAmount"
                    type="number"
                    value={formData.paidAmount}
                    onChange={handleChange}
                    className={formInput}
                    min="0"
                  />
                  <p className={inputHelp}>
                    Only change this if updating the *total* paid.
                  </p>
                </div>

                {/* Terms & Conditions */}
                <div>
                  <label htmlFor="terms" className={inputLable}>
                    Terms & Conditions
                  </label>
                  <textarea
                    id="terms"
                    name="terms"
                    rows={2}
                    value={formData.terms || ""}
                    onChange={handleChange}
                    placeholder="Write terms & conditions..."
                    className={`${formInput} w-full`}
                  ></textarea>
                </div>

                {/* --- 💎 PAYMENT SUMMARY SECTION --- */}
                <div className="md:col-span-3 p-4 bg-gray-50 rounded-md border space-y-2">
                  <h3 className="font-semibold text-gray-800">
                    Payment Summary
                  </h3>

                  {/* Display Calculation */}
                  <div className="text-sm border-b pb-2">
                    <div className="flex justify-between">
                      <span>Original Total Amount:</span>
                      <span className="font-medium text-gray-600">
                        Rs. {extraTripData.totalAmount || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>New Calculated Total:</span>
                      <span className="font-medium text-blue-600">
                        Rs. {currentTotalAmount}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Total Paid So Far (from payments):</span>
                      <span className="font-medium text-green-600">
                        Rs. {extraTripData.totalPaidAmount || 0}
                      </span>
                    </div>
                    <div className="flex justify-between mt-2 font-bold text-base">
                      <span>New Balance Due:</span>
                      <span
                        className={
                          currentBalanceDue < 0
                            ? "text-green-700"
                            : "text-red-600"
                        }
                      >
                        Rs. {currentBalanceDue.toFixed(2)}
                        {currentBalanceDue < 0 && " (Overpaid)"}
                      </span>
                    </div>
                  </div>

                  {/* Payment History */}
                  <div className="pt-2">
                    <h4 className="text-xs font-semibold text-gray-600">
                      Payment History:
                    </h4>
                    {extraTripData.payments &&
                    extraTripData.payments.length > 0 ? (
                      <ul className="list-disc list-inside text-xs text-gray-700 max-h-20 overflow-y-auto pl-4">
                        {extraTripData.payments.map(
                          (p: tripsPaymentTypes, index) => (
                            <li key={p._id || index}>
                              Rs. {p.amount} (via {p.paymentMethod}) on{" "}
                              {new Date(p.date).toLocaleDateString()}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-xs italic text-gray-500">
                        No payments recorded yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* --- END OF GRID --- */}

              {/* Buttons */}
              <div className="flex justify-between gap-4 pt-4 border-t">
                <Button
                  btnStyle="bg-primary text-white rounded-sm w-fit h-10 flex justify-center items-center px-6"
                  btnTitle="Update"
                />
                <Button
                  clickEvent={handleReset}
                  btnStyle="bg-secondary text-white rounded-sm w-fit h-10 flex justify-center items-center px-6"
                  btnTitle="Reset"
                />
              </div>
            </form>
          )}
        </div>
      )}

      {/* pay form model (Payment Modal) */}
      {payFormPop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          {isSubmitLoading ? (
            <div className="p-10 bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
              <Loader size={30} className="animate-spin" />
              <h1 className="mt-2">Fetching Trip Details...</h1>
            </div>
          ) : (
            <div className="relative w-full md:w-[90%] lg:w-[450px] p-6 rounded-lg bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
                Record Payment for Trip ID: {tripId}
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
                <p className="text-sm text-gray-700">Trip Balance Due:</p>
                <p className="text-2xl font-extrabold text-blue-700">
                  Rs. {(extraTripData.balanceDue || 0).toFixed(2)}
                </p>
              </div>

              {/* The Actual Payment Form Component */}
              <AddPaymentForm
                tripId={tripId}
                currentBalance={extraTripData.balanceDue}
                onPaymentSuccess={handlePaymentSuccess}
              />

              {/* Optional: Payment History Quick View */}
              {extraTripData.payments && extraTripData.payments.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Recent Payments
                  </h4>
                  <ul className="list-disc list-inside text-xs text-gray-600 max-h-20 overflow-y-auto pl-4">
                    {extraTripData.payments.map(
                      // Map all payments, relying on max-height/overflow for scrolling
                      (p: tripsPaymentTypes, index) => (
                        <li key={p._id || index}>
                          Rs. {p.amount} ({p.paymentMethod}) on{" "}
                          {new Date(p.date).toLocaleDateString()}
                        </li>
                      )
                    )}
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
export default TripTable;
