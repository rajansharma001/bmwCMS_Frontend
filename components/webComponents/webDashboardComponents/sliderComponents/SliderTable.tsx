"use client";
import Alert from "@/components/alertAndNotification/Alert";
import Button from "@/components/Button";
import { formInput, inputLable } from "@/styles/styles";
import { Loader } from "lucide-react";
import Image from "next/image";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const SliderTable = ({ tableRefresh }) => {
  const [slider, setSlider] = useState([]);
  const [updateAlertPop, setUpdateAlertPop] = useState(false);
  const [sliderId, setSliderId] = useState("");
  const [updateFormPop, setUpdateFormPop] = useState(false);
  const [deleteAlertPop, setDeleteAlertPop] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [globalRefereshTable, setGlobalRefereshTable] = useState(false);
  const [slideImg, setSlideImg] = useState("");
  const [formData, setFormData] = useState({
    heading: "",
    title: "",
    paragraph: "",
    slideImg: "",
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/sliders/get-slider`,
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
            setSlider(result.getSlider);
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
    setSliderId(id);
    setUpdateAlertPop(true);
  };
  const fetchSliderById = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sliders/get-slider/${sliderId}`,
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
        const slider = result.getSliderById;
        setSlideImg(slider.slideImg);
        setFormData({
          heading: slider.heading || "",
          title: slider.title || "",
          paragraph: slider.paragraph || "",
          slideImg: slider.slideImg || "",
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
    await fetchSliderById();
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    const form = new FormData();
    form.append("heading", formData.heading);
    form.append("title", formData.title);
    form.append("paragraph", formData.paragraph);
    form.append("slideImg", formData.slideImg);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sliders/update-slider/${sliderId}`,
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
  const handleDeleteClick = (id: string) => {
    setSliderId(id);
    setDeleteAlertPop(true);
  };

  // --- Delete Logic ---
  const handleDelete = async () => {
    setDeleteAlertPop(false);
    setIsSubmitLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sliders/delete-slider/${sliderId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const result = await res.json();
      setGlobalRefereshTable((prev) => !prev);
      if (!res.ok) {
        setIsSubmitLoading(false);
        toast.error(result.error);
      } else {
        toast.success("Slider deleted successfully.");
        setIsSubmitLoading(false);
      }
    } catch (error) {
      toast.error(`API ERROR : ${error}`);
      setIsSubmitLoading(false);
    }
  };
  return (
    <div className="w-full">
      {/* Ticket Table */}
      <div className="w-full flex items-center justify-center">
        {isSubmitLoading && (
          <div className="p-10 w-fit bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
            <Loader size={30} className="animate-spin" />
            <h1 className="mt-2">Submitting ticket...</h1>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-black text-sm text-left min-w-[1200px]">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-3">S.No.</th>
              <th className="px-4 py-3">Heading</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Paragraph</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {slider?.length > 0 ? (
              slider.map((details, index) => (
                <tr
                  key={details._id as string}
                  className="border-b hover:bg-gray-100 transition text-white hover:text-black"
                >
                  <td className="px-4 py-3 font-medium">{index + 1}</td>

                  <td className="px-4 py-3">{details.heading}</td>
                  <td className="px-4 py-3">{details.title}</td>
                  <td className="px-4 py-3">{details.paragraph}</td>

                  <td className="px-4 py-3">
                    <Image
                      alt="logo"
                      src={details.slideImg}
                      width={100}
                      height={100}
                      className="h-[100px]"
                    />
                  </td>
                  <td className=" px-4 py-3 flex justify-center items-center gap-5 mt-5">
                    <button
                      className={` bg-primary hover:bg-gray-300 text-white h-10 flex items-center justify-center rounded-sm py-4 px-7 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm`}
                      onClick={() => handleEditClick(details._id)}
                    >
                      Edit
                    </button>
                    <button
                      className={` bg-secondary hover:bg-gray-300 text-white h-10 flex items-center justify-center rounded-sm py-4 px-7 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm`}
                      onClick={() => handleDeleteClick(details._id)}
                    >
                      Delete
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
              setSliderId("");
            }}
            confirm={handleAlertConfirmForUpdate}
            desc="You want to update this Slider?"
          />
        )}
        {deleteAlertPop && (
          <Alert
            cancel={() => {
              setDeleteAlertPop(false);
              setSliderId("");
            }}
            confirm={handleDelete}
            desc="You want to delete this Ticket booking?"
          />
        )}
      </div>

      {updateFormPop && (
        <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="w-full flex justify-center items-center  ">
            {isSubmitLoading ? (
              <div className="p-10 bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
                <Loader size={30} className="animate-spin" />
                <h1 className="mt-2">Submitting ticket...</h1>
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
                    Update Slider
                  </h2>
                  <Button
                    btnStyle="bg-red-500 hover:bg-red-600 text-white rounded-md"
                    btnTitle="Close"
                    clickEvent={() => setUpdateFormPop(false)}
                  />
                </div>
                {/* GRID START — 4 columns for dense input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* heading */}
                  <div className="lg:col-span-2">
                    <label htmlFor="heading" className={inputLable}>
                      Heading <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="heading"
                        name="heading"
                        type="text"
                        value={formData.heading}
                        onChange={handleChange}
                        placeholder="Slider heading"
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
                        placeholder="Slider title"
                        required
                        className={formInput}
                      />
                    </div>
                  </div>
                  {/* Paragraph */}
                  <div className="lg:col-span-2">
                    <label htmlFor="paragraph" className={inputLable}>
                      Paragraph <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="paragraph"
                        name="paragraph"
                        value={formData.paragraph}
                        onChange={handleChange}
                        placeholder="Slide description..."
                        required
                        className={formInput}
                      />
                    </div>
                  </div>

                  {/* Slide image */}
                  <div className="lg:col-span-2">
                    <label htmlFor="slideImg" className={inputLable}>
                      slideImg <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="slideImg"
                        name="slideImg"
                        type="file"
                        onChange={handleChange}
                        accept="images/*"
                        required
                        className={formInput}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-2 flex items-center justify-center">
                    <Image
                      alt="logo"
                      src={slideImg || ""}
                      width={100}
                      height={100}
                      className="h-[150px]"
                    />
                  </div>
                  {/* Buttons */}
                  <div className="  lg:col-span-2 flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
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

export default SliderTable;
