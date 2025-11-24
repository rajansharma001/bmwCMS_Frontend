"use client";
import Button from "@/components/Button";
import PackageInputForm from "@/components/webComponents/webDashboardComponents/packageComponents/PackageInputForm";
import PackageTable from "@/components/webComponents/webDashboardComponents/packageComponents/PackageTable";
import { useProtectedRoute } from "@/context/useProtected";
import React, { useState } from "react";

const ManagePackage = () => {
  useProtectedRoute();
  const [pageRefresh, setPageRefresh] = useState(false);
  const handleRefresh = () => setPageRefresh((prev) => !prev);
  const [formOpen, setFormOpen] = useState(false);
  return (
    <div className="w-full  px-10 p-10 relative overflow-scroll h-full">
      <div className="w-full flex justify-end items-center">
        <Button
          btnStyle={`${
            formOpen ? "bg-black" : "bg-gray-300"
          } text-white rounded-sm`}
          btnTitle="Add Package"
          clickEvent={() => setFormOpen(!formOpen)}
        />
      </div>

      <div className="w-full mt-5">
        <PackageTable tableRefresh={pageRefresh} />
      </div>
      {/* form */}
      {formOpen && (
        <div className="w-full">
          <div className=" absolute top-25 w-full ">
            <div className="w-full flex items-center justify-center ">
              <PackageInputForm
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

export default ManagePackage;
