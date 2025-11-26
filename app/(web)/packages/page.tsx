import PageHeader from "@/components/webComponents/PageHeader";
import WhyChooseUs from "@/components/webComponents/WhyChooseUs";
import PackagesSection from "@/components/webComponents/PackagesSection";
import React from "react";

const Packages = () => {
  return (
    <div className="w-full">
      <PageHeader breadcrumb={"packages"} title={"Our Packages"} />
      <PackagesSection />
      <WhyChooseUs />
    </div>
  );
};

export default Packages;
