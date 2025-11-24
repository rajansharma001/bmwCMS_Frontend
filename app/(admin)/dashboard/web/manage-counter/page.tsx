"use client";
import Button from "@/components/Button";
import CounterInputForm from "@/components/webComponents/webDashboardComponents/counterComponents/CounterInputForm";
import CounterTable from "@/components/webComponents/webDashboardComponents/counterComponents/CounterTable";
import { useProtectedRoute } from "@/context/useProtected";
import React, { useState } from "react";

const Counter = () => {
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
          btnTitle="Add Counter"
          clickEvent={() => setFormOpen(!formOpen)}
        />
      </div>

      <div className="w-full mt-5">
        <CounterTable tableRefresh={handleRefresh} />
      </div>
      {/* form */}
      {formOpen && (
        <div className="w-full">
          <div className=" absolute top-25 w-full ">
            <div className="w-full flex items-center justify-center">
              <CounterInputForm
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

export default Counter;
