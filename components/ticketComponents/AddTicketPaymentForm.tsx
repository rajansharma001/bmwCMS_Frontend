"use client";
import React, { FormEvent, useState } from "react";
import { toast } from "sonner";
import Button from "../Button";
import { formInput, inputHelp, inputLable } from "@/styles/styles";

// Define the expected props for the component
interface AddPaymentFormProps {
  ticketId: string;
  currentBalance: number | undefined; // The balance due on the ticket
  onPaymentSuccess: () => void; // Function to call when payment is successful
}

// Initial state for the payment form data
const initialPaymentState = {
  amount: 0,
  paymentMethod: "",
  date: new Date().toISOString().split("T")[0],
  description: "",
};

const AddTicketPaymentForm = ({
  ticketId,
  currentBalance,
  onPaymentSuccess,
}: AddPaymentFormProps) => {
  const [formData, setFormData] = useState(initialPaymentState);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Convert 'amount' to a number type
    const newValue = name === "amount" ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handlePaymentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    // 1. Basic Validation
    if (formData.amount <= 0) {
      toast.error("Payment amount must be greater than zero.");
      setIsSubmitLoading(false);
      return;
    }

    if (!formData.paymentMethod) {
      toast.error("Please select a payment method.");
      setIsSubmitLoading(false);
      return;
    }

    // Optional: Warn if payment exceeds balance (but still allow submission)
    const balance = currentBalance || 0;
    if (formData.amount > balance && balance > 0) {
      // Warning, but proceed with submission
      toast.warning(
        `The amount Rs. ${formData.amount} exceeds the balance due of Rs. ${balance}.`
      );
    }

    // Check for negative balance (Ticket is already overpaid or fully paid)
    if (balance <= 0 && formData.amount > 0) {
      toast.warning(
        `This Ticket is already fully paid or overpaid (Balance: Rs. ${balance.toFixed(
          2
        )}). Recording this payment will increase the overpaid amount.`
      );
    }

    // Construct the payload
    const paymentPayload = {
      ...formData,
      ticketId,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/add-payment/${ticketId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentPayload),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        // Check if the error is from insufficient balance logic (if implemented backend-side)
        if (result.error.includes("exceeds the remaining balance")) {
          toast.error(`Error: ${result.error}`);
        } else {
          toast.error(result.error || "Failed to add payment.");
        }
      } else {
        // Success handler (from parent component)
        onPaymentSuccess();
        setFormData(initialPaymentState); // Reset form
      }
    } catch (error) {
      toast.error(`API ERROR: Failed to submit payment. ${error}`);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialPaymentState);
  };

  return (
    <form className="space-y-4" onSubmit={handlePaymentSubmit} method="POST">
      {/* 1. Payment Amount */}
      <div>
        <label htmlFor="amount" className={inputLable}>
          Payment Amount (Rs.)
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          required
          className={formInput}
          placeholder="e.g., 5000"
          min="0.01"
          step="any"
        />
        <p className={inputHelp}>Enter the exact amount paid by the client.</p>
      </div>

      {/* 2. Payment Method */}
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
          required
        >
          <option value="">Select Method</option>
          <option value="cash">Cash</option>
          <option value="bank">Bank Transfer</option>
          <option value="esewa">E-Sewa</option>
        </select>
        <p className={inputHelp}>How the payment was made.</p>
      </div>

      {/* 3. Payment Date */}
      <div>
        <label htmlFor="date" className={inputLable}>
          Payment Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
          className={formInput}
          // Set max date to today
          max={new Date().toISOString().split("T")[0]}
        />
        <p className={inputHelp}>The date the payment was received.</p>
      </div>

      {/* 4. Description / Reference */}
      <div>
        <label htmlFor="description" className={inputLable}>
          Description / Reference (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g., Transaction ID, Cheque No."
          className={`${formInput} w-full`}
        ></textarea>
        <p className={inputHelp}>
          Use this for any reference number or specific note.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-4 pt-4 border-t">
        <Button
          btnStyle="bg-green-600 hover:bg-green-700 text-white rounded-sm w-fit h-10 flex justify-center items-center px-6"
          btnTitle="Save"
        />
        <Button
          clickEvent={handleReset}
          btnStyle="bg-secondary text-white rounded-sm w-fit h-10 flex justify-center items-center px-6"
          btnTitle="Reset"
        />
      </div>
    </form>
  );
};

export default AddTicketPaymentForm;
