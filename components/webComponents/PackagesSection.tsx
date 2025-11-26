"use client";
import React, { useState, useEffect } from "react";
import { Check, Star, Zap, ChevronRight, Gift } from "lucide-react";
import Link from "next/link";

// --- Integrated PackageCard Component ---
const PackageCard = ({ pkg }) => {
  const {
    name,
    price,
    discountedPrice,
    hasDiscount,
    priceUnit,
    billingCycle,
    features,
    isFeatured,
    callToAction,
    imageUrl, // <-- Used here for the image source
    hasSpecialOffer,
    specialOfferTitle,
    specialOfferDetails,
  } = pkg;

  // Use discountedPrice if it's a valid number greater than 0 and discount is true
  const displayPrice =
    hasDiscount && discountedPrice > 0 ? discountedPrice : price;

  // Function to create a placeholder URL based on the package name
  const createPlaceholderUrl = (text) =>
    `https://placehold.co/800x400/0f172a/ffffff?text=${encodeURIComponent(
      text
    )}`;

  return (
    <div
      className={`relative flex flex-col bg-white rounded-2xl transition-all duration-300 ${
        isFeatured
          ? "shadow-2xl scale-105 z-10 border-2 border-red-600"
          : "shadow-lg hover:shadow-xl hover:-translate-y-1 border border-gray-100"
      }`}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md flex items-center gap-1 whitespace-nowrap z-20">
          <Star className="w-3 h-3 fill-current" /> Most Popular
        </div>
      )}

      {/* Image Section */}
      {(imageUrl || true) && ( // Always attempt to render the image container
        <div className="relative h-28 overflow-hidden rounded-t-xl">
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10" />
          <img
            src={
              imageUrl && imageUrl.startsWith("http")
                ? imageUrl
                : createPlaceholderUrl(name)
            }
            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
          />
          {/* <h3 className="absolute text-center bottom-4 left-4 text-white text-xl font-bold z-20 drop-shadow-md">
            {name}
          </h3> */}
        </div>
      )}

      <div className="p-6 flex flex-col grow">
        {/* Title (if no image/if needed) */}
        {/* Removed redundant title display if image is present */}

        {/* Price Section */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">
              {priceUnit}
              {displayPrice.toLocaleString()}
            </span>
            <span className="text-gray-500 text-sm font-medium">
              / {billingCycle}
            </span>
          </div>
          {hasDiscount && discountedPrice && (
            <div className="text-sm text-gray-400 line-through mt-1">
              Original: {priceUnit}
              {price.toLocaleString()}
            </div>
          )}
        </div>
        {/* Special Offer Banner */}
        {hasSpecialOffer && (
          <div className="bg-linear-to-r from-yellow-400 to-orange-500 text-white text-lg font-bold px-4 py-3 text-center uppercase tracking-wider rounded-t-lg ">
            <Gift size={60} className="w-5 h-5 inline-block mr-1 mb-0.5" />
            {specialOfferTitle || "Special Offer"}
          </div>
        )}

        {/* Special Offer Details */}
        {hasSpecialOffer && specialOfferDetails && (
          <div className="mb-6 bg-blue-50 border border-blue-100 p-3 rounded-b-lg text-center">
            <p className="text-sm text-blue-800 font-medium flex items-start gap-2">
              <Zap className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              {specialOfferDetails}
            </p>
          </div>
        )}

        {/* Features List */}
        <ul className="space-y-3 mb-8 grow">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start text-sm text-gray-600">
              <div
                className={`mt-0.5 mr-3 shrink-0 rounded-full p-0.5 ${
                  isFeatured
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                <Check className="w-3 h-3" />
              </div>
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Link
          href="/contact"
          className={`w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            isFeatured
              ? "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/30"
              : "bg-blue-900 hover:bg-blue-800 text-white hover:shadow-lg"
          }`}
        >
          {callToAction}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

// --- PackagesSection Display Component (receives data prop) ---
const PackagesSection = ({ data }) => {
  if (!data) return null;

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 skew-x-12 transform translate-x-20" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-50/50 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-red-600 font-bold tracking-wider uppercase text-sm">
            {data.heading}
          </span>
          <h2 className="text-4xl font-extrabold text-blue-900 mt-2 mb-4">
            {data.title}
          </h2>
          {/* Renders HTML content for shortDescription */}
          <div
            className="text-gray-600 text-lg"
            dangerouslySetInnerHTML={{ __html: data.shortDescription }}
          />
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {data.packages.map((pkg, index) => (
            <PackageCard key={pkg._id || index} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Main Fetching Component (App is now the default export) ---
const App = () => {
  // State to hold the array of package sections from the API
  const [packagesSections, setPackagesSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPackageSections = async () => {
      setIsLoading(true);
      setError(null);

      // Basic Exponential Backoff implementation for retries
      const maxRetries = 3;
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          // NOTE: process.env.NEXT_PUBLIC_API_URL is expected to be defined in the hosting environment.
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/packages/get-package-section`,
            { method: "GET", credentials: "include" }
          );

          const result = await res.json();

          if (res.ok && isMounted) {
            setPackagesSections(result.packagesSections);
            setIsLoading(false);
            return; // Success, exit function
          } else if (isMounted) {
            // Log API error but continue trying if not last attempt
            console.error(
              `Attempt ${attempt + 1}: API Error fetching packages:`,
              result.error
            );
          }
        } catch (e) {
          if (isMounted) {
            console.error(
              `Attempt ${attempt + 1}: Network Error fetching packages:`,
              e
            );
          }
        }

        // If it's not the last attempt, wait before retrying (exponential backoff)
        if (attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      // If loop finishes without success
      if (isMounted) {
        setError("Failed to fetch package sections after multiple attempts.");
        setIsLoading(false);
      }
    };

    fetchPackageSections();

    return () => {
      isMounted = false;
    };
  }, []);

  // --- Rendering Logic ---

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-900 mr-4"></div>
        <p className="text-blue-900 font-semibold text-lg">
          Loading Packages...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-red-50 border-2 border-red-300 text-red-800 rounded-xl m-8 p-6 shadow-lg">
        <p className="font-extrabold text-xl mb-3">Data Fetch Error</p>
        <p>{error}</p>
        <p className="text-sm text-red-600 mt-2">
          Could not load package data from the backend.
        </p>
      </div>
    );
  }

  const mainPackageSection = packagesSections[0];

  if (!mainPackageSection) {
    return (
      <div className="text-center py-20 text-gray-500 bg-white min-h-screen flex items-center justify-center">
        <p className="text-lg">No package sections available.</p>
      </div>
    );
  }

  return (
    // Render the main package section
    <PackagesSection data={mainPackageSection} />
  );
};

export default App;
