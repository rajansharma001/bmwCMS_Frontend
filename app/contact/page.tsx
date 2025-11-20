import ContactSection from "@/components/webComponents/ContactSection";
import PageHeader from "@/components/webComponents/PageHeader";
import React from "react";

const Contact = () => {
  return (
    <div className="w-full">
      <PageHeader breadcrumb={"contact"} title={"Contact Us"} />
      <ContactSection />
    </div>
  );
};

export default Contact;
