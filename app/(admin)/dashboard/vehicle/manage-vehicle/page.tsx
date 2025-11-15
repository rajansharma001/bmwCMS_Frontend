"use client";

import Button from "@/components/Button";
import VehicleFetch from "@/components/vehileComponents/VehicleFetch";
import VehicleInputForm from "@/components/vehileComponents/VehicleInputForm";
import { useState } from "react";

const NewVehicle = () => {
  const [pageRefresh, setPageRefresh] = useState(false);
  const handleRefresh = () => setPageRefresh((prev) => !prev);
  const [formOpen, setFormOpen] = useState(false);
  return (
    <div className="w-full  px-10 p-10 relative">
      <div className="w-full flex justify-end items-center">
        <Button
          btnStyle={`${
            formOpen ? "bg-black" : "bg-gray-300"
          } text-white rounded-sm`}
          btnTitle="Add vehicle"
          clickEvent={() => setFormOpen(!formOpen)}
        />
      </div>

      <div className="w-full">
        <VehicleFetch refreshTable={pageRefresh} />
      </div>
      {/* Form Popup */}
      {formOpen && (
        <div className=" absolute top-10 w-full ">
          <div className="w-full flex items-center justify-center">
            <VehicleInputForm
              onSubmitSuccess={handleRefresh}
              formClose={() => {
                setFormOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NewVehicle;
