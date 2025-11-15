"use client";
import Button from "@/components/Button";
import ClientFetch from "@/components/clientComponents/ClientFetch";
import ClientInputForm from "@/components/clientComponents/ClientInputForm";
import React, { useState } from "react";

const ManageClients = () => {
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
          btnTitle="Add Client"
          clickEvent={() => setFormOpen(!formOpen)}
        />
      </div>

      <div className="w-full">
        <ClientFetch refreshTable={pageRefresh} />
      </div>
      {/* maintnance form */}

      {formOpen && (
        <div className=" absolute top-25 w-full ">
          <div className="w-full flex items-center justify-center">
            <ClientInputForm
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

export default ManageClients;
