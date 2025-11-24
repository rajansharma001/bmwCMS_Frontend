"use client";
import Button from "@/components/Button";
import { formInput, inputLable } from "@/styles/styles";
import { Loader } from "lucide-react";
import React, { FormEvent, useState } from "react";
import { toast } from "sonner";

const defaultFormData = {
  heading: "",
  title: "",
  paragraph: "",
  slideImg: "",
};
const SliderInputForm = ({ formClose, onSubmitSuccess }) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [formData, setFormData] = useState(defaultFormData);

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

  const handleReset = () => {
    setFormData(defaultFormData);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    const form = new FormData();
    form.append("heading", formData.heading);
    form.append("title", formData.title);
    form.append("paragraph", formData.paragraph);
    form.append("slideImg", formData.slideImg);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sliders/new-slider`,
        {
          method: "POST",
          credentials: "include",
          body: form,
        }
      );

      const result = await res.json();
      setIsSubmitLoading(false);

      if (!res.ok) {
        toast.error(result.error);
      } else {
        formClose();
        onSubmitSuccess();
        toast.success("Slider added successfullyl.");
      }
    } catch (error) {
      setIsSubmitLoading(false);
      toast.error("API Error!", error);
    }
  };

  return (
    <div className="w-full flex justify-center items-center  ">
      {isSubmitLoading ? (
        <div className="p-10 bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
          <Loader size={30} className="animate-spin" />
          <h1 className="mt-2">Submitting ticket...</h1>
        </div>
      ) : (
        <form
          className="relative space-y-6 w-full max-w-4xl p-8 -mt-20 rounded-xl shadow-sm bg-white border border-gray-200 "
          onSubmit={handleSubmit}
          method="POST"
          encType="multipart/form-data"
        >
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">New Brand</h2>
            <Button
              btnStyle="bg-red-500 hover:bg-red-600 text-white rounded-md"
              btnTitle="Close"
              clickEvent={formClose}
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

            {/* Buttons */}
            <div className="  lg:col-span-4 flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
              <Button btnStyle="" btnTitle="Save" />
              <Button
                clickEvent={handleReset}
                btnStyle="bg-red-500 hover:bg-gray-400 text-gray-800 rounded-md h-10"
                btnTitle="Reset"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default SliderInputForm;
