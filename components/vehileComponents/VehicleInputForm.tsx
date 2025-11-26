"use client";
import { formInput, inputHelp, inputLable } from "@/styles/styles";
import Button from "../Button";
import { FormEvent, useState } from "react";
import { VehicleType } from "@/types/vehicleTypes";
import { Loader } from "lucide-react";
import { toast } from "sonner";

const VehicleInputForm = ({ formClose, onSubmitSuccess }) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [formData, setFormData] = useState<VehicleType>({
    v_model: "",
    v_type: "",
    v_brand: "",
    v_number: "",
    last_service_date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle/new-vehicle`,
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
      if (!res.ok) {
        setIsSubmitLoading(false);

        toast.error(result.error);
      } else {
        setIsSubmitLoading(false);
        onSubmitSuccess();
        setFormData({
          v_model: "",
          v_type: "",
          v_brand: "",
          v_number: "",
          last_service_date: "",
        });

        toast.success("Vehicle added successfully.");
        formClose();
      }
    } catch (error) {
      setIsSubmitLoading(false);
      toast.error(`API ERROR. : ${error}`);
    }
  };

  const handleReset = () => {
    setFormData({
      v_model: "",
      v_type: "",
      v_brand: "",
      v_number: "",
      last_service_date: "",
    });
  };

  return (
    <div className="w-full flex justify-center items-center">
      {isSubmitLoading ? (
        <div className="p-10 bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
          <Loader size={30} className="animate-spin" />
          <h1 className="mt-2">Submitting Vehicle...</h1>
        </div>
      ) : (
        <form
          className="relative space-y-6 w-[70%]  p-15 rounded-sm bg-white"
          onSubmit={handleSubmit}
          method="POST"
        >
          <div className="absolute top-2 right-2 ">
            <Button btnStyle="" btnTitle="Close" clickEvent={formClose} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 backdrop-blur-2xl">
            <div>
              <label htmlFor="v_model" className={`${inputLable}`}>
                Vehicle Model
              </label>
              <input
                id="v_model"
                name="v_model"
                type="text"
                value={formData.v_model}
                onChange={handleChange}
                required
                className={`${formInput}`}
                placeholder="e.g. Civic, Corolla"
                aria-describedby="v_model_help"
              />
              <p id="v_model_help" className={`${inputHelp}`}>
                Model name or number of the vehicle.
              </p>
            </div>

            <div>
              <label htmlFor="v_brand" className={`${inputLable}`}>
                Brand
              </label>
              <input
                id="v_brand"
                name="v_brand"
                type="text"
                value={formData.v_brand}
                onChange={handleChange}
                required
                className={`${formInput}`}
                placeholder="e.g. Honda, Toyota"
              />
              <p id="v_type_help" className={`${inputHelp}`}>
                Select vehicle brand.
              </p>
            </div>

            <div>
              <label htmlFor="v_type" className={`${inputLable}`}>
                Type
              </label>
              <select
                id="v_type"
                name="v_type"
                required
                className={`${formInput}`}
                value={formData.v_type}
                onChange={handleChange}
              >
                <option value="">Select type</option>
                <option>Car</option>
                <option>SUV</option>
                <option>Truck</option>
                <option>Motorcycle</option>
                <option>Van</option>
                <option>Other</option>
              </select>
              <p id="v_type_help" className={`${inputHelp}`}>
                Select vehicle type.
              </p>
            </div>

            <div>
              <label htmlFor="v_number" className={`${inputLable}`}>
                Vehicle Number
              </label>
              <input
                id="v_number"
                name="v_number"
                type="text"
                value={formData.v_number}
                onChange={handleChange}
                required
                className={`${formInput}`}
                placeholder="e.g. KA01AB1234"
                aria-describedby="v_number_help"
              />
              <p id="v_number_help" className={`${inputHelp}`}>
                Enter registration or chassis number.
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="w-[49%]">
              <label htmlFor="last_service_date" className={`${inputLable}`}>
                Last Service Date
              </label>
              <input
                id="last_service_date"
                name="last_service_date"
                type="date"
                value={formData.last_service_date}
                onChange={handleChange}
                required
                className={`${formInput}`}
              />
              <p className={`${inputHelp}`}>
                Pick the date of the vehicle most recent service.
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

export default VehicleInputForm;
