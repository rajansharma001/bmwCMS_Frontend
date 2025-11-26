"use client";
import { formInput, inputHelp, inputLable } from "@/styles/styles";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import Button from "../Button";
import Alert from "../alertAndNotification/Alert";
import { Loader } from "lucide-react";
import { clientType } from "@/types/clientTypes";
import { toast } from "sonner";

const ClientFetch = ({ refreshTable }) => {
  const [message, setMessage] = useState<string>("");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [clientDetails, setClientDetails] = useState<clientType[] | null>([]);
  const [fetchedEmail, setFetchedEmail] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [formData, setFormData] = useState<clientType>({
    clientName: "",
    companyName: "",
    email: "",
    phone: "",
    mobile: "",
    address: "",
  });

  // delete logic
  const [clientId, setClientId] = useState("");
  const [globalRefreshTable, setGlobalRefereshTable] = useState(false);
  const [deleteAlertPop, setDeleteAlertPop] = useState(false);
  const [updateAlertPop, setUpdateAlertPop] = useState(false);

  const [updateFormPop, setUpdateFormPop] = useState(false);
  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clients/delete-client/${clientId}`,
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
        toast.success("Client deleted successfully.");
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/clients/get-client`,
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
            setClientDetails(result.getClients);
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
    if (!search.trim()) return clientDetails;
    const lower = search.toLowerCase();
    return clientDetails.filter(
      (item) =>
        item.clientName?.toLowerCase().includes(lower) ||
        item.companyName?.toLowerCase().includes(lower) ||
        item.address?.toLowerCase().includes(lower) ||
        item.email.toString().toLowerCase().includes(lower) ||
        item.mobile?.toLowerCase().includes(lower) ||
        item.phone?.toLowerCase().includes(lower)
    );
  }, [search, clientDetails]);

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

  const fetchClientById = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clients/get-client/${clientId}`,
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
          clientName: result.getClientsById.clientName || "",
          companyName: result.getClientsById.companyName || "",
          phone: result.getClientsById.phone || "",
          mobile: result.getClientsById.mobile || "",
          address: result.getClientsById.address || "",
        });

        setFetchedEmail(result.getClientsById.email);
      }
    } catch (error) {
      toast.error(`API ERROR. : ${error}`);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clients/update-client/${clientId}`,
        {
          method: "PATCH",
          credentials: "include",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await res.json();
      setIsSubmitLoading(false);
      if (!res.ok) {
        toast.error(result.error);
      } else {
        setGlobalRefereshTable((prev) => !prev);
        toast.success("Client details updated successfully.");
        setUpdateFormPop(false);
      }
    } catch (error) {
      toast.error(`API ERROR. : ${error}`);
    }
  };

  const handleReset = () => {
    setFormData({
      clientName: "",
      companyName: "",
      email: "",
      phone: "",
      mobile: "",
      address: "",
    });
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
                <th className="px-4 py-3">Client Name</th>
                <th className="px-4 py-3">Company Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((details, index) => (
                  <tr
                    key={details._id as string}
                    className="border-b hover:bg-gray-100 transition text-white hover:text-black"
                  >
                    <td className="px-4 py-3 font-medium">{index + 1}</td>
                    <td className="px-4 py-3">{details.clientName}</td>
                    <td className="px-4 py-3">{details.companyName}</td>
                    <td className="px-4 py-3">{details.email}</td>
                    <td className="px-4 py-3">{details.phone}</td>
                    <td className="px-4 py-3">{details.mobile}</td>
                    <td className="px-4 py-3">{details.address}</td>

                    <td className="">
                      <div className="flex items-center justify-center py-2 gap-2">
                        <Button
                          btnStyle="bg-primary"
                          btnTitle="Edit"
                          clickEvent={() => {
                            setClientId(details._id as string);
                            setUpdateAlertPop(true);
                          }}
                        />
                        <Button
                          btnStyle="bg-secondary"
                          btnTitle="Delete"
                          clickEvent={() => {
                            setClientId(details._id as string);
                            setDeleteAlertPop(true);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No client records found
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
              setClientId("");
            }}
            confirm={handleDelete}
            desc="You want to delete this Client?"
          />
        )}

        {updateAlertPop && (
          <Alert
            cancel={() => {
              setUpdateAlertPop(false);
              setClientId("");
            }}
            confirm={async () => {
              setUpdateAlertPop(false);
              await fetchClientById();
              setUpdateFormPop(true);
            }}
            desc="You want to update this Client?"
          />
        )}
      </div>

      {/* update popup form */}

      {updateFormPop && (
        <div className=" absolute top-50 right-30 w-full flex items-center justify-center ">
          {isSubmitLoading ? (
            <div className="w-full flex justify-center items-center absolute top-0 left-0 h-full bg-black/30">
              <div className="p-10 w-fit bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
                <Loader size={30} className="animate-spin" />
                <h1 className="mt-2">Updating Client...</h1>
              </div>
            </div>
          ) : (
            <form
              className="relative space-y-6 w-[70%] p-15 rounded-sm bg-white"
              onSubmit={handleUpdate}
              method="POST"
            >
              <div className="absolute top-2 right-2">
                <Button
                  btnStyle=""
                  btnTitle="Close"
                  clickEvent={() => {
                    setClientId("");
                    setUpdateFormPop(false);
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 backdrop-blur-2xl">
                <div>
                  <label htmlFor="clientName" className={`${inputLable}`}>
                    Client Name
                  </label>
                  <input
                    id="clientName"
                    name="clientName"
                    type="text"
                    value={formData.clientName}
                    onChange={handleChange}
                    required
                    className={`${formInput}`}
                    placeholder="Enter client name"
                  />
                  <p id="clientName_help" className={`${inputHelp}`}>
                    Enter the client`s full name.
                  </p>
                </div>

                <div>
                  <label htmlFor="companyName" className={`${inputLable}`}>
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className={`${formInput}`}
                    placeholder="Enter company name"
                  />
                  <p id="companyName_help" className={`${inputHelp}`}>
                    Enter the company name.
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className={`${inputLable}`}>
                    Email
                  </label>
                  <h1 className={`${formInput} `}>{fetchedEmail}</h1>
                  <p id="email_help" className={`${inputHelp}`}>
                    You can not change email address.
                  </p>
                </div>

                <div>
                  <label htmlFor="phone" className={`${inputLable}`}>
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={`${formInput}`}
                    placeholder="Enter phone number"
                  />
                  <p id="phone_help" className={`${inputHelp}`}>
                    Enter office or landline number.
                  </p>
                </div>

                <div>
                  <label htmlFor="mobile" className={`${inputLable}`}>
                    Mobile
                  </label>
                  <input
                    id="mobile"
                    name="mobile"
                    type="text"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className={`${formInput}`}
                    placeholder="Enter mobile number"
                  />
                  <p id="mobile_help" className={`${inputHelp}`}>
                    Enter client mobile number.
                  </p>
                </div>

                <div>
                  <label htmlFor="address" className={`${inputLable}`}>
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className={`${formInput}`}
                    placeholder="Enter address"
                  />
                  <p id="address_help" className={`${inputHelp}`}>
                    Enter client address.
                  </p>
                </div>
              </div>

              <div className="w-full flex justify-between gap-3">
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

export default ClientFetch;
