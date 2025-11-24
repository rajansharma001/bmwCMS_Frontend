"use client";
import Button from "@/components/Button";
import { formInput, inputLable } from "@/styles/styles";
import { Loader } from "lucide-react";
import React, { FormEvent, useState } from "react";
import { toast } from "sonner";
const defaultFormData = {
  countNumber: "",
  title: "",
};
const CounterInputForm = ({ formClose, onSubmitSuccess }) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [formData, setFormData] = useState(defaultFormData);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/counters/new-counter`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await res.json();
      setIsSubmitLoading(false);

      if (!res.ok) {
        toast.error(result.error);
      } else {
        formClose();
        onSubmitSuccess();
        toast.success("Counter added successfullyl.");
      }
    } catch (error) {
      setIsSubmitLoading(false);
      toast.error("API Error!", error);
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
          <h1 className="mt-2">Submitting Coutner...</h1>
        </div>
      ) : (
        <form
          className="relative space-y-6 w-full max-w-4xl p-8 -mt-20 rounded-xl shadow-sm bg-white border border-gray-200 "
          onSubmit={handleSubmit}
          method="POST"
        >
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">New Brand</h2>
            <Button
              btnStyle="bg-red-500 hover:bg-red-600 text-white rounded-md"
              btnTitle="Close"
              clickEvent={formClose}
            />
          </div>
          {/* GRID START — 4 columns for dense input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* couner number */}
            <div className="lg:col-span-2">
              <label htmlFor="subTitle" className={inputLable}>
                Counter Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="countNumber"
                  name="countNumber"
                  type="number"
                  value={formData.countNumber}
                  onChange={handleChange}
                  placeholder="Counter Number"
                  required
                  className={formInput}
                />
              </div>
            </div>
            {/* Title */}
            <div className="lg:col-span-2">
              <label htmlFor="title" className={inputLable}>
                Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Counter Title"
                  required
                  className={formInput}
                />
              </div>
            </div>
          </div>
          {/* Buttons */}
          <div className="w-full  flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <Button btnStyle="" btnTitle="Save" />
            <Button
              clickEvent={handleReset}
              btnStyle="bg-red-500 hover:bg-gray-400 text-gray-800 rounded-md h-10"
              btnTitle="Reset"
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default CounterInputForm;
