"use client";

import { formInput, inputHelp, inputLable } from "@/styles/styles";
import Button from "../Button";
import { FormEvent, useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { vehicleQuotationTableType } from "@/types/vehicleQuotationTableTypes";
import { VehicleType } from "@/types/vehicleTypes";
import { clientType } from "@/types/clientTypes";

interface QuotationInputFormProps {
  formClose: () => void;
  onSubmitSuccess: () => void;
}

const QuotationInputForm = ({
  formClose,
  onSubmitSuccess,
}: QuotationInputFormProps) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [clients, setClients] = useState<clientType[] | null>([]);
  const [vehicles, setVehicles] = useState<VehicleType[] | null>([]);
  const [quotationData, setQuotationData] = useState({
    clientId: "",
    date: "",
    totalAmount: "",
    status: "draft",
    termsAndConditions: "",
  });
  const [tableRows, setTableRows] = useState<vehicleQuotationTableType[]>([
    {
      vehicleId: "",
      noOfDays: 0,
      ratePerDay: 0,
      total: 0,
    },
  ]);

  const handleQuotationChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setQuotationData((prev) => ({ ...prev, [name]: value }));
  };
  const handleTableChange = (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const updatedRows = [...tableRows];
    updatedRows[index] = {
      ...updatedRows[index],
      [name]:
        name === "noOfDays" || name === "ratePerDay" || name === "total"
          ? Number(value)
          : value,
    };
    setTableRows(updatedRows);
  };
  const addTableRow = () =>
    setTableRows([
      ...tableRows,
      {
        vehicleId: "",
        noOfDays: 0,
        ratePerDay: 0,
        total: 0,
      },
    ]);

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
        if (isMounted) setMessage(`API ERROR: ${error}`);
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
        if (isMounted) setMessage(`API ERROR: ${error}`);
      }
    };
    getVehicle();
    return () => {
      isMounted = false;
    };
  }, []);

  console.log(vehicles);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quotations/new-quotation`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...quotationData, tableRows }),
        }
      );
      const result = await res.json();
      setIsSubmitLoading(false);
      if (!res.ok) {
        setSuccess(false);
        setMessage(result.message || "Something went wrong");
      } else {
        onSubmitSuccess();
        setQuotationData({
          clientId: "",
          date: "",
          totalAmount: "",
          status: "draft",
          termsAndConditions: "",
        });
        setTableRows([
          {
            vehicleId: "",
            noOfDays: 0,
            ratePerDay: 0,
            total: 0,
          },
        ]);
        setSuccess(true);
        setMessage("Quotation created successfully.");
      }
    } catch (error) {
      setIsSubmitLoading(false);
      setSuccess(false);
      setMessage(`API ERROR. : ${error}`);
    }
  };

  const handleReset = () => {
    setQuotationData({
      clientId: "",
      date: "",
      totalAmount: "",
      status: "draft",
      termsAndConditions: "",
    });
    setTableRows([
      {
        vehicleId: "",
        noOfDays: 0,
        ratePerDay: 0,
        total: 0,
      },
    ]);
  };

  useEffect(() => {
    if (message !== "") {
      const timer = setTimeout(() => {
        setMessage("");
        formClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, formClose]);

  return (
    <div className="w-full flex justify-center items-center p-2">
      {isSubmitLoading ? (
        <div className="w-full flex flex-col items-center justify-center">
          <Loader size={30} className="animate-spin" />
          <h1>Loading</h1>
        </div>
      ) : (
        <form
          className="relative w-full max-w-4xl space-y-6 p-4 md:p-8 rounded-sm bg-white shadow-md"
          onSubmit={handleSubmit}
        >
          {/* Notification */}
          {message && (
            <div
              className={`w-full p-3 rounded-md ${
                success
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          {/* Close Button */}
          <div className="absolute top-2 right-2">
            <Button btnStyle="" btnTitle="Close" clickEvent={formClose} />
          </div>

          {/* Quotation Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Client */}
            <div>
              <label htmlFor="clientId" className={inputLable}>
                Select Client
              </label>
              <select
                id="clientId"
                name="clientId"
                className={formInput}
                value={quotationData.clientId}
                onChange={handleQuotationChange}
                required
              >
                <option value="">Select client</option>
                {clients?.map((c) => (
                  <option key={c._id as string} value={c._id as string}>
                    {c.clientName} - {c.companyName}
                  </option>
                ))}
              </select>
              <p className={inputHelp}>Select a client for this quotation.</p>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className={inputLable}>
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                className={formInput}
                value={quotationData.date}
                onChange={handleQuotationChange}
                required
              />
            </div>

            {/* Total Amount */}
            <div>
              <label htmlFor="totalAmount" className={inputLable}>
                Total Amount
              </label>
              <input
                id="totalAmount"
                name="totalAmount"
                type="number"
                className={formInput}
                value={quotationData.totalAmount}
                onChange={handleQuotationChange}
                required
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className={inputLable}>
                Status
              </label>
              <select
                id="status"
                name="status"
                className={formInput}
                value={quotationData.status}
                onChange={handleQuotationChange}
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Terms & Conditions */}
            <div className="md:col-span-2">
              <label htmlFor="termsAndConditions" className={inputLable}>
                Terms & Conditions
              </label>
              <textarea
                id="termsAndConditions"
                name="termsAndConditions"
                className={formInput}
                value={quotationData.termsAndConditions}
                onChange={handleQuotationChange}
              />
            </div>
          </div>

          {/* Quotation Table */}
          <div className="max-h-[350px] overflow-y-auto border rounded p-2">
            {tableRows.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-b pb-4 mb-4 last:border-b-0 last:mb-0"
              >
                {/* Vehicle */}
                <div>
                  <label htmlFor={`vehicleId-${index}`} className={inputLable}>
                    Select Vehicle
                  </label>
                  <select
                    id={`vehicleId-${index}`}
                    name="vehicleId"
                    className={formInput}
                    value={row.vehicleId}
                    onChange={(e) => handleTableChange(index, e)}
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
                    Select a vehicle for this quotation.
                  </p>
                </div>

                {/* No. of Days */}
                <div>
                  <label htmlFor={`noOfDays-${index}`} className={inputLable}>
                    No. of Days
                  </label>
                  <input
                    id={`noOfDays-${index}`}
                    name="noOfDays"
                    type="number"
                    className={formInput}
                    value={row.noOfDays}
                    onChange={(e) => handleTableChange(index, e)}
                    required
                  />
                </div>

                {/* Rate per Day */}
                <div>
                  <label htmlFor={`ratePerDay-${index}`} className={inputLable}>
                    Rate per Day
                  </label>
                  <input
                    id={`ratePerDay-${index}`}
                    name="ratePerDay"
                    type="number"
                    className={formInput}
                    value={row.ratePerDay}
                    onChange={(e) => handleTableChange(index, e)}
                    required
                  />
                </div>

                {/* Total */}
                <div>
                  <label htmlFor={`total-${index}`} className={inputLable}>
                    Total
                  </label>
                  <input
                    id={`total-${index}`}
                    name="total"
                    type="number"
                    className={formInput}
                    value={row.noOfDays * row.ratePerDay}
                    onChange={(e) => handleTableChange(index, e)}
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add Vehicle Row Button */}
          <div className="flex justify-end">
            <Button
              btnStyle="bg-primary text-white px-3 py-1"
              btnTitle="+ Add Vehicle"
              clickEvent={addTableRow}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <Button
              btnStyle="text-white rounded-sm w-full sm:w-auto h-10 flex justify-center items-center"
              btnTitle="Save"
            />
            <Button
              clickEvent={handleReset}
              btnStyle="bg-secondary text-white rounded-sm w-full sm:w-auto h-10 flex justify-center items-center"
              btnTitle="Reset"
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default QuotationInputForm;
