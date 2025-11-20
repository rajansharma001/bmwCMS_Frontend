import React, { FormEvent, useEffect, useState } from "react";
import Button from "../Button";
import { toast } from "sonner";
import { formInput, inputLable } from "@/styles/styles";
import { clientType } from "@/types/clientTypes";
import { Loader } from "lucide-react";

// Initial state for the update form
const initialFormDataState = {
  clientId: "",
  bookingDate: new Date().toISOString().split("T")[0],
  status: "pending",
  departureFrom: "",
  destinationTo: "",
  departureDate: new Date().toISOString().split("T")[0],
  flightNumber: "",
  seatClass: "Economy",
  bookedBy: "",
  issuedTicketNumber: "",
  remarks: "",
};

const TicketUpdateForm = ({ ticketId, handleStateForUpdate, closeForm }) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [clients, setClients] = useState<clientType[] | null>([]);

  const [formData, setFormData] = useState(initialFormDataState);

  // --- UPDATE Logic ---
  useEffect(() => {
    let isMounted = true;
    const fetchTicketById = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/get-ticket/${ticketId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const result = await res.json();
        if (!res.ok) {
          if (isMounted) {
            toast.error(result.error);
            handleStateForUpdate();
          }
        } else {
          if (isMounted) {
            const ticket = result.getTicketBookingById;
            setFormData({
              clientId: ticket.clientId,
              bookingDate: new Date(ticket.bookingDate)
                .toISOString()
                .split("T")[0],
              status: ticket.status,
              departureFrom: ticket.departureFrom,
              destinationTo: ticket.destinationTo,
              departureDate: new Date(ticket.departureDate)
                .toISOString()
                .split("T")[0],
              flightNumber: ticket.flightNumber || "",
              seatClass: ticket.seatClass,
              bookedBy: ticket.bookedBy,
              issuedTicketNumber: ticket.issuedTicketNumber || "",
              remarks: ticket.remarks || "",
            });

            handleStateForUpdate();
          }
        }
      } catch (error) {
        toast.error(`API ERROR. : ${error}`);
      }
    };

    fetchTicketById();
    return () => {
      isMounted = false;
    };
  }, [handleStateForUpdate, ticketId]);

  useEffect(() => {
    let isMounted = true;
    const getClients = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/clients/get-client`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const result = await res.json();
        if (isMounted && res.ok) setClients(result.getClients || []);
      } catch (error) {
        if (isMounted) toast.error(`API ERROR: ${error}`);
      }
    };
    getClients();
    return () => {
      isMounted = false;
    };
  }, []);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const newValue = ["noOfPassengers", "baseFare", "taxesAndFees"].includes(
      name
    )
      ? Number(value)
      : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/update-ticket/${ticketId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error);
        setIsSubmitLoading(false);
      } else {
        handleStateForUpdate();
        // refreshTable = true;
        toast.success("Ticket details updated successfully.");
        setIsSubmitLoading(false);
      }
    } catch (error) {
      toast.error(`API ERROR. : ${error}`);
      setIsSubmitLoading(false);
    }
  };

  return (
    <div>
      {isSubmitLoading ? (
        <div className="p-10 bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
          <Loader size={30} className="animate-spin" />
          <h1 className="mt-2">Loading Ticket Data...</h1>
        </div>
      ) : (
        <form
          className="relative space-y-6 w-full max-w-4xl p-10 rounded-lg bg-white max-h-[90vh] overflow-y-auto shadow-2xl"
          onSubmit={handleUpdate}
          method="POST"
        >
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
            Update Ticket Booking
          </h2>
          <div className="absolute top-2 right-2">
            <Button
              btnStyle="bg-secondary text-white"
              btnTitle="Close"
              clickEvent={closeForm}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Client ID - Spans 2 columns */}
            <div className="lg:col-span-2">
              <label htmlFor="clientId" className={inputLable}>
                Client <span className="text-red-500">*</span>
              </label>
              <select
                id="clientId"
                name="clientId"
                className={formInput}
                value={formData.clientId}
                onChange={handleChange}
                required
              >
                <option value="">Select client</option>
                {clients?.map((c) => (
                  <option key={c._id as string} value={c._id as string}>
                    {c.clientName} {c.companyName ? `(${c.companyName})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Booking Date */}
            <div className="lg:col-span-1">
              <label htmlFor="bookingDate" className={inputLable}>
                Booking Date <span className="text-red-500">*</span>
              </label>
              <input
                id="bookingDate"
                name="bookingDate"
                type="date"
                value={formData.bookingDate}
                onChange={handleChange}
                required
                className={formInput}
              />
            </div>

            {/* Flight Number - Moved up to fill the row */}
            <div className="lg:col-span-1">
              <label htmlFor="flightNumber" className={inputLable}>
                Flight Number
              </label>
              <input
                id="flightNumber"
                name="flightNumber"
                type="text"
                value={formData.flightNumber}
                onChange={handleChange}
                className={formInput}
              />
            </div>

            {/* Departure From */}
            <div>
              <label htmlFor="departureFrom" className={inputLable}>
                Departure From <span className="text-red-500">*</span>
              </label>
              <input
                id="departureFrom"
                name="departureFrom"
                type="text"
                value={formData.departureFrom}
                onChange={handleChange}
                required
                className={formInput}
              />
            </div>

            {/* Destination To */}
            <div>
              <label htmlFor="destinationTo" className={inputLable}>
                Destination To <span className="text-red-500">*</span>
              </label>
              <input
                id="destinationTo"
                name="destinationTo"
                type="text"
                value={formData.destinationTo}
                onChange={handleChange}
                required
                className={formInput}
              />
            </div>

            {/* Departure Date */}
            <div>
              <label htmlFor="departureDate" className={inputLable}>
                Departure Date <span className="text-red-500">*</span>
              </label>
              <input
                id="departureDate"
                name="departureDate"
                type="date"
                value={formData.departureDate}
                onChange={handleChange}
                required
                className={formInput}
              />
            </div>

            {/* Issued Ticket Number */}
            <div>
              <label htmlFor="issuedTicketNumber" className={inputLable}>
                Ticket Number <span className="text-red-500">*</span>
              </label>
              <input
                id="issuedTicketNumber"
                name="issuedTicketNumber"
                type="text"
                value={formData.issuedTicketNumber}
                onChange={handleChange}
                required
                className={formInput}
              />
            </div>

            {/* Remarks - Full width */}
            <div className="lg:col-span-4">
              <label htmlFor="remarks" className={inputLable}>
                Remarks
              </label>
              <textarea
                id="remarks"
                name="remarks"
                rows={3}
                value={formData.remarks}
                onChange={handleChange}
                className={formInput}
                placeholder="Enter any additional details here..."
              />
            </div>

            {/* Buttons */}
            <div className="lg:col-span-4 flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <Button btnStyle="" btnTitle="Save" />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default TicketUpdateForm;
