"use client";
import Alert from "@/components/alertAndNotification/Alert";
import Button from "@/components/Button";
import { formInput, inputLable } from "@/styles/styles";
import { Loader } from "lucide-react";
import Image from "next/image";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const BrandTable = () => {
  const [brand, setBrand] = useState([]);
  const [updateAlertPop, setUpdateAlertPop] = useState(false);
  const [brandId, setBrandId] = useState("");
  const [updateFormPop, setUpdateFormPop] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [globalRefereshTable, setGlobalRefereshTable] = useState(false);
  const [brandLogo, setBrandLogo] = useState("");
  const [formData, setFormData] = useState({
    logo: "",
    title: "",
    subTitle: "",
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/brand/get-brand`,
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
            setBrand(result.getBrand);
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
  }, [globalRefereshTable]);

  const handleEditClick = (id: string) => {
    setBrandId(id);
    setUpdateAlertPop(true);
  };
  const fetchBrandById = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/brand/get-brand/${brandId}`,
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
        const brand = result.getBrandById;
        setBrandLogo(brand.logo);
        setFormData({
          title: brand.title || "",
          subTitle: brand.subTitle || "",
          logo: brand.logo || "",
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
    await fetchBrandById();
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    const form = new FormData();
    form.append("title", formData.title);
    form.append("subTitle", formData.subTitle);
    form.append("logo", formData.logo);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/brand/update-brand/${brandId}`,
        {
          method: "PATCH",
          credentials: "include",
          body: form,
        }
      );

      const result = await res.json();
      setIsSubmitLoading(false);

      if (!res.ok) {
        toast.error(result.error);
      } else {
        setGlobalRefereshTable((prev) => !prev);
        setUpdateFormPop(false);
        toast.success("Brand updated successfullyl.");
      }
    } catch (error) {
      setIsSubmitLoading(false);
      toast.error("API Error!", error);
    }
  };

  console.log("fetched brands: ", brand);
  return (
    <div className="w-full">
      {/* Ticket Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-black text-sm text-left min-w-[1200px]">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-3">S.No.</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Sub Title</th>
              <th className="px-4 py-3">Logo</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {brand?.length > 0 ? (
              brand.map((details, index) => (
                <tr
                  key={details._id as string}
                  className="border-b hover:bg-gray-100 transition text-white hover:text-black"
                >
                  <td className="px-4 py-3 font-medium">{index + 1}</td>

                  <td className="px-4 py-3">{details.title}</td>
                  <td className="px-4 py-3">{details.subTitle}</td>
                  <td className="px-4 py-3">
                    <Image
                      alt="logo"
                      src={details.logo}
                      width={100}
                      height={100}
                    />
                  </td>
                  <td className="px-4 py-3 flex justify-center items-center mt-5">
                    <button
                      disabled={details.paymentStatus === "paid"}
                      className={` ${
                        details.paymentStatus === "paid"
                          ? "bg-gray-300 hover:text-white"
                          : "bg-primary hover:bg-gray-300"
                      } text-white h-10 flex items-center justify-center rounded-sm py-4 px-7 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm`}
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
                  No ticket booking records found.
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
              setBrandId("");
            }}
            confirm={handleAlertConfirmForUpdate}
            desc="You want to update this Ticket booking?"
          />
        )}
      </div>

      {updateFormPop && (
        <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="w-full flex justify-center items-center  ">
            {isSubmitLoading ? (
              <div className="p-10 bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
                <Loader size={30} className="animate-spin" />
                <h1 className="mt-2">Submitting Brand...</h1>
              </div>
            ) : (
              <form
                className="relative space-y-6 w-full max-w-4xl p-8 -mt-20 rounded-xl shadow-sm bg-white border border-gray-200 "
                onSubmit={handleUpdate}
                method="POST"
                encType="multipart/form-data"
              >
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800">
                    New Brand
                  </h2>
                  <Button
                    btnStyle="bg-red-500 hover:bg-red-600 text-white rounded-md"
                    btnTitle="Close"
                    clickEvent={() => setUpdateFormPop(false)}
                  />
                </div>
                {/* GRID START — 4 columns for dense input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        placeholder="Business Name"
                        required
                        className={formInput}
                      />
                    </div>
                  </div>
                  {/* SubTitle */}
                  <div className="lg:col-span-2">
                    <label htmlFor="subTitle" className={inputLable}>
                      SubsubTitle <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="subTitle"
                        name="subTitle"
                        type="text"
                        value={formData.subTitle}
                        onChange={handleChange}
                        placeholder="Sub title"
                        className={formInput}
                      />
                    </div>
                  </div>

                  {/* logo */}
                  <div className="lg:col-span-2">
                    <label htmlFor="logo" className={inputLable}>
                      logo <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="logo"
                        name="logo"
                        type="file"
                        onChange={handleChange}
                        accept=".png"
                        className={formInput}
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-2 flex items-center justify-center">
                    {brandLogo && (
                      <Image
                        alt="logo"
                        src={brandLogo || ""}
                        width={100}
                        height={100}
                      />
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="  lg:col-span-4 flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                    <Button btnStyle="" btnTitle="Update" />
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default BrandTable;
