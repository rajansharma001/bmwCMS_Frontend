"use client";
import { formInput, inputHelp, inputLable } from "@/styles/styles";
import { VehicleType } from "@/types/vehicleTypes";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import Button from "../Button";
import Alert from "../alertAndNotification/Alert";
import { MaintanaceTypes } from "@/types/MaintananceTypes";
import Image from "next/image";
import { Loader } from "lucide-react";

const MaintananceFetch = ({ refreshTable }) => {
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [vehicleData, setVehicleData] = useState<VehicleType[] | null>([]);
  const [receiptUrl, setReceiptUrl] = useState("");
  const [maintnanceDetails, setMaintnanceDetails] = useState<
    MaintanaceTypes[] | null
  >([]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [formData, setFormData] = useState<MaintanaceTypes>({
    vehicleId: "",
    cost: "",
    date: "",
    description: "",
    receipt: "",
  });

  // delete logic
  const [maintananceId, setMaintananceId] = useState("");
  const [globalRefreshTable, setGlobalRefereshTable] = useState(false);
  const [deleteAlertPop, setDeleteAlertPop] = useState(false);
  const [updateAlertPop, setUpdateAlertPop] = useState(false);

  const [updateFormPop, setUpdateFormPop] = useState(false);
  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle-maintanance/delete-maintanance/${maintananceId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const result = await res.json();
      if (!res.ok) {
        setSuccess(false);
        setMessage(result.error);
      } else {
        setDeleteAlertPop(false);
        setGlobalRefereshTable((prev) => !prev);
        setSuccess(true);
        setMessage("Maintanance deleted successfully.");
      }
    } catch (error) {
      setSuccess(false);
      setMessage(`API ERROR. : ${error}`);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const handleFetch = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle-maintanance/get-maintanance`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const result = await res.json();
        if (!res.ok) {
          if (isMounted) {
            setSuccess(false);
            setMessage(result.error);
          }
        } else {
          if (isMounted) {
            setMaintnanceDetails(result.getMaintananceRecord);
          }
        }
      } catch (error) {
        if (isMounted) {
          setSuccess(false);
          setMessage(`API ERROR. : ${error}`);
        }
      }
    };

    handleFetch();
    return () => {
      isMounted = false;
    };
    // refresh table when new vehicle submited
  }, [refreshTable, globalRefreshTable]);

  const filteredData = useMemo(() => {
    if (!search.trim()) return maintnanceDetails;
    const lower = search.toLowerCase();
    return maintnanceDetails.filter(
      (item) =>
        item.vehicleId?.toLowerCase().includes(lower) ||
        item.receipt?.toLowerCase().includes(lower) ||
        item.description?.toLowerCase().includes(lower) ||
        item.cost.toString().toLowerCase().includes(lower) ||
        item.date?.toLowerCase().includes(lower)
    );
  }, [search, maintnanceDetails]);

  // Calculate paginated data

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  useEffect(() => {
    if (message !== "") {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // fetch vehicle details by id

  const fetchMaintananceById = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle-maintanance/get-maintanance/${maintananceId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const result = await res.json();
      if (!res.ok) {
        setSuccess(false);
        setMessage(result.error);
      } else {
        setFormData({
          vehicleId: result.getMaintananceRecordById.vehicleId || "",
          date:
            new Date(result.getMaintananceRecordById.date)
              .toISOString()
              .split("T")[0] || "",
          cost: result.getMaintananceRecordById.cost || "",
          receipt: result.getMaintananceRecordById.receipt || "",
          description: result.getMaintananceRecordById.description || "",
        });
      }
    } catch (error) {
      setSuccess(false);
      setMessage(`API ERROR. : ${error}`);
    }
  };

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

  const handleUpdate = async (e: FormEvent) => {
    const form = new FormData();
    form.append("vehicleId", formData.vehicleId);
    form.append("cost", formData.cost);
    form.append("date", formData.date);
    form.append("description", formData.description);
    form.append("receipt", formData.receipt);
    setIsSubmitLoading(true);
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle-maintanance/update-maintanance/${maintananceId}`,
        {
          method: "PATCH",
          body: form,
          credentials: "include",
        }
      );
      const result = await res.json();
      setIsSubmitLoading(false);
      if (!res.ok) {
        setSuccess(false);
        setMessage(result.error);
      } else {
        setGlobalRefereshTable((prev) => !prev);
        setSuccess(true);
        setMessage("Maintnance details updated successfully.");
        setUpdateFormPop(false);
      }
    } catch (error) {
      setSuccess(false);
      setMessage(`API ERROR. : ${error}`);
    }
  };

  const handleReset = () => {
    setFormData({
      vehicleId: "",
      cost: "",
      date: "",
      description: "",
      receipt: "",
    });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchVehicle = async () => {
      setIsSubmitLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle/get-vehicles`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result = await res.json();
        setIsSubmitLoading(false);
        if (!res.ok) {
          if (isMounted) {
            setSuccess(false);
            setMessage(result.error);
          }
        } else {
          if (isMounted) {
            setVehicleData(result.getVehicle);
          }
        }
      } catch (error) {
        if (isMounted) {
          setSuccess(false);
          setMessage(`API ERROR. : ${error}`);
        }
      }
    };

    fetchVehicle();

    return () => {
      isMounted = false;
    };
  }, []);

  console.log(formData);
  return (
    <div className="w-full">
      {/* notification alert */}
      <div className="py-3">
        {message !== "" && (
          <div
            className={` w-full p-5 rounded-md ${
              success ? "bg-green-200 text-white" : "bg-red-200 text-white"
            }`}
          >
            <h1 className={`${success ? "text-green-700 " : "text-red-700 "}`}>
              {message}
            </h1>
          </div>
        )}
      </div>

      <div className="w-full mt-5">
        <div className="overflow-x-auto rounded-sm shadow-md  border-gray-300">
          <div className="flex justify-end py-5">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${formInput}`}
            />
          </div>
          <table className="min-w-full border-collapse bg-black text-sm text-left scroll-auto">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-4 py-3">S.No.</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Description </th>
                <th className="px-4 py-3">Receipt</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((details, index) => (
                  <tr
                    key={details._id}
                    className="border-b hover:bg-gray-100 transition text-white hover:text-black"
                  >
                    <td className="px-4 py-3 font-medium  ">{index + 1}</td>
                    <td className="px-4 py-3">
                      {vehicleData.find(
                        (data) => data._id === details.vehicleId
                      )?.v_number || "No name"}
                    </td>
                    <td className="px-4 py-3">{details.cost}</td>
                    <td className="px-4 py-3">
                      {new Date(details.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{details.description}</td>
                    <td className="px-4 py-3">
                      <Image
                        alt="receipt"
                        src={details.receipt}
                        width={100}
                        height={100}
                        className="h-9"
                      />
                    </td>

                    <td className="">
                      <div className=" flex items-center justify-center py-2 gap-2">
                        <Button
                          btnStyle="bg-primary "
                          btnTitle="Edit"
                          clickEvent={() => {
                            setMaintananceId(details._id);
                            setUpdateAlertPop(true);
                            setReceiptUrl(details.receipt);
                          }}
                        />
                        <Button
                          btnStyle="bg-secondary "
                          btnTitle="Delete"
                          clickEvent={() => {
                            setMaintananceId(details._id);
                            setDeleteAlertPop(true);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center py-6 text-gray-500 italic">
                    No vehicle Maintnance found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-300">
              Page {currentPage} of {totalPages}
            </p>
            <div className="space-x-2 flex justify-center items-center">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className={` text-white h-10 flex items-center justify-center rounded-sm  py-4 px-7 bg-primary hover:bg-gray-500 hover:text-gray-300 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm `}
              >
                Prev
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className={`  text-white h-10 flex items-center justify-center rounded-sm  py-4 px-7 bg-primary hover:bg-gray-500 hover:text-gray-300 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm `}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* alert popup */}

      <div className="w-full  absolute top-50  ">
        {deleteAlertPop && (
          <Alert
            cancel={() => {
              setDeleteAlertPop(false);
              setMaintananceId("");
            }}
            confirm={handleDelete}
            desc="You want to delete this vehicle?"
          />
        )}

        {updateAlertPop && (
          <Alert
            cancel={() => {
              setUpdateAlertPop(false);
              setMaintananceId("");
            }}
            confirm={async () => {
              setUpdateAlertPop(false);
              await fetchMaintananceById();
              setUpdateFormPop(true);
            }}
            desc="You want to update this vehicle?"
          />
        )}
      </div>

      {/* update popup form */}

      {updateFormPop && (
        <div className=" absolute top-50 right-30 w-full flex items-center justify-center ">
          {isSubmitLoading ? (
            <div className="w-full flex flex-col items-center justify-center text-white">
              <Loader size={30} className="animate-spin text-white" />
              <h1 className="text-white">Loading</h1>
            </div>
          ) : (
            <form
              className="relative space-y-6 w-[70%]  p-15 rounded-sm bg-white"
              onSubmit={handleUpdate}
              method="POST"
            >
              <div className="absolute top-2 right-2 ">
                <Button
                  btnStyle=""
                  btnTitle="Close"
                  clickEvent={() => {
                    setMaintananceId("");
                    setUpdateFormPop(false);
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 backdrop-blur-2xl">
                <div>
                  <label htmlFor="vehicleId" className={`${inputLable}`}>
                    Vehicle Model
                  </label>

                  <select
                    name="vehicleId"
                    id="vehicleId"
                    onChange={handleChange}
                    value={formData.vehicleId}
                    className={`${formInput}`}
                    aria-describedby="vehicleId_help"
                  >
                    {vehicleData &&
                      vehicleData.map((data) => (
                        <option value={data._id} key={data._id}>
                          {data.v_number}
                        </option>
                      ))}
                  </select>
                  <p id="vehicle_help" className={`${inputHelp}`}>
                    Select a vehicle.
                  </p>
                </div>

                <div>
                  <label htmlFor="cost" className={`${inputLable}`}>
                    Maintanance Cost
                  </label>
                  <input
                    id="cost"
                    name="cost"
                    type="number"
                    value={formData.cost}
                    onChange={handleChange}
                    required
                    className={`${formInput}`}
                    placeholder="00.00"
                  />
                  <p id="cost_help" className={`${inputHelp}`}>
                    Enter maintanace cost.
                  </p>
                </div>

                <div>
                  <label htmlFor="date" className={`${inputLable}`}>
                    Maintanance Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className={`${formInput}`}
                    aria-describedby="date_help"
                  />
                  <p id="date_help" className={`${inputHelp}`}>
                    Enter maintanance date.
                  </p>
                </div>

                <div>
                  <Image
                    alt="receipt"
                    src={receiptUrl}
                    width={100}
                    height={100}
                  />
                  <label htmlFor="receipt" className={`${inputLable}`}>
                    Maintanance Receipt
                  </label>
                  <input
                    id="receipt"
                    name="receipt"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className={`${formInput}`}
                    aria-describedby="receipt_help"
                  />
                  <p id="receipt_help" className={`${inputHelp}`}>
                    Upload maintnance receipt.
                  </p>
                </div>
              </div>

              <div className="w-full flex justify-between gap-3">
                <div className="w-[50%] flex flex-col   gap-3">
                  <label htmlFor="description" className={`${inputLable}`}>
                    Maintanance description
                  </label>

                  <textarea
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="eg. light, seat, engine"
                    className={`${formInput}`}
                    aria-describedby="description_help"
                  ></textarea>
                  <p id="receipt_help" className={`${inputHelp}`}>
                    Add Maintanance description.
                  </p>
                </div>
                <div className="w-[50%] flex items-center justify-around gap-3">
                  <Button
                    btnStyle="text-white rounded-sm w-full h-10 flex justify-center items-center"
                    btnTitle="Update"
                  />

                  <Button
                    clickEvent={handleReset}
                    btnStyle="bg-secondary text-white rounded-sm w-full h-10 flex justify-center items-center"
                    btnTitle="Reset"
                  />
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default MaintananceFetch;
