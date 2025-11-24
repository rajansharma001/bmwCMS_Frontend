"use client";

import React, { useState, FormEvent } from "react";
import Button from "@/components/Button";
import RichTextEditor from "@/components/RichTextEditor";
import { useProtectedRoute } from "@/context/useProtected";
import { formInput, inputLable } from "@/styles/styles";
import { Loader, XCircle, Image } from "lucide-react";
import { toast } from "sonner";

// --- Packages Interfaces (Based on Final Mongoose Model) ---
interface PackageItem {
  name: string;
  price: number;
  discountedPrice: number;
  hasDiscount: boolean;
  priceUnit: string;
  billingCycle: string;
  features: string; // Storing features as a comma-separated string for easy input
  isFeatured: boolean;
  callToAction: string;
  imageUrl: string;
  specialOfferTitle: string;
  specialOfferDetails: string;
  hasSpecialOffer: boolean;
}

interface PackageFormData {
  heading: string;
  title: string;
  shortDescription: string;
  packages: PackageItem[];
}

const newPackageItem: PackageItem = {
  name: "",
  price: 0,
  discountedPrice: 0,
  hasDiscount: false,
  priceUnit: "$",
  billingCycle: "per month",
  features: "",
  isFeatured: false,
  callToAction: "Get Started",
  imageUrl: "",
  specialOfferTitle: "",
  specialOfferDetails: "",
  hasSpecialOffer: false,
};

const defaultFormData: PackageFormData = {
  heading: "",
  title: "",
  shortDescription: "",
  packages: [newPackageItem], // Start with one empty package item
};

const PackageInputForm = ({
  formClose,
  onSubmitSuccess,
}: {
  formClose: () => void;
  onSubmitSuccess: () => void;
}) => {
  useProtectedRoute();
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // --- Handlers for Static Fields (Heading, Title, Description) ---
  const handleStaticChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (val: string) => {
    setFormData((prev) => ({ ...prev, shortDescription: val }));
  };

  // --- Handlers for Dynamic Package Array ---

  const handlePackageChange = (
    index: number,
    field: keyof PackageItem,
    value: string | number | boolean
  ) => {
    setFormData((prev) => {
      const updatedPackages = [...prev.packages];
      updatedPackages[index] = { ...updatedPackages[index], [field]: value };
      return { ...prev, packages: updatedPackages };
    });
  };

  const addPackage = () => {
    setFormData((prev) => ({
      ...prev,
      packages: [...prev.packages, newPackageItem],
    }));
  };

  const removePackage = (indexToRemove: number) => {
    setFormData((prev) => {
      const newPackages = prev.packages.filter(
        (_, idx) => idx !== indexToRemove
      );
      return { ...prev, packages: newPackages };
    });
  };

  // --- Submission Logic ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 1. Validation for Dynamic Array
    const validationErrors = formData.packages
      .map((pkg, idx) => {
        if (!pkg.name.trim()) return `Package ${idx + 1}: Name is required.`;
        if (pkg.price <= 0)
          return `Package ${idx + 1}: Price must be greater than 0.`;
        if (!pkg.priceUnit.trim())
          return `Package ${idx + 1}: Price Unit is required.`;
        if (!pkg.billingCycle.trim())
          return `Package ${idx + 1}: Billing Cycle is required.`;
        if (!pkg.features.trim())
          return `Package ${idx + 1}: Features list is required.`;

        if (pkg.hasDiscount) {
          if (pkg.discountedPrice <= 0)
            return `Package ${
              idx + 1
            }: Discounted Price must be greater than 0 when discount is active.`;
          if (pkg.discountedPrice >= pkg.price)
            return `Package ${
              idx + 1
            }: Discounted Price must be lower than the original price.`;
        }
        if (pkg.hasSpecialOffer) {
          if (!pkg.specialOfferTitle.trim())
            return `Package ${idx + 1}: Special Offer Title is required.`;
          if (!pkg.specialOfferDetails.trim())
            return `Package ${idx + 1}: Special Offer Details are required.`;
        }
        return null;
      })
      .filter((error) => error !== null);

    if (validationErrors.length > 0) {
      return toast.error(validationErrors[0]);
    }

    // 2. Prepare Data for API (Convert features string to array)
    const dataToSend = {
      ...formData,
      packages: formData.packages.map((pkg) => ({
        ...pkg,
        features: pkg.features
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f.length > 0),
      })),
    };

    setIsSubmitLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/packages/new-package-section`, // API Endpoint Change
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend), // Use processed data
        }
      );

      const result = await res.json();
      setIsSubmitLoading(false);

      if (!res.ok) return toast.error(result.error);

      toast.success("Packages Section added successfully!"); // Message Change
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
          className="relative space-y-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8 rounded-xl shadow-sm bg-white border border-gray-200"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-between items-center pb-4 border-b sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-bold text-gray-800">
              New Packages Section
            </h2>
            <Button
              btnStyle="bg-red-500 text-white rounded-md"
              btnTitle="Close"
              clickEvent={formClose}
            />
          </div>

          {/* --- Static Fields (Section Metadata) --- */}
          <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
              Section Metadata
            </h3>
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
                  className={`${formInput}`}
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
          </div>

          {/* --- Dynamic Packages List --- */}
          <div className="space-y-6 pt-4 border-t">
            <h3 className="text-xl font-semibold text-gray-700">
              Pricing Packages List
            </h3>

            {formData.packages.map((pkg, idx) => (
              <div
                key={idx}
                className="p-6 border-2 border-indigo-200 rounded-xl bg-white space-y-4 relative shadow-md"
              >
                <h4 className="text-xl font-bold text-indigo-800 border-b pb-2">
                  Package #{idx + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removePackage(idx)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition disabled:opacity-50"
                  disabled={formData.packages.length === 1}
                >
                  <XCircle size={24} />
                </button>

                {/* General Package Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Name */}
                  <div>
                    <label className={inputLable}>Package Name *</label>
                    <input
                      type="text"
                      value={pkg.name}
                      onChange={(e) =>
                        handlePackageChange(idx, "name", e.target.value)
                      }
                      className={`${formInput}`}
                      required
                    />
                  </div>
                  {/* CTA */}
                  <div>
                    <label className={inputLable}>Call to Action Text *</label>
                    <input
                      type="text"
                      value={pkg.callToAction}
                      onChange={(e) =>
                        handlePackageChange(idx, "callToAction", e.target.value)
                      }
                      className={`${formInput}`}
                      required
                    />
                  </div>
                  {/* Image URL */}
                  <div>
                    <label className={inputLable}>
                      <Image size={16} className="inline mr-1" /> Image URL
                      (Icon/Image)
                    </label>
                    <input
                      type="text"
                      value={pkg.imageUrl}
                      onChange={(e) =>
                        handlePackageChange(idx, "imageUrl", e.target.value)
                      }
                      className={`${formInput}`}
                      placeholder="e.g., https://example.com/icon.svg"
                    />
                  </div>
                </div>

                {/* Pricing Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 border-t pt-4">
                  <h5 className="col-span-full font-semibold text-gray-700">
                    Pricing Details
                  </h5>
                  {/* Price */}
                  <div>
                    <label className={inputLable}>Original Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={pkg.price}
                      onChange={(e) =>
                        handlePackageChange(
                          idx,
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className={`${formInput}`}
                      min="0"
                      required
                    />
                  </div>
                  {/* Price Unit */}
                  <div>
                    <label className={inputLable}>Unit ($/€) *</label>
                    <input
                      type="text"
                      value={pkg.priceUnit}
                      onChange={(e) =>
                        handlePackageChange(idx, "priceUnit", e.target.value)
                      }
                      className={`${formInput}`}
                      required
                    />
                  </div>
                  {/* Billing Cycle */}
                  <div>
                    <label className={inputLable}>Billing Cycle *</label>
                    <input
                      type="text"
                      value={pkg.billingCycle}
                      onChange={(e) =>
                        handlePackageChange(idx, "billingCycle", e.target.value)
                      }
                      className={`${formInput}`}
                      placeholder="e.g., per month, one time"
                      required
                    />
                  </div>
                  {/* Is Featured */}
                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      checked={pkg.isFeatured}
                      onChange={(e) =>
                        handlePackageChange(idx, "isFeatured", e.target.checked)
                      }
                      className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      id={`isFeatured-${idx}`}
                    />
                    <label
                      htmlFor={`isFeatured-${idx}`}
                      className="font-medium text-gray-700"
                    >
                      Feature this package?
                    </label>
                  </div>
                </div>

                {/* Discount Toggle and Field */}
                <div className="border p-3 rounded-lg bg-yellow-50">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={pkg.hasDiscount}
                      onChange={(e) =>
                        handlePackageChange(
                          idx,
                          "hasDiscount",
                          e.target.checked
                        )
                      }
                      className="mr-2 h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                      id={`hasDiscount-${idx}`}
                    />
                    <label
                      htmlFor={`hasDiscount-${idx}`}
                      className="font-medium text-yellow-700"
                    >
                      Enable Discounted Price?
                    </label>
                  </div>
                  {pkg.hasDiscount && (
                    <div>
                      <label className={inputLable}>Discounted Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={pkg.discountedPrice}
                        onChange={(e) =>
                          handlePackageChange(
                            idx,
                            "discountedPrice",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className={`${formInput} border-yellow-400`}
                        min="0"
                        required
                      />
                      {pkg.discountedPrice >= pkg.price && (
                        <p className="text-red-500 text-xs mt-1">
                          Discounted price must be lower than the original
                          price.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Special Offer Toggle and Fields */}
                <div className="border p-3 rounded-lg bg-green-50">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={pkg.hasSpecialOffer}
                      onChange={(e) =>
                        handlePackageChange(
                          idx,
                          "hasSpecialOffer",
                          e.target.checked
                        )
                      }
                      className="mr-2 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      id={`hasSpecialOffer-${idx}`}
                    />
                    <label
                      htmlFor={`hasSpecialOffer-${idx}`}
                      className="font-medium text-green-700"
                    >
                      Include Special Offer/Bonus?
                    </label>
                  </div>
                  {pkg.hasSpecialOffer && (
                    <div className="space-y-3">
                      <div>
                        <label className={inputLable}>
                          Offer Title (Short) *
                        </label>
                        <input
                          type="text"
                          value={pkg.specialOfferTitle}
                          onChange={(e) =>
                            handlePackageChange(
                              idx,
                              "specialOfferTitle",
                              e.target.value
                            )
                          }
                          className={`${formInput}`}
                          placeholder="e.g., Limited Time Bonus"
                          required
                        />
                      </div>
                      <div>
                        <label className={inputLable}>
                          Offer Details (Example: NPJ-KTM 10 ticket - 1 safari
                          free) *
                        </label>
                        <textarea
                          value={pkg.specialOfferDetails}
                          onChange={(e) =>
                            handlePackageChange(
                              idx,
                              "specialOfferDetails",
                              e.target.value
                            )
                          }
                          className={`${formInput} min-h-[50px]`}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <div className="pt-4 border-t">
                  <label className={inputLable}>
                    Features List (Comma Separated) *
                  </label>
                  <textarea
                    value={pkg.features}
                    onChange={(e) =>
                      handlePackageChange(idx, "features", e.target.value)
                    }
                    className={`${formInput} min-h-[100px]`}
                    placeholder="Feature 1, Feature 2, Feature 3"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter each feature separated by a comma. (e.g., Unlimited
                    Users, 10GB Storage, Priority Support)
                  </p>
                </div>
              </div>
            ))}

            <Button
              btnTitle="Add New Package"
              btnStyle="bg-indigo-500 text-white flex items-center justify-center space-x-2 w-full sm:w-auto"
              clickEvent={addPackage}
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
              {isSubmitLoading ? "Saving..." : "Save Package Section"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PackageInputForm;
