"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "../../_components/header";
import { Sidebar } from "../../_components/sidebar";
import { Footer } from "../../_components/footer";
import AboutNavbar from "../../_components/about/about-navbar";
import AboutLoader from "../../_components/about/about-loader";
import GalleryModal from "../../_components/about/gallery-modal";
import FullAbout from "../../_components/about/full-about";
import { useHotelDataStore } from "@/stores/user/hotelDataStore";

export default function AboutHotelPage() {
  const { hotelId } = useParams();
  const {
    aboutHotel: hotelAbout,
    isAboutLoaded,
    customization,
    isCustomizationLoaded,
  } = useHotelDataStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  const formattedAddress = isAboutLoaded
    ? `${hotelAbout?.overview?.hotelStreet}, ${hotelAbout?.overview?.hotelCity}, ${hotelAbout?.overview?.hotelState}, ${hotelAbout?.overview?.hotelCountry}`
    : "";

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        hotelId={hotelAbout?.hotelId as string}
        hotelLogo={customization?.hotelLogo as string}
        isLogoLoaded={isCustomizationLoaded}
      />

      <Sidebar />

      <main
        className="flex-1"
        style={{
          backgroundColor: customization?.hotelColors?.backgroundColor,
        }}
      >
        <AboutNavbar hotelId={hotelId as string} />

        <div className="container mx-auto max-w-3xl px-4 py-6">
          {isAboutLoaded ? (
            <FullAbout
              customization={customization}
              aboutData={hotelAbout}
              setActiveImageIndex={setActiveImageIndex}
              setShowGalleryModal={setShowGalleryModal}
              formattedAddress={formattedAddress}
            />
          ) : (
            <AboutLoader />
          )}
        </div>
      </main>

      <Footer />

      {showGalleryModal && (
        <GalleryModal
          aboutData={hotelAbout}
          activeImageIndex={activeImageIndex}
          setActiveImageIndex={setActiveImageIndex}
          setShowGalleryModal={setShowGalleryModal}
        />
      )}
    </div>
  );
}
