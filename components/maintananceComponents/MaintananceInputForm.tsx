"use client";
import { MaintanaceTypes } from "@/types/MaintananceTypes";
import { Loader } from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";
import Button from "../Button";
import { formInput, inputHelp, inputLable } from "@/styles/styles";
import { VehicleType } from "@/types/vehicleTypes";

interface Props {
  formClose: () => void;
  onSubmitSuccess: () => void;
}
const MaintananceInputForm = ({ formClose, onSubmitSuccess }: Props) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [vehicleData, setVehicleData] = useState<VehicleType[] | null>([]);

  const [formData, setFormData] = useState<MaintanaceTypes>({
    vehicleId: "",
    cost: "",
    date: "",
    description: "",
    receipt: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      if (
        type === "file" &&
        e.target instanceof HTMLInputElement &&
        e.target.files
      ) {
        return {
          ...prev,
          [name]: e.target.files[0],
        };
      } else {
        return {
          ...prev,
          [name]: value,
        };
      }
    });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchVehicle = async () => {
      setIsSubmitLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle/get-vehicles`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result = await res.json();
        setIsSubmitLoading(false);
        if (!res.ok) {
          if (isMounted) {
            setSuccess(false);
            setMessage(result.error);
          }
        } else {
          if (isMounted) {
            setVehicleData(result.getVehicle);
          }
        }
      } catch (error) {
        if (isMounted) {
          setSuccess(false);
          setMessage(`API ERROR. : ${error}`);
        }
      }
    };

    fetchVehicle();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    form.append("vehicleId", formData.vehicleId);
    form.append("cost", formData.cost);
    form.append("date", formData.date);
    form.append("description", formData.description);
    form.append("receipt", formData.receipt);
    setIsSubmitLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle-maintanance/new-maintanance`,
        {
          method: "POST",
          credentials: "include",
          body: form,
        }
      );

      const result = await res.json();
      setIsSubmitLoading(false);
      if (!res.ok) {
        setSuccess(false);
        setMessage(result.error);
      } else {
        setFormData({
          vehicleId: "",
          cost: "",
          date: "",
          description: "",
          receipt: "",
        });
        setSuccess(true);
        setMessage("Vehicle maintanance added successfully.");
        onSubmitSuccess();
      }
    } catch (error) {
      setSuccess(false);
      setMessage(`API ERROR. : ${error}`);
    }
  };
  const handleReset = () => {
    setFormData({
      vehicleId: "",
      cost: "",
      date: "",
      description: "",
      receipt: "",
    });
  };

  useEffect(() => {
    if (message !== "") {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  return (
    <div className=" flex flex-col justify-center w-[70%]  p-10 rounded-sm bg-white items-center">
      <div className="w-full flex justify-end ">
        <Button btnStyle="" btnTitle="Close" clickEvent={formClose} />
      </div>
      {isSubmitLoading ? (
        <div className="w-full flex flex-col items-center justify-center">
          <Loader size={30} className="animate-spin" />
          <h1>Loading</h1>
        </div>
      ) : (
        <form
          className="relative space-y-6 w-full"
          onSubmit={handleSubmit}
          method="POST"
          encType="multipart/form-data"
        >
          {/* notification alert */}
          {message !== "" && (
            <div
              className={` w-full p-5 rounded-md mt-5 ${
                success ? "bg-green-200 text-white" : "bg-red-200 text-white"
              }`}
            >
              <h1
                className={`${success ? "text-green-700 " : "text-red-700 "}`}
              >
                {message}
              </h1>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 backdrop-blur-2xl">
            <div>
              <label htmlFor="vehicleId" className={`${inputLable}`}>
                Vehicle Model
              </label>

              <select
                name="vehicleId"
                id="vehicleId"
                onChange={handleChange}
                value={formData.vehicleId}
                className={`${formInput}`}
                aria-describedby="vehicleId_help"
              >
                {vehicleData &&
                  vehicleData.map((data) => (
                    <option value={data._id} key={data._id}>
                      {data.v_number}
                    </option>
                  ))}
              </select>
              <p id="vehicle_help" className={`${inputHelp}`}>
                Select a vehicle.
              </p>
            </div>

            <div>
              <label htmlFor="cost" className={`${inputLable}`}>
                Maintanance Cost
              </label>
              <input
                id="cost"
                name="cost"
                type="number"
                value={formData.cost}
                onChange={handleChange}
                required
                className={`${formInput}`}
                placeholder="00.00"
              />
              <p id="cost_help" className={`${inputHelp}`}>
                Enter maintanace cost.
              </p>
            </div>

            <div>
              <label htmlFor="date" className={`${inputLable}`}>
                Maintanance Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                className={`${formInput}`}
                aria-describedby="date_help"
              />
              <p id="date_help" className={`${inputHelp}`}>
                Enter maintanance date.
              </p>
            </div>
            <div>
              <label htmlFor="receipt" className={`${inputLable}`}>
                Maintanance Receipt
              </label>
              <input
                id="receipt"
                name="receipt"
                type="file"
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                onChange={handleChange}
                required
                className={`${formInput}`}
                aria-describedby="receipt_help"
              />
              <p id="receipt_help" className={`${inputHelp}`}>
                Upload maintnance receipt.
              </p>
            </div>
          </div>

          <div className="w-full flex justify-between gap-3">
            <div className="w-[50%] flex flex-col   gap-3">
              <label htmlFor="description" className={`${inputLable}`}>
                Maintanance description
              </label>

              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="eg. light, seat, engine"
                className={`${formInput}`}
                aria-describedby="description_help"
              ></textarea>
              <p id="receipt_help" className={`${inputHelp}`}>
                Add Maintanance description.
              </p>
            </div>
            <div className="w-[50%] flex items-center justify-around gap-3">
              <Button
                btnStyle="text-white rounded-sm w-full h-10 flex justify-center items-center"
                btnTitle="Save"
              />

              <Button
                clickEvent={handleReset}
                btnStyle="bg-secondary text-white rounded-sm w-full h-10 flex justify-center items-center"
                btnTitle="Reset"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default MaintananceInputForm;
