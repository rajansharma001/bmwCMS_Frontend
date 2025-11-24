"use client";

import React, { useState, FormEvent } from "react";
import Button from "@/components/Button";
import RichTextEditor from "@/components/RichTextEditor";
import { useProtectedRoute } from "@/context/useProtected";
import { formInput, inputLable } from "@/styles/styles";
import { Loader, XCircle } from "lucide-react"; // Imported XCircle for removal button
import { toast } from "sonner";
import Image from "next/image";

// Define a type for a file with a preview URL for better TypeScript and safety
interface FileWithPreview extends File {
  preview: string;
}

// Update defaultFormData to use the new typed array
const defaultFormData = {
  heading: "",
  title: "",
  shortDescription: "",
  gallery: [] as FileWithPreview[], // Use the custom interface
};

const GalleryInputForm = ({ formClose, onSubmitSuccess }) => {
  useProtectedRoute();
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type } = e.target;
    if (type === "file") {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        // Create an array of FileWithPreview objects
        const newFiles: FileWithPreview[] = Array.from(target.files).map(
          (file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file), // Create preview URL immediately
            })
        );

        // Append new files to existing ones (if multiple uploads are intended)
        setFormData((prev) => ({
          ...prev,
          gallery: [...prev.gallery, ...newFiles],
        }));
      }
    } else {
      const { value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleParagraphChange = (val: string) => {
    setFormData((prev) => ({ ...prev, shortDescription: val }));
  };

  // New function to remove an image
  const removeImage = (indexToRemove: number) => {
    setFormData((prev) => {
      // Clean up the URL object to free memory
      URL.revokeObjectURL(prev.gallery[indexToRemove].preview);

      const newGallery = prev.gallery.filter((_, idx) => idx !== indexToRemove);
      return { ...prev, gallery: newGallery };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitLoading(true);

    const form = new FormData();
    form.append("heading", formData.heading);
    form.append("title", formData.title);
    form.append("shortDescription", formData.shortDescription);

    // Append files to FormData using the correct field name ("gallery")
    formData.gallery.forEach((file) => form.append("gallery", file));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/galleries/new-gallery`,
        {
          method: "POST",
          credentials: "include",
          body: form,
          // NOTE: Do NOT set Content-Type header when uploading files with FormData,
          // the browser sets it automatically with the correct boundary.
        }
      );

      const result = await res.json();
      setIsSubmitLoading(false);

      if (!res.ok) return toast.error(result.error);

      toast.success("Gallery added successfully!");
      onSubmitSuccess();
      formClose();
    } catch (err) {
      setIsSubmitLoading(false);
      toast.error("An API error occurred.");
      console.error(err);
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      {isSubmitLoading ? (
        <div className="p-10 bg-white rounded-md flex flex-col items-center justify-center text-gray-800">
          <Loader size={30} className="animate-spin" />
          <h1 className="mt-2">Submitting...</h1>
        </div>
      ) : (
        <form
          className="relative space-y-6 w-full max-w-3xl p-8 rounded-xl shadow-sm bg-white border border-gray-200"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="flex justify-between items-center pb-4 border-b">
            <h2 className="text-2xl font-bold text-gray-800">
              New Gallery Section
            </h2>
            <Button
              btnStyle="bg-red-500 text-white rounded-md"
              btnTitle="Close"
              clickEvent={formClose}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={inputLable}>Heading *</label>
              <input
                name="heading"
                value={formData.heading}
                onChange={handleChange}
                className={`${formInput}`}
                required
              />
            </div>
            <div>
              <label className={inputLable}>Title *</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`${formInput} `}
                required
              />
            </div>
          </div>

          <div>
            <label className={inputLable}>Gallery Images *</label>
            <input
              type="file"
              name="gallery"
              multiple
              accept="image/*"
              onChange={handleChange}
              className={`${formInput}`}
            />

            {/* --- Image Preview and Removal --- */}
            {formData.gallery.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4 p-2 border rounded-md bg-gray-50">
                {formData.gallery.map((file, idx) => (
                  <div
                    key={idx}
                    className="w-24 h-24 relative group overflow-hidden rounded border border-gray-300 shadow-sm"
                  >
                    <Image
                      src={file.preview}
                      alt={`Gallery ${idx + 1}`}
                      className="object-cover w-full h-full transition duration-300 group-hover:opacity-70"
                      height={150}
                      width={150}
                    />
                    {/* Removal Button Overlay */}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 text-white bg-red-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove image ${idx + 1}`}
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* --------------------------------- */}
          </div>

          <div>
            <label className={inputLable}>Short Description *</label>
            <RichTextEditor
              value={formData.shortDescription}
              onChange={handleParagraphChange}
            />
          </div>

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

export default GalleryInputForm;
