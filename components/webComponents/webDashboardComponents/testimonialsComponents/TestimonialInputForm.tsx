"use client";

import React, { useState, FormEvent } from "react";
import Button from "@/components/Button";
import RichTextEditor from "@/components/RichTextEditor";
import { useProtectedRoute } from "@/context/useProtected";
import { formInput, inputLable } from "@/styles/styles";
import { Loader, XCircle } from "lucide-react";
import { toast } from "sonner";

// --- Testimonial Interfaces ---
interface ReviewItem {
  star: number; // Rating (1-5)
  name: string;
  post: string; // Job title/post
  brand: string; // Company/brand
  location: string;
  reviewText: string;
}

interface TestimonialFormData {
  heading: string;
  title: string;
  shortDescription: string;
  reviews: ReviewItem[];
}

const newReviewItem: ReviewItem = {
  star: 5,
  name: "",
  post: "",
  brand: "",
  location: "",
  reviewText: "",
};

const defaultFormData: TestimonialFormData = {
  heading: "",
  title: "",
  shortDescription: "",
  reviews: [newReviewItem], // Start with one empty review item
};

const TestimonialInputForm = ({
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

  // --- Handlers for Dynamic Review Array ---

  const handleReviewChange = (
    index: number,
    field: keyof ReviewItem,
    value: string | number
  ) => {
    setFormData((prev) => {
      const updatedReviews = [...prev.reviews];
      // Type casting is necessary here because field is keyof ReviewItem
      updatedReviews[index] = { ...updatedReviews[index], [field]: value };
      return { ...prev, reviews: updatedReviews };
    });
  };

  const addReview = () => {
    setFormData((prev) => ({
      ...prev,
      reviews: [...prev.reviews, newReviewItem],
    }));
  };

  const removeReview = (indexToRemove: number) => {
    setFormData((prev) => {
      const newReviews = prev.reviews.filter((_, idx) => idx !== indexToRemove);
      return { ...prev, reviews: newReviews };
    });
  };

  // --- Submission Logic ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Basic validation for the dynamic array
    const isValid = formData.reviews.every(
      (review) =>
        review.name.trim() !== "" &&
        review.reviewText.trim() !== "" &&
        review.star >= 1 &&
        review.star <= 5
    );

    if (!isValid) {
      return toast.error(
        "All review fields, including a valid 1-5 star rating, must be filled out."
      );
    }

    setIsSubmitLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/new-testimonial`,
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

      toast.success("Testimonial Section added successfully!");
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
          className="relative space-y-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 rounded-xl shadow-sm bg-white border border-gray-200"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-between items-center pb-4 border-b sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-bold text-gray-800">
              New Testimonial Section
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

          {/* --- Dynamic Review List --- */}
          <div className="space-y-6 pt-4 border-t">
            <h3 className="text-xl font-semibold text-gray-700">
              Testimonials/Reviews
            </h3>

            {formData.reviews.map((review, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-lg bg-indigo-50 space-y-3 relative shadow-md"
              >
                <h4 className="font-bold text-indigo-700">Review #{idx + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeReview(idx)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
                  disabled={formData.reviews.length === 1} // Disable removal if only one item remains
                >
                  <XCircle size={20} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className={inputLable}>Reviewer Name *</label>
                    <input
                      type="text"
                      value={review.name}
                      onChange={(e) =>
                        handleReviewChange(idx, "name", e.target.value)
                      }
                      className={`${formInput}`}
                      required
                    />
                  </div>
                  {/* Post */}
                  <div>
                    <label className={inputLable}>Reviewer Post/Title *</label>
                    <input
                      type="text"
                      value={review.post}
                      onChange={(e) =>
                        handleReviewChange(idx, "post", e.target.value)
                      }
                      className={`${formInput}`}
                      required
                    />
                  </div>
                  {/* Brand */}
                  <div>
                    <label className={inputLable}>Brand/Company *</label>
                    <input
                      type="text"
                      value={review.brand}
                      onChange={(e) =>
                        handleReviewChange(idx, "brand", e.target.value)
                      }
                      className={`${formInput}`}
                      required
                    />
                  </div>
                  {/* Location */}
                  <div>
                    <label className={inputLable}>Location (Optional)</label>
                    <input
                      type="text"
                      value={review.location}
                      onChange={(e) =>
                        handleReviewChange(idx, "location", e.target.value)
                      }
                      className={`${formInput}`}
                    />
                  </div>
                  {/* Star Rating */}
                  <div>
                    <label className={inputLable}>Star Rating (1-5) *</label>
                    <input
                      type="number"
                      value={review.star}
                      onChange={(e) =>
                        handleReviewChange(
                          idx,
                          "star",
                          parseInt(e.target.value, 10)
                        )
                      }
                      className={`${formInput}`}
                      min="1"
                      max="5"
                      required
                    />
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className={inputLable}>Review Text *</label>
                  <textarea
                    value={review.reviewText}
                    onChange={(e) =>
                      handleReviewChange(idx, "reviewText", e.target.value)
                    }
                    className={`${formInput} min-h-[100px]`}
                    required
                  />
                </div>
              </div>
            ))}

            <Button
              btnTitle="Add New Review"
              btnStyle="bg-green-500 text-white flex items-center justify-center space-x-2"
              clickEvent={addReview}
            />
          </div>
          {/* ----------------------------- */}

          <div className="flex justify-end pt-4 border-t sticky bottom-0 bg-white z-10">
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

export default TestimonialInputForm;
