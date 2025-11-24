"use client";

import React, { useEffect, useState, FormEvent } from "react";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";
import Alert from "@/components/alertAndNotification/Alert";
import Button from "@/components/Button";
import RichTextEditor from "@/components/RichTextEditor";
import { formInput, inputLable } from "@/styles/styles";
import { Loader, XCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  _id?: string;
}

interface FAQFormData {
  heading: string;
  title: string;
  shortDescription: string;
  faqs: FAQItem[];
}

const newFAQItem: FAQItem = {
  question: "",
  answer: "",
};

const defaultFormData: FAQFormData = {
  heading: "",
  title: "",
  shortDescription: "",
  faqs: [],
};

const FaqTable = ({ tableRefresh }: { tableRefresh: boolean }) => {
  const [faqData, setFaqData] = useState([]);
  const [updateAlertPop, setUpdateAlertPop] = useState(false);
  const [updateFormPop, setUpdateFormPop] = useState(false);
  const [faqId, setFaqId] = useState("");
  const [formData, setFormData] = useState<FAQFormData>(defaultFormData);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [globalRefresh, setGlobalRefresh] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchFAQs = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/faqs/get-faq`,
          { method: "GET", credentials: "include" }
        );
        const result = await res.json();
        if (res.ok && isMounted) setFaqData(result.faqs);
        else if (isMounted) toast.error(result.error);
      } catch (error) {
        toast.error("API Error fetching FAQs!", error);
      }
    };
    fetchFAQs();
    return () => {
      isMounted = false;
    };
  }, [globalRefresh, tableRefresh]);

  // --- Edit Handlers ---
  const handleEditClick = (id: string) => {
    setFaqId(id);
    setUpdateAlertPop(true);
  };

  const fetchFAQById = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/faqs/get-faq/${faqId}`,
        { method: "GET", credentials: "include" }
      );
      const result = await res.json();
      if (!res.ok) toast.error(result.error);
      else {
        // Set existing FAQ data
        setFormData(result.faq);
      }
    } catch (error) {
      toast.error("API Error fetching single FAQ!", error);
    }
  };

  const handleAlertConfirmForUpdate = async () => {
    setUpdateAlertPop(false);
    setUpdateFormPop(true);
    await fetchFAQById();
  };

  // --- Form Field Handlers (Static Fields) ---
  const handleStaticChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (val: string) => {
    setFormData((prev) => ({ ...prev, shortDescription: val }));
  };

  // --- Dynamic FAQ Array Handlers ---
  const handleFAQChange = (
    index: number,
    field: keyof FAQItem,
    value: string
  ) => {
    setFormData((prev) => {
      const updatedFaqs = [...prev.faqs];
      updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
      return { ...prev, faqs: updatedFaqs };
    });
  };

  const addFAQ = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, newFAQItem],
    }));
  };

  const removeFAQ = (indexToRemove: number) => {
    setFormData((prev) => {
      const newFaqs = prev.faqs.filter((_, idx) => idx !== indexToRemove);
      return { ...prev, faqs: newFaqs };
    });
  };

  // --- UPDATED handleUpdate (JSON body, no files) ---
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    // Basic validation for the dynamic array
    const isValid = formData.faqs.every(
      (faq) => faq.question.trim() !== "" && faq.answer.trim() !== ""
    );

    if (!isValid) {
      setIsSubmitLoading(false);
      return toast.error("All FAQ questions and answers must be filled out.");
    }

    // Send data as JSON body (No file uploads, so no FormData needed)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/faqs/update-faq/${faqId}`, // API endpoint updated
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            heading: formData.heading,
            title: formData.title,
            shortDescription: formData.shortDescription,
            faqs: formData.faqs,
          }),
        }
      );

      const result = await res.json();
      setIsSubmitLoading(false);

      if (!res.ok) toast.error(result.error);
      else {
        setGlobalRefresh((prev) => !prev);
        setUpdateFormPop(false);
        toast.success("FAQ Section updated successfully.");
      }
    } catch (error) {
      setIsSubmitLoading(false);
      toast.error("API Error!", error);
    }
  };

  // --- Render Logic ---
  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-black text-sm text-left min-w-[1200px]">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-3">S.No.</th>
              <th className="px-4 py-3">Heading</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Total FAQs</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {faqData.length > 0 ? (
              faqData.map((item, index: number) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-100 transition text-white hover:text-black"
                >
                  <td className="px-4 py-3 font-medium">{index + 1}</td>
                  <td className="px-4 py-3">{item.heading}</td>
                  <td className="px-4 py-3">{item.title}</td>
                  <td
                    className="px-4 py-3 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
                    dangerouslySetInnerHTML={{
                      __html: item.shortDescription,
                    }}
                  />
                  {/* --- Total FAQs Column --- */}
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-lg">
                      {item.faqs?.length || 0}
                    </span>
                  </td>
                  {/* ----------------------------- */}
                  <td className="px-4 py-3 text-center flex gap-2 justify-center">
                    <button
                      className="bg-primary hover:opacity-80 text-white h-10 flex items-center justify-center rounded-sm py-4 px-3 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm"
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
                  className="text-center py-6 text-gray-500 italic bg-white"
                >
                  No FAQ sections found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Alert Modal for Update --- */}
      {updateAlertPop && (
        <Alert
          cancel={() => {
            setUpdateAlertPop(false);
            setFaqId("");
          }}
          confirm={handleAlertConfirmForUpdate}
          desc="Do you want to update this FAQ section?"
        />
      )}

      {/* --- Update Form Modal --- */}
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
                className="relative space-y-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 rounded-xl shadow-sm bg-white border border-gray-200"
                onSubmit={handleUpdate}
              >
                <div className="flex justify-between items-center pb-4 border-b sticky top-0 bg-white z-10">
                  <h2 className="text-2xl font-bold text-gray-800">
                    New FAQ Section
                  </h2>
                  <Button
                    btnStyle="bg-red-500 text-white rounded-md"
                    btnTitle="Close"
                    clickEvent={() => setUpdateFormPop(false)}
                  />
                </div>

                {/* --- Static Fields --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={inputLable}>Heading *</label>
                    <input
                      name="heading"
                      value={formData.heading}
                      onChange={handleStaticChange}
                      className={`${formInput}`}
                      required
                    />
                  </div>
                  <div>
                    <label className={inputLable}>Title *</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleStaticChange}
                      className={`${formInput} `}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={inputLable}>Short Description *</label>
                  <RichTextEditor
                    value={formData.shortDescription}
                    onChange={handleDescriptionChange}
                  />
                </div>

                {/* --- Dynamic FAQ List --- */}
                <div className="space-y-6 pt-4 border-t">
                  <h3 className="text-xl font-semibold text-gray-700">
                    Frequently Asked Questions
                  </h3>

                  {formData.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-4 border rounded-lg bg-gray-50 space-y-3 relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeFAQ(idx)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
                        disabled={formData.faqs.length === 1} // Disable removal if only one item remains
                      >
                        <XCircle size={20} />
                      </button>

                      <label className={inputLable}>Question {idx + 1} *</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) =>
                          handleFAQChange(idx, "question", e.target.value)
                        }
                        className={`${formInput}`}
                        placeholder="Enter the question"
                        required
                      />

                      <label className={inputLable}>Answer {idx + 1} *</label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) =>
                          handleFAQChange(idx, "answer", e.target.value)
                        }
                        className={`${formInput} min-h-[100px]`}
                        placeholder="Enter the detailed answer"
                        required
                      />
                    </div>
                  ))}

                  <Button
                    btnTitle="Add New FAQ"
                    btnStyle="bg-green-500 text-white flex items-center justify-center space-x-2"
                    clickEvent={addFAQ}
                  />
                </div>
                {/* ----------------------------- */}

                <div className="flex justify-end pt-4 border-t">
                  <button
                    type="submit"
                    className={`bg-primary text-white py-2 px-5 rounded-md flex items-center justify-center transition-opacity ${
                      isSubmitLoading
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-primary-dark"
                    }`}
                    disabled={isSubmitLoading}
                  >
                    {isSubmitLoading && (
                      <Loader size={18} className="animate-spin mr-2" />
                    )}
                    {isSubmitLoading ? "Saving..." : "Save"}
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

export default FaqTable;
