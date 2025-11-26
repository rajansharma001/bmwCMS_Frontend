"use client";

import Button from "@/components/Button";
import RichTextEditor from "@/components/RichTextEditor";
import { useProtectedRoute } from "@/context/useProtected";
import { formInput, inputLable } from "@/styles/styles";
import { Loader } from "lucide-react";
import React, { FormEvent, useState } from "react";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";

// Predefined list of icons for selection
const availableIcons = [
  "Home", // Homepage
  "User", // User profile
  "Users", // Team or clients
  "Settings", // Settings / configuration
  "Mail", // Email / contact
  "Phone", // Phone contact
  "MapPin", // Location / address
  "CreditCard", // Payments / invoices
  "FileText", // Documents / content
  "Folder", // Files / categories
  "Calendar", // Events / scheduling
  "Bell", // Notifications / alerts
  "ShoppingCart", // E-commerce / orders
  "Clipboard", // Tasks / management
  "PieChart", // Analytics / reports
  "BarChart", // Analytics / reports
  "CheckCircle", // Success / completed
  "XCircle", // Error / failed
  "Globe", // Global / website
  "Link", // Links / resources
  "MessageSquare", // Chat / messages
  "Camera", // Media / gallery
  "Star", // Featured / favorite
  "Shield", // Security / privacy
  "Car",
  "Plane",
];
const defaultFormData = {
  heading: "",
  title: "",
  shortDescription: "",
  items: [
    {
      icon: "",
      title: "",
      paragraph: "",
      link: "",
    },
  ],
};

const ServicesInputForm = ({ formClose, onSubmitSuccess }) => {
  useProtectedRoute();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    index?: number
  ) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      const newItems = [...formData.items];
      newItems[index] = { ...newItems[index], [name]: value };
      setFormData((prev) => ({ ...prev, items: newItems }));
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

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services/new-service`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await res.json();
      setIsSubmitLoading(false);

      if (!res.ok) {
        toast.error(result.error);
      } else {
        formClose();
        onSubmitSuccess();
        toast.success("Service section added successfully.");
      }
    } catch (error) {
      setIsSubmitLoading(false);
      toast.error("API Error!");
      console.error(error);
    }
  };

  return (
    <div className="w-full flex justify-center items-center py-20 ">
      {isSubmitLoading ? (
        <div className="p-10 bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
          <Loader size={30} className="animate-spin" />
          <h1 className="mt-2">Submitting Service...</h1>
        </div>
      ) : (
        <form
          className="relative space-y-6 w-full max-w-5xl p-8 -mt-20 rounded-xl shadow-sm bg-white border border-gray-200  overflow-scroll h-screen "
          onSubmit={handleSubmit}
        >
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">
              Edit Service Section
            </h2>
            <Button
              btnStyle="bg-red-500 hover:bg-red-600 text-white rounded-md"
              btnTitle="Close"
              clickEvent={formClose}
            />
          </div>

          {/* Main Section Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <label htmlFor="heading" className={inputLable}>
                Heading <span className="text-red-500">*</span>
              </label>
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
            <div className="lg:col-span-2">
              <label htmlFor="title" className={inputLable}>
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Service Title"
                required
                className={formInput}
              />
            </div>
            <div className="lg:col-span-4">
              <label htmlFor="shortDescription" className={inputLable}>
                Short Description <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.shortDescription}
                onChange={(val) => handleParagraphChange(val)}
              />
            </div>
          </div>

          {/* Dynamic Service Items */}
          <div className="space-y-6">
            {formData.items.map((item, index) => (
              <div key={index} className="border p-4 rounded space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">
                    Service Item {index + 1}
                  </h3>
                  {formData.items.length > 1 && (
                    <Button
                      btnStyle="bg-red-500 text-white rounded-md px-2"
                      btnTitle="Remove"
                      clickEvent={() => removeItem(index)}
                    />
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Icon Selector */}
                  <div className="lg:col-span-1">
                    <label className={inputLable}>Icon</label>
                    <select
                      name="icon"
                      value={item.icon}
                      onChange={(e) => handleChange(e, index)}
                      className={formInput}
                    >
                      <option value="">Select Icon</option>
                      {availableIcons.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2 text-2xl">
                      {item.icon && LucideIcons[item.icon]
                        ? React.createElement(LucideIcons[item.icon])
                        : null}
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <label className={inputLable}>Title</label>
                    <input
                      type="text"
                      name="title"
                      value={item.title}
                      onChange={(e) => handleChange(e, index)}
                      placeholder="Item Title"
                      className={formInput}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className={inputLable}>Link</label>
                    <input
                      type="text"
                      name="link"
                      value={item.link}
                      onChange={(e) => handleChange(e, index)}
                      placeholder="/services/..."
                      className={formInput}
                    />
                  </div>
                  <div className="lg:col-span-4">
                    <label className={inputLable}>Paragraph</label>
                    <RichTextEditor
                      value={item.paragraph}
                      onChange={(val) => handleParagraphChange(val, index)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={addItem}
              className={`text-white h-10 flex items-center justify-center rounded-sm py-4 px-7 bg-primary hover:bg-gray-500 hover:text-gray-300 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm`}
            >
              Add Item
            </button>
          </div>

          {/* Form Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <button
              type="submit"
              className={`text-white h-10 flex items-center justify-center rounded-sm py-4 px-7 bg-primary hover:bg-gray-500 hover:text-gray-300 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm`}
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ServicesInputForm;
