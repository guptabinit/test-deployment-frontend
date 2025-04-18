"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "../../_components/sidebar";
import { Footer } from "../../_components/footer";
import { Header } from "../../_components/header";
import { useParams } from "next/navigation";
import MainDialList from "../../_components/dialer/main-dial-list";
import ServiceTabs from "../../_components/dialer/service-tabs";
import DialerNavbar from "../../_components/dialer/dialer-navbar";
import SearchBar from "../../_components/dialer/search-bar";
import { useHotelDataStore } from "@/stores/user/hotelDataStore";
import { Contact } from "@/types/Contact";

export default function DialListPage() {
  const { hotelId } = useParams();
  const {
    customization,
    isCustomizationLoaded,
    services,
    dialList,
    isDialerLoaded,
  } = useHotelDataStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDialList, setFilteredDialList] = useState<Contact[]>([]);
  const [activeServiceId, setActiveServiceId] = useState<string>("");

  // Only filter — no fetch
  useEffect(() => {
    let filtered = [...dialList];

    if (activeServiceId) {
      filtered = filtered.filter(
        (contact) => contact.serviceId === activeServiceId
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDialList(filtered);
  }, [searchQuery, activeServiceId, dialList]);

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: customization?.hotelColors?.backgroundColor }}
    >
      <Header
        hotelId={hotelId as string}
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
        <DialerNavbar hotelId={hotelId as string} />

        <div className="container mx-auto max-w-3xl px-4 py-4">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setActiveServiceId={setActiveServiceId}
          />

          <ServiceTabs
            fetchedServices={services.filter(
              (service) => service.isActive === true
            )}
            activeServiceId={activeServiceId}
            setActiveServiceId={setActiveServiceId}
            searchQuery={searchQuery}
            customization={customization}
          />

          <MainDialList
            isDialerLoaded={isDialerLoaded}
            filteredDialList={filteredDialList}
            customization={customization}
            fetchedServices={services}
            activeServiceId={activeServiceId}
            setActiveServiceId={setActiveServiceId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
