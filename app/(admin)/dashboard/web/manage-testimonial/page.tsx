"use client";
import Button from "@/components/Button";
import TestimonialInputForm from "@/components/webComponents/webDashboardComponents/testimonialsComponents/TestimonialInputForm";
import TestimonialTable from "@/components/webComponents/webDashboardComponents/testimonialsComponents/TestimonialTable";
import { useProtectedRoute } from "@/context/useProtected";
import React, { useState } from "react";

const ManageTestimonial = () => {
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
          btnTitle="Add Testimonials"
          clickEvent={() => setFormOpen(!formOpen)}
        />
      </div>

      <div className="w-full mt-5">
        <TestimonialTable tableRefresh={pageRefresh} />
      </div>
      {/* form */}
      {formOpen && (
        <div className="w-full">
          <div className=" absolute w-full -mt-40">
            <div className="w-full flex items-center justify-center">
              <TestimonialInputForm
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

export default ManageTestimonial;
