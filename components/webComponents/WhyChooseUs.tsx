"use client";
import { CheckCircle, DollarSignIcon, Map } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";

// Why Choose Us Section
const WhyChooseUs = () => {
  const [itemsData, setItemsData] = useState([]);
  useEffect(() => {
    let isMounted = true;
    const fetchItems = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/whychooseus/get-whychooseus`,
          { method: "GET", credentials: "include" }
        );
        const result = await res.json();
        if (res.ok && isMounted) setItemsData(result.getWhyChooseUs);
        else if (isMounted) console.log(result.error);
      } catch (error) {
        console.log("API Error!", error);
      }
    };
    fetchItems();
    return () => {
      isMounted = false;
    };
  }, []);

  const whychooseus = itemsData[0];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-red-600 font-bold tracking-wider uppercase text-sm">
              {whychooseus?.heading}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 mt-2 mb-6">
              {whychooseus?.title}
            </h2>
            <div
              className="text-gray-600 text-lg mb-6 leading-relaxed text-justify"
              dangerouslySetInnerHTML={{
                __html: whychooseus?.shortDescription,
              }}
            />

            <div className="space-y-6 mt-5">
              {whychooseus?.items &&
                whychooseus?.items.map((item, index) => {
                  const IconComponent = LucideIcons[item.icon];
                  if (!IconComponent) return null;
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">
                          {item.title}
                        </h4>
                        <div
                          className="text-gray-600"
                          dangerouslySetInnerHTML={{
                            __html: item?.paragraph,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="relative">
            {whychooseus?.image && (
              <Image
                src={whychooseus.image}
                alt="Travel"
                className="rounded-2xl shadow-2xl w-full"
                height={700}
                width={1000}
              />
            )}

            <div className="absolute -bottom-6 -right-6 bg-red-600 p-6 rounded-xl text-white hidden md:block shadow-lg">
              <p className="font-bold text-xl">24/7 Support</p>
              <p className="text-sm opacity-90">We are always here for you</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
