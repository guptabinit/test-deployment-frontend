"use client";

import { useState } from "react";
import { HomeHeader } from "../_components/home/home-header";
import { Sidebar } from "../_components/sidebar";
import HeroSection from "../_components/home/hero-section";
import { Footer } from "../_components/footer";
import ServicesSection from "../_components/home/services-section";

import { useParams } from "next/navigation";
import { useHotelDataStore } from "@/stores/user/hotelDataStore";

export default function UserPage() {
  const { hotelId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    services,
    customization,
    aboutHotel,
    isCustomizationLoaded,
    isMenuLoaded,
  } = useHotelDataStore();

  return (
    <>
      <HomeHeader
        services={services}
        hotelId={hotelId as string}
        hotelLogo={customization?.hotelLogo as string}
        isLogoLoaded={isCustomizationLoaded}
      />

      <Sidebar />

      <div className="flex min-h-screen flex-col bg-gray-50">
        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "md:ml-64" : ""
          }`}
        >
          <div className="container mx-auto px-4 py-6">
            <HeroSection
              hotelId={hotelId as string}
              hotelCity={aboutHotel?.overview?.hotelCity as string}
              hotelName={aboutHotel?.overview?.name as string}
              hotelState={aboutHotel?.overview?.hotelState as string}
              hotelStreet={aboutHotel?.overview?.hotelStreet as string}
              banners={customization?.banners}
            />

            <ServicesSection
              hotelServices={services}
              hotelId={hotelId as string}
              isLoaded={isMenuLoaded}
            />
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
