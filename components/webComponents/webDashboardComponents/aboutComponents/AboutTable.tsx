"use client";
import Alert from "@/components/alertAndNotification/Alert";
import Button from "@/components/Button";
import RichTextEditor from "@/components/RichTextEditor";
import { formInput, inputLable } from "@/styles/styles";
import { Loader } from "lucide-react";
import Image from "next/image";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const AboutTable = ({ tableRefresh }) => {
  const [about, setAbout] = useState([]);
  const [updateAlertPop, setUpdateAlertPop] = useState(false);
  const [aboutId, setAboutId] = useState("");
  const [updateFormPop, setUpdateFormPop] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [globalRefereshTable, setGlobalRefereshTable] = useState(false);
  const [aboutImage, setAboutImage] = useState("");
  const [formData, setFormData] = useState({
    heading: "",
    title: "",
    paragraph: "",
    aboutImage: "",
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/abouts/get-about`,
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
            setAbout(result.getAbout);
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
    setAboutId(id);
    setUpdateAlertPop(true);
  };
  const fetchAboutById = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/abouts/get-about/${aboutId}`,
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
        setAboutImage(result.getAboutById.aboutImage);
        setFormData({
          heading: result.getAboutById.heading || "",
          title: result.getAboutById.title || "",
          paragraph: result.getAboutById.paragraph || "",
          aboutImage: result.getAboutById.aboutImage || "",
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
    await fetchAboutById();
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    const form = new FormData();
    form.append("heading", formData.heading);
    form.append("title", formData.title);
    form.append("paragraph", formData.paragraph);
    form.append("aboutImage", formData.aboutImage);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/abouts/update-about/${aboutId}`,
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
        toast.success("About details updated successfullyl.");
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
              <th className="px-4 py-3">Heading</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Paraghraph</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {about?.length > 0 ? (
              about.map((details, index) => (
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
                      src={details.aboutImage}
                      width={100}
                      height={100}
                    />
                  </td>
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
                  No About records found.
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
              setAboutId("");
            }}
            confirm={handleAlertConfirmForUpdate}
            desc="You want to update this About details?"
          />
        )}
      </div>

      {updateFormPop && (
        <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="w-full flex justify-center items-center  ">
            {isSubmitLoading ? (
              <div className="p-10 bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
                <Loader size={30} className="animate-spin" />
                <h1 className="mt-2">Updating About...</h1>
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
                  {/* Heading */}
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
                        placeholder="Main Heading"
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
                        placeholder="Business Title"
                        required
                        className={formInput}
                      />
                    </div>
                  </div>

                  {/* Paragraph */}
                  <div className="lg:col-span-4">
                    <label htmlFor="paragraph" className={inputLable}>
                      Paragraph <span className="text-red-500">*</span>
                    </label>
                    <RichTextEditor
                      value={formData.paragraph}
                      onChange={(val) =>
                        setFormData((prev) => ({ ...prev, paragraph: val }))
                      }
                    />
                  </div>

                  {/* About Image */}
                  <div className="lg:col-span-2">
                    <label htmlFor="aboutImage" className={inputLable}>
                      About Image <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="aboutImage"
                        name="aboutImage"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        required
                        className={formInput}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-2 flex items-center justify-center">
                    <Image
                      alt="logo"
                      src={aboutImage || ""}
                      width={100}
                      height={100}
                    />
                  </div>
                  {/* Buttons */}
                  <div className="lg:col-span-4 flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                    <Button btnStyle="" btnTitle="Save" />
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

export default AboutTable;
