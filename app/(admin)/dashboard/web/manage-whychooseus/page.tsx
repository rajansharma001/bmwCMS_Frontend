"use client";
import Button from "@/components/Button";
import WhyChooseUsInputForm from "@/components/webComponents/webDashboardComponents/whyChooseUsComponents/WhyChooseUsInputForm";
import WhyChooseUsTable from "@/components/webComponents/webDashboardComponents/whyChooseUsComponents/WhyChooseUsTable";
import { useProtectedRoute } from "@/context/useProtected";

import React, { useState } from "react";

const ManageWhyChooseUs = () => {
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
          btnTitle="Add WhyChooseUs"
          clickEvent={() => setFormOpen(!formOpen)}
        />
      </div>

      <div className="w-full mt-5">
        <WhyChooseUsTable tableRefresh={pageRefresh} />
      </div>
      {/* form */}
      {formOpen && (
        <div className="w-full">
          <div className=" absolute w-full -mt-40">
            <div className="w-full flex items-center justify-center">
              <WhyChooseUsInputForm
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

export default ManageWhyChooseUs;
