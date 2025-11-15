"use client";
import { formInput, inputHelp, inputLable } from "@/styles/styles";
import Button from "../Button";
import { FormEvent, useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { clientType } from "@/types/clientTypes";

const ClientInputForm = ({ formClose, onSubmitSuccess }) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<clientType>({
    clientName: "",
    companyName: "",
    email: "",
    phone: "",
    mobile: "",
    address: "",
  });

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clients/new-client`,
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
        setSuccess(false);
        setMessage(result.error);
      } else {
        onSubmitSuccess();
        setFormData({
          clientName: "",
          companyName: "",
          email: "",
          phone: "",
          mobile: "",
          address: "",
        });
        setSuccess(true);
        setMessage("Client added successfully.");
      }
    } catch (error) {
      setSuccess(false);
      setMessage(`API ERROR. : ${error}`);
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

  useEffect(() => {
    if (message !== "") {
      const timer = setTimeout(() => {
        setMessage("");
        formClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, formClose]);

  return (
    <div className="w-full flex justify-center items-center">
      {isSubmitLoading ? (
        <div className="w-full flex flex-col items-center justify-center">
          <Loader size={30} className="animate-spin" />
          <h1>Loading</h1>
        </div>
      ) : (
        <form
          className="relative space-y-6 w-[70%]  p-15 rounded-sm bg-white"
          onSubmit={handleSubmit}
          method="POST"
        >
          {/* notification alert */}
          {message !== "" && (
            <div
              className={` w-full p-5 rounded-md ${
                success ? "bg-green-200 text-white" : "bg-red-200 text-white"
              }`}
            >
              <h1
                className={`${success ? "text-green-700 " : "text-red-700 "}`}
              >
                {message}
              </h1>
            </div>
          )}
          <div className="absolute top-2 right-2 ">
            <Button btnStyle="" btnTitle="Close" clickEvent={formClose} />
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
                placeholder="e.g. John Doe"
                aria-describedby="clientName_help"
              />
              <p id="clientName_help" className={`${inputHelp}`}>
                Enter the full name of the client.
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
                placeholder="e.g. ABC Pvt. Ltd."
              />
              <p id="companyName_help" className={`${inputHelp}`}>
                Enter the company name associated with the client.
              </p>
            </div>

            <div>
              <label htmlFor="email" className={`${inputLable}`}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`${formInput}`}
                placeholder="e.g. john@example.com"
              />
              <p id="email_help" className={`${inputHelp}`}>
                Enter a valid email address.
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
                placeholder="e.g. 01-5555555"
              />
              <p id="phone_help" className={`${inputHelp}`}>
                Enter landline or office phone number.
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
                placeholder="e.g. 9800000000"
              />
              <p id="mobile_help" className={`${inputHelp}`}>
                Enter the client`s mobile number.
              </p>
            </div>

            <div>
              <label htmlFor="address" className={`${inputLable}`}>
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className={`${formInput}`}
                placeholder="e.g. Kathmandu, Nepal"
                aria-describedby="address_help"
              ></textarea>
              <p id="address_help" className={`${inputHelp}`}>
                Enter the full address.
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="w-[49%]"></div>
            <div className="w-[50%] flex items-center justify-around gap-3">
              <Button
                btnStyle="text-white rounded-sm w-full h-10 flex justify-center items-center"
                btnTitle="Save"
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
  );
};

export default ClientInputForm;
