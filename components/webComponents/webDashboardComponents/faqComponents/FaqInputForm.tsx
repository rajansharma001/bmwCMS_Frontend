"use client";

import React, { useState, FormEvent } from "react";
import Button from "@/components/Button";
import RichTextEditor from "@/components/RichTextEditor";
import { useProtectedRoute } from "@/context/useProtected";
import { formInput, inputLable } from "@/styles/styles";
import { Loader, XCircle } from "lucide-react"; // Added Plus icon
import { toast } from "sonner";

// --- FAQ Interfaces ---
interface FAQItem {
  question: string;
  answer: string;
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
  faqs: [newFAQItem], // Start with one empty FAQ item
};

const FaqInputForm = ({
  formClose,
  onSubmitSuccess,
}: {
  formClose: () => void;
  onSubmitSuccess: () => void;
}) => {
  useProtectedRoute();
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // --- Handlers for Static Fields (Heading, Title) ---
  const handleStaticChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (val: string) => {
    setFormData((prev) => ({ ...prev, shortDescription: val }));
  };

  // --- Handlers for Dynamic FAQ Array ---

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

  // --- Submission Logic ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Basic validation for the dynamic array
    const isValid = formData.faqs.every(
      (faq) => faq.question.trim() !== "" && faq.answer.trim() !== ""
    );

    if (!isValid) {
      return toast.error("All FAQ questions and answers must be filled out.");
    }

    setIsSubmitLoading(true);

    // Send data as JSON body (No file uploads, so no FormData needed)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/faqs/new-faq`, // API endpoint updated
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await res.json();
      setIsSubmitLoading(false);

      if (!res.ok) return toast.error(result.error);

      toast.success("FAQ Section added successfully!");
      onSubmitSuccess();
      formClose();
    } catch (err) {
      setIsSubmitLoading(false);
      toast.error("An API error occurred.");
      console.error(err);
    }
  };

  // --- Render ---
  return (
    <div className="w-full flex justify-center items-center">
      {isSubmitLoading ? (
        <div className="p-10 bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
          <Loader size={30} className="animate-spin" />
          <h1 className="mt-2">Submitting...</h1>
        </div>
      ) : (
        <form
          className="relative space-y-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 rounded-xl shadow-sm bg-white border border-gray-200"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-between items-center pb-4 border-b sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-bold text-gray-800">
              New FAQ Section
            </h2>
            <Button
              btnStyle="bg-red-500 text-white rounded-md"
              btnTitle="Close"
              clickEvent={formClose}
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
  );
};

export default FaqInputForm;
