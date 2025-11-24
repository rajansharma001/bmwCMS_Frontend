"use client";
import Button from "@/components/Button";
import GalleryInputForm from "@/components/webComponents/webDashboardComponents/galleryComponents/GalleryInputForm";
import GalleryTable from "@/components/webComponents/webDashboardComponents/galleryComponents/GalleryTable";
import { useProtectedRoute } from "@/context/useProtected";
import React, { useState } from "react";

const ManageGallery = () => {
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
          btnTitle="Add Gallery"
          clickEvent={() => setFormOpen(!formOpen)}
        />
      </div>

      <div className="w-full mt-5">
        <GalleryTable tableRefresh={pageRefresh} />
      </div>
      {/* form */}
      {formOpen && (
        <div className="w-full">
          <div className=" absolute w-full ">
            <div className="w-full flex items-center justify-center">
              <GalleryInputForm
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
export default ManageGallery;
