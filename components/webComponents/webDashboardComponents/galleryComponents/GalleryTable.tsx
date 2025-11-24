"use client";

import React, { useEffect, useState, FormEvent } from "react";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";
import Alert from "@/components/alertAndNotification/Alert";
import Button from "@/components/Button";
import RichTextEditor from "@/components/RichTextEditor";
import { formInput, inputLable } from "@/styles/styles";
import { Loader } from "lucide-react";
import Image from "next/image";

// --- UPDATED INTERFACES (CAPTION REMOVED) ---
interface GalleryImageItem {
  image: string;
  _id?: string;
}

interface FileWithPreview extends File {
  preview: string;
}

interface GalleryFormData {
  heading: string;
  title: string;
  shortDescription: string;
  gallery: (GalleryImageItem | FileWithPreview)[];
}

const defaultFormData: GalleryFormData = {
  heading: "",
  title: "",
  shortDescription: "",
  gallery: [],
};

const GalleryTable = ({ tableRefresh }) => {
  const [galleryData, setGalleryData] = useState([]);
  const [updateAlertPop, setUpdateAlertPop] = useState(false);
  const [updateFormPop, setUpdateFormPop] = useState(false);
  const [galleryId, setGalleryId] = useState("");
  const [formData, setFormData] = useState<GalleryFormData>(defaultFormData);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [globalRefresh, setGlobalRefresh] = useState(false);

  // --- Fetch Logic (Unchanged) ---
  useEffect(() => {
    let isMounted = true;
    const fetchGalleries = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/galleries/get-gallery`,
          { method: "GET", credentials: "include" }
        );
        const result = await res.json();
        if (res.ok && isMounted) setGalleryData(result.galleries);
        else if (isMounted) toast.error(result.error);
      } catch (error) {
        toast.error("API Error!", error);
      }
    };
    fetchGalleries();
    return () => {
      isMounted = false;
    };
  }, [globalRefresh, tableRefresh]);

  const handleEditClick = (id: string) => {
    setGalleryId(id);
    setUpdateAlertPop(true);
  };

  const fetchGalleryById = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/galleries/get-gallery/${galleryId}`,
        { method: "GET", credentials: "include" }
      );
      const result = await res.json();
      if (!res.ok) toast.error(result.error);
      else {
        // Set existing gallery data
        setFormData(result.gallery);
      }
    } catch (error) {
      toast.error("API Error!", error);
    }
  };

  const handleAlertConfirmForUpdate = async () => {
    setUpdateAlertPop(false);
    setUpdateFormPop(true);
    await fetchGalleryById();
  };

  const isNewFile = (
    item: GalleryImageItem | FileWithPreview
  ): item is FileWithPreview => {
    // A FileWithPreview will have a 'name' property from the File object,
    // while a GalleryImageItem will have an 'image' URL.
    return (item as FileWithPreview).preview !== undefined;
  };

  // --- Utility function for image source ---
  const getImageUrl = (item: GalleryImageItem | FileWithPreview): string => {
    // If it's a new file, use the local preview URL.
    if (isNewFile(item)) {
      return item.preview;
    }
    // If it's an existing image item, use the remote image URL.
    return item.image;
  };

  // --- UPDATED handleChange (File handling ONLY) ---
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const newFiles: FileWithPreview[] = Array.from(target.files).map(
          (file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
        );
        setFormData((prev) => ({
          ...prev,
          gallery: [...prev.gallery, ...newFiles],
        }));
        target.value = "";
      }
    } else {
      // Handle changes to static fields (heading, title, shortDescription is handled separately)
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleParagraphChange = (val: string) => {
    setFormData((prev) => ({ ...prev, shortDescription: val }));
  };

  const removeImage = (indexToRemove: number) => {
    setFormData((prev) => {
      const itemToRemove = prev.gallery[indexToRemove];

      if (isNewFile(itemToRemove)) {
        URL.revokeObjectURL(itemToRemove.preview);
      }

      const newGallery = prev.gallery.filter((_, idx) => idx !== indexToRemove);
      return { ...prev, gallery: newGallery };
    });
  };

  // --- UPDATED handleUpdate (Unchanged from your working logic) ---
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    const form = new FormData();
    form.append("heading", formData.heading);
    form.append("title", formData.title);
    form.append("shortDescription", formData.shortDescription);

    const existingGalleryIds = [];

    formData.gallery.forEach((item) => {
      if (isNewFile(item)) {
        // New File: Append file data to be uploaded via Multer
        form.append("gallery", item);
      } else {
        // Existing image: Collect ID
        existingGalleryIds.push(item._id);
      }
    });

    // Send the list of IDs for images that were *kept*
    form.append("existingGalleryIds", JSON.stringify(existingGalleryIds));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/galleries/update-gallery/${galleryId}`,
        {
          method: "PATCH",
          credentials: "include",
          body: form,
        }
      );
      const result = await res.json();
      setIsSubmitLoading(false);

      if (!res.ok) toast.error(result.error);
      else {
        setGlobalRefresh((prev) => !prev);
        setUpdateFormPop(false);
        toast.success("Gallery updated successfully.");
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
              <th className="px-4 py-3">Short Description</th>
              <th className="px-4 py-3">Images</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {galleryData.length > 0 ? (
              galleryData.map((item, index: number) => (
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
                  {/* --- Gallery Images Column --- */}
                  <td className="px-4 py-3 flex gap-2">
                    {item.gallery?.slice(0, 3).map((g, idx: number) => (
                      <div key={idx} className="w-10 h-10 relative shrink-0">
                        <Image
                          src={g.image}
                          alt={`Gallery Image ${idx + 1}`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded"
                        />
                      </div>
                    ))}
                    {item.gallery?.length > 3 && (
                      <span className="text-gray-500 text-xs self-center">
                        +{item.gallery.length - 3} more
                      </span>
                    )}
                  </td>
                  {/* ----------------------------- */}
                  <td className="px-4 py-3 text-center">
                    <button
                      className="bg-primary hover:opacity-80 text-white h-10 flex items-center justify-center rounded-sm py-4 px-7 cursor-pointer transition-all duration-300 ease-in-out uppercase text-sm mx-auto"
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
                  No galleries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Alert Modal (Unchanged) --- */}
      {updateAlertPop && (
        <Alert
          cancel={() => {
            setUpdateAlertPop(false);
            setGalleryId("");
          }}
          confirm={handleAlertConfirmForUpdate}
          desc="Do you want to update this gallery?"
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
                className="relative space-y-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 rounded-xl shadow-2xl bg-white border border-gray-200"
                onSubmit={handleUpdate}
                encType="multipart/form-data"
              >
                <div className="flex justify-between items-center pb-4 border-b sticky top-0 bg-white z-10">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Update Gallery Section ({galleryId})
                  </h2>
                  <Button
                    btnStyle="bg-red-500 text-white rounded-md"
                    btnTitle="Close"
                    clickEvent={() => setUpdateFormPop(false)}
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
                            // FIX APPLIED HERE: Use getImageUrl
                            src={getImageUrl(file)}
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
                            <LucideIcons.XCircle size={18} />
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
        </div>
      )}
    </div>
  );
};

export default GalleryTable;
