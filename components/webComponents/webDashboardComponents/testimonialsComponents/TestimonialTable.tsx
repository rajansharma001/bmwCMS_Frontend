"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { toast } from "sonner";
import Alert from "@/components/alertAndNotification/Alert";
import Button from "@/components/Button";
import RichTextEditor from "@/components/RichTextEditor";
import { formInput, inputLable } from "@/styles/styles";
import { Loader, XCircle } from "lucide-react";

// --- Testimonial Interfaces (Adapted from your model) ---
interface ReviewItem {
  star: number;
  name: string;
  post: string;
  brand: string;
  location: string;
  reviewText: string;
  _id?: string; // Add _id for reviews that are already saved
}

interface TestimonialFormData {
  heading: string;
  title: string;
  shortDescription: string;
  reviews: ReviewItem[];
  _id?: string; // Add _id for the main document
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
  reviews: [],
};

const TestimonialTable = ({ tableRefresh }: { tableRefresh: boolean }) => {
  const [testimonialData, setTestimonialData] = useState<TestimonialFormData[]>(
    []
  );
  const [updateAlertPop, setUpdateAlertPop] = useState(false);
  const [updateFormPop, setUpdateFormPop] = useState(false);
  const [testimonialId, setTestimonialId] = useState("");
  const [formData, setFormData] =
    useState<TestimonialFormData>(defaultFormData);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [globalRefresh, setGlobalRefresh] = useState(false);

  // --- Fetch Testimonials ---
  useEffect(() => {
    let isMounted = true;
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/get-testimonial`, // API Endpoint Change
          { method: "GET", credentials: "include" }
        );
        const result = await res.json();
        if (res.ok && isMounted) setTestimonialData(result.testimonials);
        else if (isMounted) toast.error(result.error);
      } catch (error) {
        toast.error("API Error fetching Testimonials!");
      }
    };
    fetchTestimonials();
    return () => {
      isMounted = false;
    };
  }, [globalRefresh, tableRefresh]);

  // --- Edit Handlers ---
  const handleEditClick = (id: string) => {
    setTestimonialId(id);
    setUpdateAlertPop(true);
  };

  const fetchTestimonialById = async () => {
    if (!testimonialId) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/get-testimonial/${testimonialId}`, // API Endpoint Change
        { method: "GET", credentials: "include" }
      );
      const result = await res.json();
      if (!res.ok) toast.error(result.error);
      else {
        // Set existing Testimonial data
        // Ensure reviews array is present, even if empty
        const dataToLoad: TestimonialFormData = {
          ...result.testimonial,
          reviews: result.testimonial.reviews || [],
        };
        setFormData(dataToLoad);
      }
    } catch (error) {
      toast.error("API Error fetching single Testimonial!");
    }
  };

  const handleAlertConfirmForUpdate = async () => {
    setUpdateAlertPop(false);
    setUpdateFormPop(true);
    // Fetch data inside useEffect trigger or directly after confirming
    await fetchTestimonialById();
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

  // --- Dynamic Review Array Handlers ---
  const handleReviewChange = (
    index: number,
    field: keyof ReviewItem,
    value: string | number
  ) => {
    setFormData((prev) => {
      const updatedReviews = [...prev.reviews];
      // Convert 'star' input string to number
      const finalValue =
        field === "star"
          ? typeof value === "string"
            ? parseInt(value, 10)
            : value
          : value;

      updatedReviews[index] = {
        ...updatedReviews[index],
        [field]: finalValue,
      };
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

  // --- handleUpdate (JSON body) ---
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    // Basic validation for the dynamic array
    const isValid = formData.reviews.every(
      (review) =>
        review.name.trim() !== "" &&
        review.reviewText.trim() !== "" &&
        review.star >= 1 &&
        review.star <= 5
    );

    if (!isValid) {
      setIsSubmitLoading(false);
      return toast.error(
        "All review fields, including a valid 1-5 star rating, must be filled out."
      );
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/update-testimonial/${testimonialId}`, // API Endpoint Change
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
            reviews: formData.reviews,
          }),
        }
      );

      const result = await res.json();
      setIsSubmitLoading(false);

      if (!res.ok) toast.error(result.error);
      else {
        setGlobalRefresh((prev) => !prev);
        setUpdateFormPop(false);
        toast.success("Testimonial Section updated successfully.");
      }
    } catch (error) {
      setIsSubmitLoading(false);
      toast.error("API Error updating testimonial!");
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
              <th className="px-4 py-3 text-center">Total Reviews</th>{" "}
              {/* Changed */}
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {testimonialData.length > 0 ? (
              testimonialData.map((item, index: number) => (
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
                  {/* --- Total Reviews Column --- */}
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-lg">
                      {item.reviews?.length || 0}{" "}
                      {/* Changed from faqs to reviews */}
                    </span>
                  </td>
                  {/* ----------------------------- */}
                  <td className="px-4 py-3 text-center flex gap-2 justify-center">
                    <button
                      className="bg-primary hover:opacity-80 text-white h-10 flex items-center justify-center rounded-sm py-4 px-3 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm"
                      onClick={() => handleEditClick(item._id || "")} // Use item._id or empty string
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
                  No Testimonial sections found.
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
            setTestimonialId("");
          }}
          confirm={handleAlertConfirmForUpdate}
          desc="Do you want to update this Testimonial section?" // Changed
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
                className="relative space-y-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 rounded-xl shadow-sm bg-white border border-gray-200"
                onSubmit={handleUpdate}
              >
                <div className="flex justify-between items-center pb-4 border-b sticky top-0 bg-white z-10">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Update Testimonial Section {/* Changed */}
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

                {/* --- Dynamic Review List --- */}
                <div className="space-y-6 pt-4 border-t">
                  <h3 className="text-xl font-semibold text-gray-700">
                    Testimonials/Reviews {/* Changed */}
                  </h3>

                  {formData.reviews.map((review, idx) => (
                    <div
                      key={review._id || idx} // Use _id if available, fallback to index
                      className="p-4 border rounded-lg bg-indigo-50 space-y-3 relative shadow-md" // Changed color for distinction
                    >
                      <h4 className="font-bold text-indigo-700">
                        Review #{idx + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeReview(idx)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
                        disabled={formData.reviews.length === 1}
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
                          <label className={inputLable}>
                            Reviewer Post/Title *
                          </label>
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
                          <label className={inputLable}>
                            Location (Optional)
                          </label>
                          <input
                            type="text"
                            value={review.location}
                            onChange={(e) =>
                              handleReviewChange(
                                idx,
                                "location",
                                e.target.value
                              )
                            }
                            className={`${formInput}`}
                          />
                        </div>
                        {/* Star Rating */}
                        <div>
                          <label className={inputLable}>
                            Star Rating (1-5) *
                          </label>
                          <input
                            type="number"
                            value={review.star}
                            onChange={(e) =>
                              handleReviewChange(idx, "star", e.target.value)
                            } // Changed to handle string input
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
                            handleReviewChange(
                              idx,
                              "reviewText",
                              e.target.value
                            )
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
                    {isSubmitLoading ? "Updating..." : "Update"}
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

export default TestimonialTable;
