"use client";

import React, { useState, FormEvent } from "react";
import Button from "@/components/Button";
import RichTextEditor from "@/components/RichTextEditor";
import { useProtectedRoute } from "@/context/useProtected";
import { formInput, inputLable } from "@/styles/styles";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";

// icon list
const availableIcons = [
  "Home",
  "User",
  "Users",
  "Settings",
  "Mail",
  "Phone",
  "MapPin",
  "CreditCard",
  "FileText",
  "Folder",
  "Calendar",
  "Bell",
  "ShoppingCart",
  "Clipboard",
  "PieChart",
  "BarChart",
  "CheckCircle",
  "XCircle",
  "Globe",
  "Link",
  "MessageSquare",
  "Camera",
  "Star",
  "Shield",
];

const defaultFormData = {
  heading: "",
  title: "",
  shortDescription: "",
  image: "",
  items: [{ icon: "", title: "", paragraph: "" }],
};

const WhyChooseUsInputForm = ({ formClose, onSubmitSuccess }) => {
  useProtectedRoute();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    index?: number
  ) => {
    const { name, value, type } = e.target;

    if (index !== undefined) {
      const newItems = [...formData.items];
      newItems[index] = { ...newItems[index], [name]: value };
      setFormData((prev) => ({ ...prev, items: newItems }));
    } else if (type === "file") {
      const target = e.target as HTMLInputElement; // <-- type assertion
      if (target.files && target.files.length > 0) {
        setFormData((prev) => ({ ...prev, [name]: target.files[0] }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleParagraphChange = (val: string, index?: number) => {
    if (index !== undefined) {
      const newItems = [...formData.items];
      newItems[index].paragraph = val;
      setFormData((prev) => ({ ...prev, items: newItems }));
    } else {
      setFormData((prev) => ({ ...prev, shortDescription: val }));
    }
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { icon: "", title: "", paragraph: "", link: "" }],
    }));
  };

  const removeItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    const form = new FormData();
    form.append("heading", formData.heading);
    form.append("title", formData.title);
    form.append("shortDescription", formData.shortDescription);
    form.append("image", formData.image);
    form.append("items", JSON.stringify(formData.items));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/whychooseus/new-whychooseus`,
        {
          method: "POST",
          credentials: "include",
          body: form,
        }
      );

      const result = await res.json();
      setIsSubmitLoading(false);

      if (!res.ok) return toast.error(result.error);

      toast.success("Why Choose Us section added!");
      onSubmitSuccess();
      formClose();
    } catch (err) {
      setIsSubmitLoading(false);
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-screen ">
      {isSubmitLoading ? (
        <div className="p-10 bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
          <Loader size={30} className="animate-spin" />
          <h1 className="mt-2">Submitting Service...</h1>
        </div>
      ) : (
        <form
          className="relative space-y-6 w-full max-w-5xl p-8 -mt-20 rounded-xl shadow-sm bg-white border border-gray-200  overflow-scroll h-screen "
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b">
            <h2 className="text-2xl font-bold">New Why Choose Us Section</h2>
            <Button
              btnStyle="bg-red-500 text-white rounded-md"
              btnTitle="Close"
              clickEvent={formClose}
            />
          </div>

          {/* Heading + Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={inputLable}>Heading *</label>
              <input
                name="heading"
                value={formData.heading}
                onChange={handleChange}
                className={formInput}
                required
              />
            </div>

            <div>
              <label className={inputLable}>Title *</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={formInput}
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className={inputLable}>Image *</label>
            <input
              id="image"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
              className={formInput}
            />
          </div>

          {/* Short Description */}
          <div>
            <label className={inputLable}>Short Description *</label>
            <RichTextEditor
              value={formData.shortDescription}
              onChange={(val) => handleParagraphChange(val)}
            />
          </div>

          {/* Items */}
          <div className="space-y-6">
            {formData.items.map((item, index) => (
              <div key={index} className="border p-4 rounded-md">
                <div className="flex justify-between">
                  <h3 className="font-bold">Item {index + 1}</h3>
                  {formData.items.length > 1 && (
                    <Button
                      btnStyle="bg-red-500 text-white rounded-md"
                      btnTitle="Remove"
                      clickEvent={() => removeItem(index)}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-3">
                  {/* Icon Dropdown */}
                  <div>
                    <label className={inputLable}>Icon *</label>
                    <select
                      name="icon"
                      value={item.icon}
                      onChange={(e) => handleChange(e, index)}
                      className={formInput}
                    >
                      <option value="">Select Icon</option>
                      {availableIcons.map((ic) => (
                        <option key={ic} value={ic}>
                          {ic}
                        </option>
                      ))}
                    </select>

                    <div className="mt-2 text-2xl">
                      {item.icon && LucideIcons[item.icon]
                        ? React.createElement(LucideIcons[item.icon])
                        : null}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className={inputLable}>Title *</label>
                    <input
                      name="title"
                      value={item.title}
                      onChange={(e) => handleChange(e, index)}
                      className={formInput}
                      required
                    />
                  </div>

                  {/* Paragraph */}
                  <div className="sm:col-span-2">
                    <label className={inputLable}>Paragraph *</label>
                    <RichTextEditor
                      value={item.paragraph}
                      onChange={(val) => handleParagraphChange(val, index)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Item Button */}
          <button
            type="button"
            onClick={addItem}
            className="bg-primary text-white py-2 px-5 rounded-md"
          >
            Add Item
          </button>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              className="bg-primary text-white py-2 px-5 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default WhyChooseUsInputForm;
