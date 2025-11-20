"use client";
import { formInput } from "@/styles/styles";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { TicketBookingFundsTypes } from "@/types/ticketBookingFundsTypes";
import { FundsLedgerTypes } from "@/types/fundsLedgerTypes";
import Alert from "../alertAndNotification/Alert";
import Button from "../Button";
import { Loader } from "lucide-react";

const FundsTable = ({ refreshTable }) => {
  const [funds, setFunds] = useState<TicketBookingFundsTypes[] | null>([]);
  const [fundsLedger, setFundsLedger] = useState<FundsLedgerTypes[] | null>([]);
  const [globalRefreshTable, setGlobalRefereshTable] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [formData, setFormData] = useState({
    description: "",
  });
  const [reverseAlertPop, setReverseAlertPop] = useState(false);
  const [fundsById, setFundsById] = useState<TicketBookingFundsTypes>();
  const [fundId, setFundId] = useState("");
  const [reverseFormOpen, setReverseFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    let isMounted = true;
    const handleLedgerFetch = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/ledgers/get-ledger`,
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
            setFundsLedger(result.getFundsLedgerTable);
            setGlobalRefereshTable(false);
          }
        }
      } catch (error) {
        if (isMounted) {
          toast.error(`API ERROR: ${error}`);
        }
      }
    };

    handleLedgerFetch();
    return () => {
      isMounted = false;
    };
  }, [refreshTable, globalRefreshTable]);

  useEffect(() => {
    let isMounted = true;
    const handleFetch = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/funds/get-fund`,
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
            setFunds(result.getFunds);
            setGlobalRefereshTable(false);
          }
        }
      } catch (error) {
        if (isMounted) {
          toast.error(`API ERROR: ${error}`);
        }
      }
    };

    handleFetch();
    return () => {
      isMounted = false;
    };
  }, [refreshTable, globalRefreshTable]);

  const filteredData = useMemo(() => {
    if (!search.trim()) return funds;
    const lower = search.toLowerCase();
    return funds?.filter(
      (item) =>
        item.fundsFor?.toString().toLowerCase().includes(lower) ||
        item.availableFund?.toString().toLowerCase().includes(lower) ||
        item.newFund?.toString().toLowerCase().includes(lower) ||
        item.reversedFundId?.toLowerCase().includes(lower) ||
        item.status?.toString().toLowerCase().includes(lower)
    );
  }, [search, funds]);

  // Calculate paginated data
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData =
    filteredData?.slice(startIndex, startIndex + rowsPerPage) || [];
  const totalPages = Math.ceil((filteredData?.length || 0) / rowsPerPage);

  useEffect(() => {
    let isMounted = true;
    const handleFetchById = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/funds/get-fund/${fundId}`,
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
            setFundsById(result.getFundsById);
          }
        }
      } catch (error) {
        if (isMounted) {
          toast.error(`API ERROR: ${error}`);
        }
      }
    };

    handleFetchById();
    return () => {
      isMounted = false;
    };
  }, [refreshTable, fundId, globalRefreshTable]);

  const handleReverseClick = (id: string) => {
    setFundId(id);
    setReverseAlertPop(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      description: "",
    });
  };

  const handlSubmiteConfirmForReverse = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/funds/reverse-fund/${fundId}`,
        {
          method: "POST",
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
        toast.success("Fund reversed successfully.");
        setGlobalRefereshTable(true);
        setReverseFormOpen(false);
        setFormData({
          description: "",
        });
      }
    } catch (error) {
      toast.error(`API ERROR. : ${error}`);
    }
  };
  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="flex justify-end py-5">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset page on search
          }}
          className={`${formInput}`}
        />
      </div>

      <div className="w-full flex gap-3 ">
        <div className="w-[70%]">
          {/* Trip Table */}
          <table className="w-full border-collapse bg-black text-sm text-left scroll-auto">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-4 py-3">S.No.</th>
                <th className="px-4 py-3">Airline</th>
                <th className="px-4 py-3">Fund</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 ">Reverse Reason</th>
                <th className="px-4 py-3 ">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((details, index) => (
                  <tr
                    key={details._id as string}
                    className="border-b hover:bg-gray-100 transition text-white hover:text-black"
                  >
                    <td className="px-4 py-3 font-medium">
                      {startIndex + index + 1}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {details.fundsFor}
                    </td>
                    <td className="px-4 py-3 font-medium">{details.newFund}</td>
                    <td className="px-4 py-3 font-medium">
                      {new Date(details.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                          details.status === "reversal-in" ||
                          details.status === "reversed-out"
                            ? "bg-red-100 text-red-700"
                            : details.status === "completed"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {details.status || "pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {details.description}
                    </td>

                    {/* Action Buttons */}
                    <td className="">
                      <div className="flex items-center justify-center py-2 gap-2">
                        <button
                          onClick={() => handleReverseClick(details._id)}
                          disabled={
                            details.status === "reversed-out" ||
                            details.status === "reversal-in"
                          }
                          className={` ${
                            details.status === "reversed-out" ||
                            details.status === "reversal-in"
                              ? "bg-gray-300 hover:text-white"
                              : "bg-green-600 hover:bg-green-700"
                          }   text-white h-10 flex items-center justify-center rounded-sm  py-4 px-7  hover:text-gray-300 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm `}
                        >
                          Reverse
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={16} // Updated colspan to 16
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No trip records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-300">
              Page {currentPage} of {totalPages}
            </p>
            <div className="space-x-2 flex justify-center items-center">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className={` text-white h-10 flex items-center justify-center rounded-sm py-4 px-7 bg-primary hover:bg-gray-500 hover:text-gray-300 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Prev
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className={` text-white h-10 flex items-center justify-center rounded-sm py-4 px-7 bg-primary hover:bg-gray-500 hover:text-gray-300 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <div className="w-[30%]">
          <table className="w-full border-collapse bg-black text-sm text-left scroll-auto">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-4 py-3">S.No.</th>
                <th className="px-4 py-3">Airline</th>
                <th className="px-4 py-3 text-center">Available Balance</th>
              </tr>
            </thead>
            <tbody>
              {fundsLedger.map((ledger, index) => (
                <tr
                  key={ledger._id as string}
                  className="border-b hover:bg-gray-100 transition text-white hover:text-black"
                >
                  <td className="px-4 py-3 font-medium">
                    {startIndex + index + 1}
                  </td>

                  <td className="px-4 py-3 font-medium">{ledger.airline}</td>
                  <td className="px-4 py-3 font-medium text-center">
                    {ledger.balance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts popup */}
      <div className="w-full absolute top-50">
        {reverseAlertPop && (
          <Alert
            cancel={() => {
              setReverseAlertPop(false);
              setFundId("");
            }}
            confirm={() => {
              setReverseFormOpen(true);
              setReverseAlertPop(false);
            }}
            desc="You want to reverse this payment?"
          />
        )}

        {/* reverse form */}

        {reverseFormOpen && (
          <div className="bg-white w-full max-w-lg p-6 md:p-8 rounded-lg shadow-xl absolute top-0 right-150">
            <Button
              btnStyle="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100  focus:outline-none focus:ring-2 focus:ring-gray-400"
              btnTitle="Close"
              clickEvent={() => {
                setReverseFormOpen(false);
                setFundId("");
                handleReset();
              }}
              aria-label="Close"
            />
            {isSubmitLoading ? (
              <div className="p-10 bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
                <Loader size={30} className="animate-spin" />
                <h1 className="mt-2">Submitting reverse...</h1>
              </div>
            ) : (
              <form
                className="space-y-6"
                onSubmit={handlSubmiteConfirmForReverse}
                method="POST"
              >
                <h2 className="text-2xl font-semibold text-gray-900">
                  Confirm Transaction Reversal
                </h2>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                  <p className="text-sm text-yellow-900">
                    You are about to deduct{" "}
                    <strong className="font-medium">{fundsById.newFund}</strong>{" "}
                    from{" "}
                    <strong className="font-medium">
                      {fundsById.fundsFor}
                    </strong>
                    .
                  </p>
                  <p className="mt-1 text-sm text-yellow-700">
                    Please review the details carefully. This action cannot be
                    undone.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description / Reference
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g., Reversal for incorrect entry TXN-123"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  ></textarea>
                  <p className="mt-2 text-xs text-gray-500">
                    Provide a clear reason for this reversal.
                  </p>
                </div>

                <div className="flex justify-end gap-4 pt-5 border-t border-gray-200">
                  <Button
                    btnTitle="Reset"
                    clickEvent={handleReset}
                    btnStyle=""
                  />
                  <Button
                    btnStyle="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    btnTitle="Confirm Reverse"
                  />
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FundsTable;
