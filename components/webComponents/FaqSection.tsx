"use client";

import { useEffect, useState } from "react";

// --- FAQ SECTION ---
const FaqSection = () => {
  // const faqs = [
  //   {
  //     q: "What types of vehicles do you offer for rental?",
  //     a: "We offer a wide range of vehicles including rugged Scorpios, comfortable cars, versatile pickups, and Hiace vans for larger groups. All our vehicles are well-maintained and air-conditioned.",
  //   },
  //   {
  //     q: "How can I book a vehicle or service?",
  //     a: "You can book easily by calling us at +977 9800000000, emailing info@bestmidwest.com, or filling out the contact form on this website.",
  //   },
  //   {
  //     q: "Are there any hidden fees in your pricing?",
  //     a: "No. We believe in transparent pricing. Our quotes are all-inclusive with no hidden charges.",
  //   },
  //   {
  //     q: "Can I book domestic and international air tickets through your company?",
  //     a: "Yes, we provide ticketing services for all major domestic airlines (Buddha, Yeti, Shree) and international flights globally.",
  //   },
  //   {
  //     q: "Do you provide courier services?",
  //     a: "Yes, we offer reliable courier services to ensure your parcels are delivered promptly and safely.",
  //   },
  // ];
  const [faqData, setFaqData] = useState([]);

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
        else if (isMounted) console.log(result.error);
      } catch (error) {
        console.log("API Error fetching FAQs!", error);
      }
    };
    fetchFAQs();
    return () => {
      isMounted = false;
    };
  }, []);

  const faqs = faqData[0];

  console.log("FAQs:", faqs);

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-600 font-bold tracking-wider uppercase text-sm">
            {faqs?.heading}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 mt-2">
            {faqs?.title}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs &&
            faqs.faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
                >
                  <span className="font-bold text-gray-800">
                    {faq.question}
                  </span>
                  <span className="text-blue-600 text-2xl">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openIndex === index
                      ? "max-h-48 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 py-4 text-gray-600 border-t border-gray-100 bg-white">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
