"use client";
import { formInput, inputHelp, inputLable } from "@/styles/styles";
import { VehicleType } from "@/types/vehicleTypes";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import Button from "../Button";
import Alert from "../alertAndNotification/Alert";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const VehicleFetch = ({ refreshTable }) => {
  const [vehicleDetails, setVehicleDetails] = useState<VehicleType[] | null>(
    []
  );
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [formData, setFormData] = useState<VehicleType>({
    v_model: "",
    v_type: "",
    v_brand: "",
    v_number: "",
    last_service_date: "",
  });

  // delete logic
  const [vehicleId, setVehicleId] = useState("");
  const [globalRefreshTable, setGlobalRefereshTable] = useState(false);
  const [deleteAlertPop, setDeleteAlertPop] = useState(false);
  const [updateAlertPop, setUpdateAlertPop] = useState(false);

  const [updateFormPop, setUpdateFormPop] = useState(false);
  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle/delete-vehicle/${vehicleId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error);
      } else {
        setDeleteAlertPop(false);
        setGlobalRefereshTable((prev) => !prev);
        toast.success("Vehicle deleted successfully.");
      }
    } catch (error) {
      toast.error(`API ERROR. : ${error}`);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const handleFetch = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle/get-vehicles`,
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
            setVehicleDetails(result.getVehicle);
          }
        }
      } catch (error) {
        if (isMounted) {
          toast.error(`API ERROR. : ${error}`);
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
    if (!search.trim()) return vehicleDetails;
    const lower = search.toLowerCase();
    return vehicleDetails.filter(
      (item) =>
        item.v_brand?.toLowerCase().includes(lower) ||
        item.v_model?.toLowerCase().includes(lower) ||
        item.v_number?.toLowerCase().includes(lower) ||
        item.v_type?.toLowerCase().includes(lower)
    );
  }, [search, vehicleDetails]);

  // Calculate paginated data

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // fetch vehicle details by id

  const fetchVehicleById = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle/get-vehicle/${vehicleId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error);
      } else {
        setFormData({
          v_model: result.getVehicleById.v_model || "",
          v_type: result.getVehicleById.v_type || "",
          v_brand: result.getVehicleById.v_brand || "",
          v_number: result.getVehicleById.v_number || "",
          last_service_date:
            new Date(result.getVehicleById.last_service_date)
              .toISOString()
              .split("T")[0] || "",
        });
      }
    } catch (error) {
      toast.error(`API ERROR. : ${error}`);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle/update-vehicle/${vehicleId}`,
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
      if (!res.ok) {
        setIsSubmitLoading(false);

        toast.error(result.error);
      } else {
        setIsSubmitLoading(false);

        setUpdateFormPop(false);
        setGlobalRefereshTable((prev) => !prev);
        toast.success("Vehicle details updated successfully.");
      }
    } catch (error) {
      toast.error(`API ERROR. : ${error}`);
    }
  };

  return (
    <div className="w-full">
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
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Number</th>
                <th className="px-4 py-3">Last Service Date</th>
                <th className="px-4 py-3">Type</th>
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
                    <td className="px-4 py-3">{details.v_brand}</td>
                    <td className="px-4 py-3">{details.v_model}</td>
                    <td className="px-4 py-3">{details.v_number}</td>
                    <td className="px-4 py-3">
                      {new Date(details.last_service_date).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full">
                        {details.v_type}
                      </span>
                    </td>
                    <td className="">
                      <div className=" flex items-center justify-center py-2 gap-2">
                        <Button
                          btnStyle="bg-primary "
                          btnTitle="Edit"
                          clickEvent={() => {
                            setVehicleId(details._id);
                            setUpdateAlertPop(true);
                          }}
                        />
                        <Button
                          btnStyle="bg-secondary "
                          btnTitle="Delete"
                          clickEvent={() => {
                            setVehicleId(details._id);
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
                    No vehicle details found
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
              setVehicleId("");
            }}
            confirm={handleDelete}
            desc="You want to delete this vehicle?"
          />
        )}

        {updateAlertPop && (
          <Alert
            cancel={() => {
              setUpdateAlertPop(false);
              setVehicleId("");
            }}
            confirm={async () => {
              setUpdateAlertPop(false);
              await fetchVehicleById();
              setUpdateFormPop(true);
            }}
            desc="You want to update this vehicle?"
          />
        )}
      </div>

      {/* update popup form */}

      {updateFormPop && (
        <div className="w-full absolute top-50">
          {isSubmitLoading ? (
            <div className="w-full flex justify-center items-center">
              <div className="p-10 w-fit bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
                <Loader size={30} className="animate-spin" />
                <h1 className="mt-2">Updating Vehicle...</h1>
              </div>
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
                    setVehicleId("");
                    setUpdateFormPop(false);
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 backdrop-blur-2xl">
                <div>
                  <label htmlFor="v_model" className={`${inputLable}`}>
                    Vehicle Model
                  </label>
                  <input
                    id="v_model"
                    name="v_model"
                    type="text"
                    value={formData.v_model}
                    onChange={handleChange}
                    required
                    className={`${formInput}`}
                    placeholder="e.g. Civic, Corolla"
                    aria-describedby="v_model_help"
                  />
                  <p id="v_model_help" className={`${inputHelp}`}>
                    Model name or number of the vehicle.
                  </p>
                </div>

                <div>
                  <label htmlFor="v_brand" className={`${inputLable}`}>
                    Brand
                  </label>
                  <input
                    id="v_brand"
                    name="v_brand"
                    type="text"
                    value={formData.v_brand}
                    onChange={handleChange}
                    required
                    className={`${formInput}`}
                    placeholder="e.g. Honda, Toyota"
                  />
                  <p id="v_type_help" className={`${inputHelp}`}>
                    Select vehicle brand.
                  </p>
                </div>

                <div>
                  <label htmlFor="v_type" className={`${inputLable}`}>
                    Type
                  </label>
                  <select
                    id="v_type"
                    name="v_type"
                    required
                    className={`${formInput}`}
                    value={formData.v_type}
                    onChange={handleChange}
                  >
                    <option value="">Select type</option>
                    <option>Car</option>
                    <option>SUV</option>
                    <option>Truck</option>
                    <option>Motorcycle</option>
                    <option>Van</option>
                    <option>Other</option>
                  </select>
                  <p id="v_type_help" className={`${inputHelp}`}>
                    Select vehicle type.
                  </p>
                </div>

                <div>
                  <label htmlFor="v_number" className={`${inputLable}`}>
                    Vehicle Number
                  </label>
                  <input
                    id="v_number"
                    name="v_number"
                    type="text"
                    value={formData.v_number}
                    onChange={handleChange}
                    required
                    className={`${formInput}`}
                    placeholder="e.g. KA01AB1234"
                    aria-describedby="v_number_help"
                  />
                  <p id="v_number_help" className={`${inputHelp}`}>
                    Enter registration or chassis number.
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="w-[49%]">
                  <label
                    htmlFor="last_service_date"
                    className={`${inputLable}`}
                  >
                    Last Service Date
                  </label>
                  <input
                    id="last_service_date"
                    name="last_service_date"
                    type="date"
                    value={formData.last_service_date}
                    onChange={handleChange}
                    required
                    className={`${formInput}`}
                  />
                  <p className={`${inputHelp}`}>
                    Pick the date of the vehicle most recent service.
                  </p>
                </div>
                <div className="w-[50%] flex items-center justify-around gap-3">
                  <Button
                    btnStyle="text-white rounded-sm w-full h-10 flex justify-center items-center"
                    btnTitle="Update"
                  />

                  <Button
                    clickEvent={() => {
                      setUpdateFormPop(false);
                      setVehicleId("");
                    }}
                    btnStyle="bg-secondary text-white rounded-sm w-full h-10 flex justify-center items-center"
                    btnTitle="Cancel"
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

export default VehicleFetch;
