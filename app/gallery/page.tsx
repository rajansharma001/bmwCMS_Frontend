"use client";
import GallerySection from "@/components/webComponents/GallerySection";
import PageHeader from "@/components/webComponents/PageHeader";
import React from "react";

const Gallery = () => {
  return (
    <div className="w-full">
      <PageHeader breadcrumb={"gallery"} title={"Gallery"} />
      <GallerySection />
    </div>
  );
};

export default Gallery;
