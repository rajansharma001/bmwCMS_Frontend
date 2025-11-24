"use client";

import React, { useEffect, useState, FormEvent } from "react";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";
import Alert from "@/components/alertAndNotification/Alert";
import Button from "@/components/Button";
import RichTextEditor from "@/components/RichTextEditor";
import { formInput, inputLable } from "@/styles/styles";
import { Loader } from "lucide-react";

const defaultFormData = {
  heading: "",
  title: "",
  shortDescription: "",
  image: "",
  items: [
    {
      icon: "",
      title: "",
      paragraph: "",
    },
  ],
};

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

const WhyChooseUsTable = ({ tableRefresh }) => {
  const [itemsData, setItemsData] = useState([]);
  const [updateAlertPop, setUpdateAlertPop] = useState(false);
  const [updateFormPop, setUpdateFormPop] = useState(false);
  const [itemId, setItemId] = useState("");
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [globalRefresh, setGlobalRefresh] = useState(false);

  // Fetch all WhyChooseUs items
  useEffect(() => {
    let isMounted = true;
    const fetchItems = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/whychooseus/get-whychooseus`,
          { method: "GET", credentials: "include" }
        );
        const result = await res.json();
        if (res.ok && isMounted) setItemsData(result.getWhyChooseUs);
        else if (isMounted) toast.error(result.error);
      } catch (error) {
        toast.error("API Error!", error);
      }
    };
    fetchItems();
    return () => {
      isMounted = false;
    };
  }, [globalRefresh, tableRefresh]);

  const handleEditClick = (id: string) => {
    setItemId(id);
    setUpdateAlertPop(true);
  };

  const fetchItemById = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/whychooseus/get-whychooseus/${itemId}`,
        { method: "GET", credentials: "include" }
      );
      const result = await res.json();
      if (!res.ok) toast.error(result.error);
      else setFormData(result.getWhyChooseUsById);
    } catch (error) {
      toast.error("API Error!", error);
    }
  };

  const handleAlertConfirmForUpdate = async () => {
    setUpdateAlertPop(false);
    setUpdateFormPop(true);
    await fetchItemById();
  };

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
      items: [...prev.items, { icon: "", title: "", paragraph: "" }],
    }));
  };

  const removeItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/whychooseus/update-whychooseus/${itemId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      const result = await res.json();
      setIsSubmitLoading(false);
      if (!res.ok) toast.error(result.error);
      else {
        setGlobalRefresh((prev) => !prev);
        setUpdateFormPop(false);
        toast.success("Updated successfully.");
      }
    } catch (error) {
      setIsSubmitLoading(false);
      toast.error("API Error!", error);
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-black text-sm text-left min-w-[1200px]">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-3">S.No.</th>
              <th className="px-4 py-3">Heading</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Short Description</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {itemsData.length > 0 ? (
              itemsData.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-100 transition text-white hover:text-black"
                >
                  <td className="px-4 py-3 font-medium">{index + 1}</td>
                  <td className="px-4 py-3">{item.heading}</td>
                  <td className="px-4 py-3">{item.title}</td>
                  <td className="px-4 py-3">{item.shortDescription}</td>
                  <td className="px-4 py-3 flex  gap-2">
                    {item.items?.map((i, idx) => {
                      const IconComp = LucideIcons[i.icon];
                      return IconComp ? <IconComp key={idx} size={20} /> : null;
                    })}
                  </td>
                  <td className="px-4 py-3 ">
                    <button
                      className="bg-primary hover:bg-gray-300 text-white h-10 flex items-center justify-center rounded-sm py-4 px-7 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm"
                      onClick={() => handleEditClick(item._id)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-500 italic"
                >
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {updateAlertPop && (
        <Alert
          cancel={() => {
            setUpdateAlertPop(false);
            setItemId("");
          }}
          confirm={handleAlertConfirmForUpdate}
          desc="Do you want to update this item?"
        />
      )}

      {updateFormPop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="w-full flex justify-center items-center">
            {isSubmitLoading ? (
              <div className="p-10 bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
                <Loader size={30} className="animate-spin" />
                <h1 className="mt-2">Updating...</h1>
              </div>
            ) : (
              <form
                className="relative space-y-6 w-full max-w-5xl p-8 -mt-20 rounded-xl shadow-sm bg-white border border-gray-200 overflow-scroll h-screen"
                onSubmit={handleUpdate}
              >
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Edit WhyChooseUs Item
                  </h2>
                  <Button
                    btnStyle="bg-red-500 hover:bg-red-600 text-white rounded-md"
                    btnTitle="Close"
                    clickEvent={() => setUpdateFormPop(false)}
                  />
                </div>

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
                      placeholder="Title"
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
                  <div className="lg:col-span-4">
                    <label htmlFor="image" className={inputLable}>
                      Image URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="Image URL"
                      required
                      className={formInput}
                    />
                  </div>
                </div>

                {/* Dynamic Items */}
                <div className="space-y-6">
                  {formData.items.map((item, index) => (
                    <div key={index} className="border p-4 rounded space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg">Item {index + 1}</h3>
                        {formData.items.length > 1 && (
                          <Button
                            btnStyle="bg-red-500 text-white rounded-md px-2"
                            btnTitle="Remove"
                            clickEvent={() => removeItem(index)}
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        <div className="lg:col-span-4">
                          <label className={inputLable}>Paragraph</label>
                          <RichTextEditor
                            value={item.paragraph}
                            onChange={(val) =>
                              handleParagraphChange(val, index)
                            }
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
                    className="text-white h-10 flex items-center justify-center rounded-sm py-4 px-7 bg-primary hover:bg-gray-500 hover:text-gray-300 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm"
                  >
                    Add Item
                  </button>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    className="text-white h-10 flex items-center justify-center rounded-sm py-4 px-7 bg-primary hover:bg-gray-500 hover:text-gray-300 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm"
                  >
                    Update
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WhyChooseUsTable;
