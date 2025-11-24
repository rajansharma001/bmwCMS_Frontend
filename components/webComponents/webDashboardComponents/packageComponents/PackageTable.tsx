"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { toast } from "sonner";
import Alert from "@/components/alertAndNotification/Alert"; // Assuming this component exists
import Button from "@/components/Button"; // Assuming this component exists
import RichTextEditor from "@/components/RichTextEditor"; // Assuming this component exists
import { formInput, inputLable } from "@/styles/styles"; // Assuming these styles exist
import {
  Loader,
  XCircle,
  Edit2,
  Package,
  DollarSign,
  Plus,
  Image,
} from "lucide-react";
import { useProtectedRoute } from "@/context/useProtected";

// --- Package Interfaces (Based on Final Mongoose Model) ---
interface PackageItem {
  name: string;
  price: number;
  discountedPrice: number;
  hasDiscount: boolean;
  priceUnit: string;
  billingCycle: string;
  features: string | string[]; // Can be string[] for existing data, or string for form input
  isFeatured: boolean;
  callToAction: string;
  imageUrl: string;
  specialOfferTitle: string;
  specialOfferDetails: string;
  hasSpecialOffer: boolean;
  _id?: string; // ID for the subdocument
}

interface PackageFormData {
  heading: string;
  title: string;
  shortDescription: string;
  packages: PackageItem[];
  _id?: string; // ID for the main document
}

const newPackageItem: PackageItem = {
  name: "",
  price: 0,
  discountedPrice: 0,
  hasDiscount: false,
  priceUnit: "$",
  billingCycle: "per month",
  features: "", // Store as string for new form input
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
  packages: [],
};

const PackageTable = ({ tableRefresh }: { tableRefresh: boolean }) => {
  useProtectedRoute();
  const [packageData, setPackageData] = useState<PackageFormData[]>([]);
  const [updateAlertPop, setUpdateAlertPop] = useState(false);
  const [updateFormPop, setUpdateFormPop] = useState(false);
  const [packageSectionId, setPackageSectionId] = useState("");
  const [formData, setFormData] = useState<PackageFormData>(defaultFormData);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [globalRefresh, setGlobalRefresh] = useState(false);

  // --- Fetch Packages ---
  useEffect(() => {
    let isMounted = true;
    const fetchPackages = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/packages/get-package-section`, // API Endpoint: Packages
          { method: "GET", credentials: "include" }
        );
        const result = await res.json();
        if (res.ok && isMounted) {
          // Flatten the features array to a comma-separated string for form compatibility
          const processedData = result.packagesSections.map(
            (section: PackageFormData) => ({
              ...section,
              packages: section.packages.map((pkg) => ({
                ...pkg,
                features: Array.isArray(pkg.features)
                  ? pkg.features.join(", ")
                  : pkg.features,
              })),
            })
          );
          setPackageData(processedData);
        } else if (isMounted) toast.error(result.error);
      } catch (error) {
        toast.error("API Error fetching Packages!");
        console.error(error);
      }
    };
    fetchPackages();
    return () => {
      isMounted = false;
    };
  }, [globalRefresh, tableRefresh]);

  // --- Edit Handlers ---
  const handleEditClick = (id: string) => {
    setPackageSectionId(id);
    setUpdateAlertPop(true);
  };

  const fetchPackageSectionById = async () => {
    if (!packageSectionId) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/packages/get-package-section/${packageSectionId}`, // API Endpoint: Packages
        { method: "GET", credentials: "include" }
      );
      const result = await res.json();
      if (!res.ok) toast.error(result.error);
      else {
        // Flatten the features array to a comma-separated string for form compatibility
        const packagesWithFlattenedFeatures =
          result.packagesSection.packages.map((pkg: PackageItem) => ({
            ...pkg,
            features: Array.isArray(pkg.features)
              ? pkg.features.join(", ")
              : pkg.features,
          }));

        const dataToLoad: PackageFormData = {
          ...result.packagesSection,
          packages: packagesWithFlattenedFeatures || [],
        };
        setFormData(dataToLoad);
      }
    } catch (error) {
      toast.error("API Error fetching single Package Section!");
    }
  };

  const handleAlertConfirmForUpdate = async () => {
    setUpdateAlertPop(false);
    setUpdateFormPop(true);
    await fetchPackageSectionById();
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

  // --- Dynamic Package Array Handlers ---
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

  // --- handleUpdate (JSON body) ---
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    // 1. Validation and Data Transformation
    const validationErrors = formData.packages
      .map((pkg, idx) => {
        if (!pkg.name.trim()) return `Package ${idx + 1}: Name is required.`;
        if (typeof pkg.price !== "number" || pkg.price <= 0)
          return `Package ${idx + 1}: Price must be greater than 0.`;
        if (!pkg.priceUnit.trim())
          return `Package ${idx + 1}: Price Unit is required.`;
        if (!pkg.billingCycle.trim())
          return `Package ${idx + 1}: Billing Cycle is required.`;
        if (!pkg.callToAction.trim())
          return `Package ${idx + 1}: Call to Action is required.`;
        // Features validation - check for non-empty string which will be split later
        if (typeof pkg.features !== "string" || pkg.features.trim() === "")
          return `Package ${idx + 1}: Features list is required.`;

        if (pkg.hasDiscount) {
          if (
            typeof pkg.discountedPrice !== "number" ||
            pkg.discountedPrice <= 0
          )
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
      setIsSubmitLoading(false);
      return toast.error(validationErrors[0]);
    }

    // 2. Prepare Data for API (Convert features string to array of trimmed strings)
    const packagesToSend = formData.packages.map((pkg) => ({
      ...pkg,
      features: (pkg.features as string)
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0),
    }));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/packages/update-package-section/${packageSectionId}`, // API Endpoint: Packages
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
            packages: packagesToSend, // Send processed array
          }),
        }
      );

      const result = await res.json();
      setIsSubmitLoading(false);

      if (!res.ok) toast.error(result.error);
      else {
        setGlobalRefresh((prev) => !prev);
        setUpdateFormPop(false);
        toast.success("Package Section updated successfully.");
      }
    } catch (error) {
      setIsSubmitLoading(false);
      toast.error("API Error updating Package Section!");
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
              <th className="px-4 py-3">Description Snippet</th>
              <th className="px-4 py-3 text-center">Total Packages</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {packageData.length > 0 ? (
              packageData.map((item, index: number) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-100 transition text-white hover:text-black"
                >
                  <td className="px-4 py-3 font-medium">{index + 1}</td>
                  <td className="px-4 py-3 font-semibold">{item.heading}</td>
                  <td className="px-4 py-3">{item.title}</td>
                  <td
                    className="px-4 py-3 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap "
                    dangerouslySetInnerHTML={{
                      __html: item.shortDescription,
                    }}
                  />
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-lg text-indigo-700">
                      {item.packages?.length || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center flex gap-2 justify-center">
                    <Button
                      btnTitle="Edit"
                      btnStyle="bg-green-500 hover:bg-green-600 text-white h-10 flex items-center justify-center rounded-md py-2 px-3 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm"
                      clickEvent={() => handleEditClick(item._id || "")}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-500 italic bg-white"
                >
                  No Package sections found.
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
            setPackageSectionId("");
          }}
          confirm={handleAlertConfirmForUpdate}
          desc="Do you want to update this Package section?" // Changed
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
                className="relative space-y-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8 rounded-xl shadow-sm bg-white border border-gray-200"
                onSubmit={handleUpdate}
              >
                <div className="flex justify-between items-center pb-4 border-b sticky top-0 bg-white z-10">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Update Package Section
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

                {/* --- Dynamic Packages List --- */}
                <div className="space-y-6 pt-4 border-t">
                  <h3 className="text-xl font-semibold text-gray-700">
                    Pricing Packages List
                  </h3>

                  {formData.packages.map((pkg, idx) => (
                    <div
                      key={pkg._id || idx}
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
                          <label className={inputLable}>
                            Call to Action Text *
                          </label>
                          <input
                            type="text"
                            value={pkg.callToAction}
                            onChange={(e) =>
                              handlePackageChange(
                                idx,
                                "callToAction",
                                e.target.value
                              )
                            }
                            className={`${formInput}`}
                            required
                          />
                        </div>
                        {/* Image URL */}
                        <div>
                          <label className={inputLable}>
                            <Image size={16} className="inline mr-1" /> Image
                            URL (Icon/Image)
                          </label>
                          <input
                            type="text"
                            value={pkg.imageUrl}
                            onChange={(e) =>
                              handlePackageChange(
                                idx,
                                "imageUrl",
                                e.target.value
                              )
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
                              handlePackageChange(
                                idx,
                                "priceUnit",
                                e.target.value
                              )
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
                              handlePackageChange(
                                idx,
                                "billingCycle",
                                e.target.value
                              )
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
                              handlePackageChange(
                                idx,
                                "isFeatured",
                                e.target.checked
                              )
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
                            <label className={inputLable}>
                              Discounted Price *
                            </label>
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
                                Offer Details (Example: NPJ-KTM 10 ticket - 1
                                safari free) *
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
                          value={pkg.features as string} // Assumed to be string here for editing
                          onChange={(e) =>
                            handlePackageChange(idx, "features", e.target.value)
                          }
                          className={`${formInput} min-h-[100px]`}
                          placeholder="Feature 1, Feature 2, Feature 3"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter each feature separated by a comma. (e.g.,
                          Unlimited Users, 10GB Storage, Priority Support)
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
                    className={`bg-indigo-600 text-white py-2 px-5 rounded-md flex items-center justify-center transition-opacity ${
                      isSubmitLoading
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-indigo-700"
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

export default PackageTable;
