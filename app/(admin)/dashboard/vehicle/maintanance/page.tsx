"use client";

import Button from "@/components/Button";
import MaintananceFetch from "@/components/maintananceComponents/MaintananceFetch";
import MaintananceInputForm from "@/components/maintananceComponents/MaintananceInputForm";
import { useState } from "react";

const VehicleMaintanace = ({}) => {
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
          btnTitle="Add Maintanance"
          clickEvent={() => setFormOpen(!formOpen)}
        />
      </div>

      <div className="w-full">
        <MaintananceFetch refreshTable={pageRefresh} />
      </div>
      {/* maintnance form */}

      {formOpen && (
        <div className=" absolute top-25 w-full ">
          <div className="w-full flex items-center justify-center">
            <MaintananceInputForm
              formClose={() => {
                setFormOpen(false);
              }}
              onSubmitSuccess={handleRefresh}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleMaintanace;
