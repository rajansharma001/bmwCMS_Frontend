"use client";
import { TicketBookingFundsTypes } from "@/types/ticketBookingFundsTypes";
import { Loader } from "lucide-react";
import React, { FormEvent, useState } from "react";
import { toast } from "sonner";
import Button from "../Button";
import { formInput, inputHelp, inputLable } from "@/styles/styles";

const defaultFormData: TicketBookingFundsTypes = {
  fundsFor: "",
  newFund: 0,
};
const FundsInputForm = ({ formClose, onSubmitSuccess }) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [formData, setFormData] =
    useState<TicketBookingFundsTypes>(defaultFormData);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "newFund" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/funds/new-fund`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(formData),
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

        toast.success("Fund added successfully.");
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
    <div className="w-[35%] flex justify-center items-center">
      {isSubmitLoading ? (
        <div className="p-10 bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
          <Loader size={30} className="animate-spin" />
          <h1 className="mt-2">Submitting fund...</h1>
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

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            {/* Funds For */}
            <div>
              <label htmlFor="fundsFor" className={inputLable}>
                Funds For
              </label>
              <select
                name="fundsFor"
                id="fundsFor"
                onChange={handleChange}
                value={formData.fundsFor}
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

            {/* New Fund Amount */}
            <div>
              <label htmlFor="newFund" className={inputLable}>
                Fund Amount (Rs)
              </label>
              <input
                id="newFund"
                name="newFund"
                type="number"
                value={formData.newFund}
                onChange={handleChange}
                required
                className={formInput}
              />
              <p className={inputHelp}>Enter the amount you want to add.</p>
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

export default FundsInputForm;
