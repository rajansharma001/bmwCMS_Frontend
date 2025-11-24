"use client";
import Alert from "@/components/alertAndNotification/Alert";
import Button from "@/components/Button";
import { useProtectedRoute } from "@/context/useProtected";
import { formInput, inputLable } from "@/styles/styles";
import { Loader } from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const CounterTable = ({ tableRefresh }) => {
  useProtectedRoute();
  const [counter, setCounter] = useState([]);
  const [updateAlertPop, setUpdateAlertPop] = useState(false);
  const [counterId, setCounterId] = useState("");
  const [updateFormPop, setUpdateFormPop] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [globalRefereshTable, setGlobalRefereshTable] = useState(false);
  const [formData, setFormData] = useState({
    countNumber: "",
    title: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      if (
        type === "file" &&
        e.target instanceof HTMLInputElement &&
        e.target.files
      ) {
        return {
          ...prev,
          [name]: e.target.files[0],
        };
      } else {
        return {
          ...prev,
          [name]: value,
        };
      }
    });
  };

  useEffect(() => {
    let isMounted = true;
    const handleFetch = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/counters/get-counter`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const result = await res.json();
        if (!res.ok) {
          if (isMounted) {
            toast.error(result.error);
          }
        } else {
          if (isMounted) {
            setCounter(result.getCounter);
          }
        }
      } catch (error) {
        toast.error("API Error!", error);
      }
    };
    handleFetch();
    return () => {
      isMounted = false;
    };
  }, [globalRefereshTable, tableRefresh]);

  const handleEditClick = (id: string) => {
    setCounterId(id);
    setUpdateAlertPop(true);
  };
  const fetchCounterById = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/counters/get-counter/${counterId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await res.json();
      setIsSubmitLoading(false);

      if (!res.ok) {
        toast.error(result.error);
      } else {
        setFormData({
          title: result.getCounterById.title || "",
          countNumber: result.getCounterById.countNumber || "",
        });
      }
    } catch (error) {
      setIsSubmitLoading(false);
      toast.error("API Error!", error);
    }
  };

  const handleAlertConfirmForUpdate = async () => {
    setUpdateAlertPop(false);
    setUpdateFormPop(true);
    await fetchCounterById();
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/counters/update-counter/${counterId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await res.json();
      setIsSubmitLoading(false);

      if (!res.ok) {
        toast.error(result.error);
      } else {
        setGlobalRefereshTable((prev) => !prev);
        setUpdateFormPop(false);
        toast.success("Counter updated successfullyl.");
      }
    } catch (error) {
      setIsSubmitLoading(false);
      toast.error("API Error!", error);
    }
  };

  return (
    <div className="w-full">
      {/* Ticket Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-black text-sm text-left min-w-[1200px]">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-3">S.No.</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Counter Number</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {counter?.length > 0 ? (
              counter.map((details, index) => (
                <tr
                  key={details._id as string}
                  className="border-b hover:bg-gray-100 transition text-white hover:text-black"
                >
                  <td className="px-4 py-3 font-medium">{index + 1}</td>

                  <td className="px-4 py-3">{details.title}</td>
                  <td className="px-4 py-3">{details.countNumber}</td>

                  <td className="px-4 py-3 flex justify-center items-center mt-5">
                    <button
                      className={`  bg-primary hover:bg-gray-300 text-white h-10 flex items-center justify-center rounded-sm py-4 px-7 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm`}
                      onClick={() => handleEditClick(details._id)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={12}
                  className="text-center py-6 text-gray-500 italic"
                >
                  No ticket counter records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Alerts popup */}
      <div className="w-full absolute top-50">
        {updateAlertPop && (
          <Alert
            cancel={() => {
              setUpdateAlertPop(false);
              setCounterId("");
            }}
            confirm={handleAlertConfirmForUpdate}
            desc="You want to update this Counter?"
          />
        )}
      </div>

      {updateFormPop && (
        <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="w-full flex justify-center items-center  ">
            {isSubmitLoading ? (
              <div className="p-10 bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
                <Loader size={30} className="animate-spin" />
                <h1 className="mt-2">Updating Counter...</h1>
              </div>
            ) : (
              <form
                className="relative space-y-6 w-full max-w-4xl p-8 -mt-20 rounded-xl shadow-sm bg-white border border-gray-200 "
                onSubmit={handleUpdate}
                method="POST"
              >
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800">
                    New Brand
                  </h2>
                  <Button
                    btnStyle="bg-red-500 hover:bg-red-600 text-white rounded-md"
                    btnTitle="Close"
                    clickEvent={() => setUpdateAlertPop(false)}
                  />
                </div>
                {/* GRID START — 4 columns for dense input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* couner number */}
                  <div className="lg:col-span-2">
                    <label htmlFor="subTitle" className={inputLable}>
                      Counter Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="countNumber"
                        name="countNumber"
                        type="number"
                        value={formData.countNumber}
                        onChange={handleChange}
                        placeholder="Counter Number"
                        required
                        className={formInput}
                      />
                    </div>
                  </div>
                  {/* Title */}
                  <div className="lg:col-span-2">
                    <label htmlFor="title" className={inputLable}>
                      Title <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Counter Title"
                        required
                        className={formInput}
                      />
                    </div>
                  </div>
                </div>
                {/* Buttons */}
                <div className="w-full  flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
                  <Button btnStyle="" btnTitle="Update" />
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CounterTable;
