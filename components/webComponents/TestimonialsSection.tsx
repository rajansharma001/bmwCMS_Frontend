"use client";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useState } from "react";

// --- SLIDABLE TESTIMONIALS ---
const TestimonialsSection = () => {
  const [testimonialData, setTestimonialData] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/get-testimonial`,
          { method: "GET", credentials: "include" }
        );
        const result = await res.json();
        if (res.ok && isMounted) setTestimonialData(result.testimonials);
        else if (isMounted) console.log(result.error);
      } catch (error) {
        console.log("API Error fetching Testimonials!", error);
      }
    };
    fetchTestimonials();
    return () => {
      isMounted = false;
    };
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);

  // Safe default structure
  const reviews = testimonialData[0] || {
    heading: "",
    title: "",
    reviews: [],
  };

  const totalReviews = reviews.reviews?.length || 0;

  const nextReview = () =>
    setActiveIndex((prev) => (prev + 1) % (totalReviews || 1));

  const prevReview = () =>
    setActiveIndex(
      (prev) => (prev - 1 + (totalReviews || 1)) % (totalReviews || 1)
    );

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-red-600 font-bold tracking-wider uppercase text-sm">
            {reviews.heading}
          </span>
          <h2 className="text-4xl font-extrabold text-blue-900 mt-2">
            {reviews.title}
          </h2>
        </div>

        <div className="relative bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 min-h-[300px] flex flex-col justify-center">
          <div className="absolute top-8 left-8 text-red-100 transform -translate-x-2 -translate-y-2">
            <span className="text-8xl font-serif leading-none">“</span>
          </div>

          <div className="relative z-10 text-center transition-opacity duration-500 ease-in-out">
            <div className="flex justify-center text-yellow-400 mb-6">
              {[...Array(reviews.reviews?.[activeIndex]?.star || 0)].map(
                (_, i) => (
                  <Star key={i} className="w-6 h-6 fill-current" />
                )
              )}
            </div>

            <p className="text-lg md:text-xl text-gray-600 italic mb-8 leading-relaxed">
              {`"${reviews.reviews?.[activeIndex]?.reviewText || ""}"`}
            </p>

            <div>
              <h4 className="font-bold text-xl text-blue-900">
                {reviews.reviews?.[activeIndex]?.name || ""}
              </h4>
              <p className="text-sm text-gray-500">
                {reviews.reviews?.[activeIndex]?.location || ""}
              </p>
            </div>
          </div>

          {/* Controls */}
          <button
            onClick={prevReview}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition cursor-pointer z-20 shadow-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextReview}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition cursor-pointer z-20 shadow-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.reviews?.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeIndex
                  ? "bg-red-600 w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
