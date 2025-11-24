"use client";
import Button from "@/components/Button";
import AboutInputForm from "@/components/webComponents/webDashboardComponents/aboutComponents/AboutInputForm";
import AboutTable from "@/components/webComponents/webDashboardComponents/aboutComponents/AboutTable";
import { useProtectedRoute } from "@/context/useProtected";
import React, { useState } from "react";

const ManageAbout = () => {
  useProtectedRoute();
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
          btnTitle="Add About"
          clickEvent={() => setFormOpen(!formOpen)}
        />
      </div>

      <div className="w-full mt-5">
        <AboutTable tableRefresh={pageRefresh} />
      </div>
      {/* form */}
      {formOpen && (
        <div className="w-full">
          <div className=" absolute top-25 w-full ">
            <div className="w-full flex items-center justify-center">
              <AboutInputForm
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

export default ManageAbout;
