"use client";
import React, { FormEvent, useEffect, useState } from "react";
import Button from "../Button";
import { formInput, inputHelp, inputLable } from "@/styles/styles";
import { Loader } from "lucide-react";
import { clientType } from "@/types/clientTypes";
import { VehicleType } from "@/types/vehicleTypes";
import { toast } from "sonner";
import { tripTypes } from "@/types/tripTypes";

// Use the new type for the state
const defaultFormData: tripTypes = {
  clientId: "",
  vehicleId: "",
  startLocation: "",
  endLocation: "",
  noOfDays: 0,
  ratePerDay: 0,
  paidAmount: 0,
  avgKM: 0,
  startKM: 0,
  endKM: 0,
  terms: "",
  paymentMethod: "none", // Default to 'none' for select
};

const TripInputForm = ({ formClose, onSubmitSuccess }) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [clients, setClients] = useState<clientType[] | null>([]);
  const [vehicles, setVehicles] = useState<VehicleType[] | null>([]);
  const [formData, setFormData] = useState<tripTypes>(defaultFormData);

  // --- Client and Vehicle fetching useEffects remain unchanged ---
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
    let isMounted = true;
    const getVehicle = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle/get-vehicles`,
          { method: "GET", credentials: "include" }
        );
        const result = await res.json();
        if (isMounted) {
          setVehicles(result.getVehicle);
        } else {
          console.log("Something went wrong.");
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
  // --- END useEffects ---

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      // Convert number-related fields to Number type for internal state accuracy
      [name]:
        name === "noOfDays" ||
        name === "ratePerDay" ||
        name === "paidAmount" ||
        name === "avgKM" ||
        name === "startKM" ||
        name === "endKM"
          ? Number(value)
          : value,
    }));
  };

  // Calculate total amount based on current input values
  const totalAmount = formData.ratePerDay * formData.noOfDays;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    // Final validation based on logic from the server
    if (formData.paidAmount > totalAmount) {
      setIsSubmitLoading(false);
      return toast.error(
        "Paying amount cannot be greater than the total trip amount."
      );
    }
    if (formData.paidAmount > 0 && formData.paymentMethod === "none") {
      setIsSubmitLoading(false);
      return toast.error(
        "Payment method is required if an initial payment is made."
      );
    }

    const numericFormData = {
      ...formData,
      noOfDays: Number(formData.noOfDays),
      ratePerDay: Number(formData.ratePerDay),
      avgKM: Number(formData.avgKM),
      startKM: Number(formData.startKM),
      endKM: Number(formData.endKM),
      paidAmount: Number(formData.paidAmount),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trips/new-trip`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ formData: numericFormData }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await res.json();
      setIsSubmitLoading(false);
      if (!res.ok) {
        toast.error(result.error);
      } else {
        onSubmitSuccess();
        setFormData(defaultFormData);

        toast.success("Trip added successfully.");
        formClose();
      }
    } catch (error) {
      toast.error(`API ERROR. : ${error}`);
    }
  };

  const handleReset = () => {
    setFormData(defaultFormData);
  };

  return (
    <div className="w-full flex justify-center items-center">
      {isSubmitLoading ? (
        <div className="w-full flex flex-col items-center justify-center">
          <Loader size={30} className="animate-spin" />
          <h1>Loading</h1>
        </div>
      ) : (
        <form
          className="relative space-y-6 w-full md:w-[85%] p-10 rounded-sm bg-white"
          onSubmit={handleSubmit}
          method="POST"
        >
          <div className="absolute top-2 right-2">
            <Button btnStyle="" btnTitle="Close" clickEvent={formClose} />
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
                value={formData.clientId}
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
                value={formData.vehicleId}
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
              <p className={inputHelp}>
                Enter the starting point of the journey.
              </p>
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
              <p className={inputHelp}>
                Enter the final destination of the trip.
              </p>
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
              />
              <p className={inputHelp}>
                Total number of days the vehicle will be used.
              </p>
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
              />
              <p className={inputHelp}>Enter the daily rental rate.</p>
            </div>

            {/* Total Amount (Read-Only/Display) */}
            <div>
              <label htmlFor="totalAmount" className={inputLable}>
                Total Amount
              </label>
              <input
                id="totalAmount"
                name="totalAmount"
                type="number"
                value={totalAmount} // Display the calculated total
                readOnly // 👈 Make it read-only, as the server calculates it
                className={`${formInput} bg-gray-100 cursor-not-allowed`}
              />
              <p className={inputHelp}>
                Automatically calculated (Rate × Days).
              </p>
            </div>

            {/* paid Amount */}
            <div>
              <label htmlFor="paidAmount" className={inputLable}>
                Initial Paying Amount
              </label>
              <input
                id="paidAmount"
                name="paidAmount"
                type="number"
                value={formData.paidAmount}
                onChange={handleChange}
                required
                className={formInput}
              />
              <p className={inputHelp}>Client initial payment amount.</p>
              {formData.paidAmount > totalAmount && totalAmount > 0 && (
                <p className={`${inputHelp} text-red-600 font-medium`}>
                  Payment shouldn`t be greater than the total trip amount (Rs.{" "}
                  {totalAmount}).
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label htmlFor="paymentMethod" className={inputLable}>
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                className={formInput}
                value={formData.paymentMethod}
                onChange={handleChange}
                required={formData.paidAmount > 0} // Make required only if payment is made
              >
                <option value="none">Select Payment Method (If Paying)</option>
                <option value="cash">Cash</option>
                <option value="bank">Bank</option>
                <option value="esewa">E-Sewa</option>
              </select>
              {formData.paidAmount > 0 && formData.paymentMethod === "none" && (
                <p className={`${inputHelp} text-red-600 font-medium`}>
                  Required if initial payment is greater than 0.
                </p>
              )}
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
              />
              <p className={inputHelp}>Average kilometers per day.</p>
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
              />
              <p className={inputHelp}>Odometer before the trip.</p>
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
              />
              <p className={inputHelp}>Odometer after completing the trip.</p>
            </div>

            {/* Terms & Conditions (Full Width) */}
            <div className="md:col-span-3">
              <label htmlFor="terms" className={inputLable}>
                Terms & Conditions
              </label>
              <textarea
                id="terms"
                name="terms"
                rows={2}
                value={formData.terms || ""}
                onChange={handleChange}
                placeholder="Write terms & conditions for this trip…"
                className={`${formInput} w-full`}
                required
              ></textarea>
              <p className={inputHelp}>
                Add any special agreements or conditions.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-4 mt-5">
            <Button
              btnStyle="text-white rounded-sm w-fit h-10 flex justify-center items-center"
              btnTitle="Save"
            />
            <Button
              clickEvent={handleReset}
              btnStyle="bg-secondary text-white rounded-sm w-fit h-10 flex justify-center items-center"
              btnTitle="Reset"
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default TripInputForm;
