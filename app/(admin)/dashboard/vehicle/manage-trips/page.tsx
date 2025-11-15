"use client";
import Button from "@/components/Button";
import TripInputForm from "@/components/tripsComponents/TripInputForm";
import TripTable from "@/components/tripsComponents/TripTable";
import React, { useState } from "react";

const ManageTrips = () => {
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
          btnTitle="Add Trip"
          clickEvent={() => setFormOpen(!formOpen)}
        />
      </div>

      <div className="w-full">
        <TripTable refreshTable={pageRefresh} />
      </div>
      {/* maintnance form */}

      {formOpen && (
        <div className="w-full">
          <div className=" absolute top-25 w-full ">
            <div className="w-full flex items-center justify-center">
              <TripInputForm
                formClose={() => {
                  setFormOpen(false);
                }}
                onSubmitSuccess={handleRefresh}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTrips;
