"use client";

import { useState, useEffect, useMemo } from "react";
import { useSidebar } from "../sidebar-provider";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Service } from "@/types/menu/Services";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from "next/navigation";
import { Item } from "@/types/menu/Items";
import { ItemHeader } from "./item-header";

export function HomeHeader({
  hotelId,
  services,
  hotelLogo,
  isLogoLoaded,
  items,
  serviceId,
}: {
  hotelId: string;
  services: Service[];
  hotelLogo: string;
  isLogoLoaded: boolean;
  items?: Item[];
  serviceId?: string;
}) {
  const pathname = usePathname();
  const isServiceDetailPage = pathname.includes("/services/");

  const { toggle } = useSidebar();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    if (showMobileSearch) {
      setShowResults(false);
    }
  };

  const filteredServices = useMemo(() => {
    if (searchTerm.length > 0) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }

    return services.filter((service) =>
      service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, services]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowResults(false);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-container")) {
        setShowResults(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white">
      {/* Mobile search overlay - full screen when active */}
      <div
        className={`fixed inset-0 bg-white z-50 md:hidden transition-all duration-300 ease-in-out ${
          showMobileSearch
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex h-16 items-center px-4">
          <div className="flex-1 mx-2 search-container">
            <form className="relative w-full" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Search services..."
                className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus={showMobileSearch}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (searchTerm.length > 0) {
                    setShowResults(true);
                  }
                }}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </form>

            {/* Mobile search results */}
            {showResults && filteredServices.length > 0 && (
              <div
                className="absolute left-0 right-0 mt-1 mx-4 bg-white rounded-lg shadow-lg max-h-[calc(100vh-120px)] overflow-y-auto z-50 transition-all duration-200 ease-in-out"
                style={{
                  opacity: showResults ? 1 : 0,
                  transform: showResults
                    ? "translateY(0)"
                    : "translateY(-10px)",
                }}
              >
                {filteredServices.map((service, index) => (
                  <Link
                    href={
                      service.isActive
                        ? `/user/${hotelId}/services/${service._id}`
                        : "#"
                    }
                    key={index}
                    className={`flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 ${
                      !service.isActive
                        ? "opacity-60 cursor-not-allowed bg-gray-50"
                        : ""
                    }`}
                    onClick={(e) => {
                      if (!service.isActive) {
                        e.preventDefault();
                        return;
                      }
                      setShowResults(false);
                      setShowMobileSearch(false);
                    }}
                  >
                    <div
                      className={`w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0 ${
                        !service.isActive ? "grayscale" : ""
                      }`}
                    >
                      <img
                        src={service.serviceImage || "/placeholder.svg"}
                        alt={service.serviceName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4
                          className={`font-medium text-sm ${
                            !service.isActive ? "text-gray-500" : ""
                          }`}
                        >
                          {service.serviceName}
                        </h4>
                        {!service.isActive && (
                          <span className="ml-2 text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs ${
                          !service.isActive ? "text-gray-400" : "text-gray-500"
                        } truncate`}
                      >
                        {service.serviceDesc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button onClick={toggleMobileSearch} className="p-2 ml-2">
            <X className="h-6 w-6 transition-transform duration-200 hover:rotate-90" />
            <span className="sr-only">Close search</span>
          </button>
        </div>
      </div>

      {/* Regular header */}
      <div className="flex h-16 items-center justify-between px-4 shadow-sm md:grid md:grid-cols-3">
        {/* Left section: Menu button */}
        <div className="flex items-center">
          <button onClick={toggle} className="p-2">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>

        {/* Center section: Logo */}
        <div className="flex items-center justify-center">
          <Link
            href={hotelId ? `/user/${hotelId}` : "#"}
            className="flex items-center justify-center"
          >
            {isLogoLoaded ? (
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${hotelLogo}`}
                alt="Hotel logo"
                className="h-[30px] w-[150px] object-cover object-center"
                style={{
                  maxWidth: "150px",
                  maxHeight: "30px",
                }}
              />
            ) : (
              <Skeleton
                className="h-[30px] w-[150px]"
                style={{
                  maxWidth: "150px",
                  maxHeight: "30px",
                }}
              />
            )}
          </Link>
        </div>

        {/* Right section: Search */}
        <div className="flex items-center justify-end">
          {isServiceDetailPage ? (
            <ItemHeader
              hotelId={hotelId}
              items={items || []}
              serviceId={serviceId!}
            />
          ) : (
            <>
              {/* Desktop search bar - always visible on md and larger screens */}
              <div className="hidden md:block md:w-full md:max-w-xs relative search-container">
                <form className="relative w-full" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Search services..."
                    className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (searchTerm.length > 0) {
                        setShowResults(true);
                      }
                    }}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </form>

                {/* Desktop search results dropdown */}
                {showResults && filteredServices.length > 0 && (
                  <div
                    className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto z-50 transition-all duration-200 ease-in-out"
                    style={{
                      opacity: showResults ? 1 : 0,
                      transform: showResults
                        ? "translateY(0)"
                        : "translateY(-10px)",
                    }}
                  >
                    {filteredServices.map((service, index) => (
                      <Link
                        href={
                          service.isActive
                            ? `/user/${hotelId}/services/${service._id}`
                            : "#"
                        }
                        key={index}
                        className={`flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors duration-150 ${
                          !service.isActive
                            ? "opacity-60 cursor-not-allowed bg-gray-50"
                            : ""
                        }`}
                        onClick={(e) => {
                          if (!service.isActive) {
                            e.preventDefault();
                            return;
                          }
                          setShowResults(false);
                        }}
                      >
                        <div
                          className={`w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0 ${
                            !service.isActive ? "grayscale" : ""
                          }`}
                        >
                          <img
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${service.serviceImage}`}
                            alt={service.serviceName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4
                              className={`font-medium text-sm ${
                                !service.isActive ? "text-gray-500" : ""
                              }`}
                            >
                              {service.serviceName}
                            </h4>
                            {!service.isActive && (
                              <span className="ml-2 text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">
                                Inactive
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-xs ${
                              !service.isActive
                                ? "text-gray-400"
                                : "text-gray-500"
                            } truncate`}
                          >
                            {service.serviceDesc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile search toggle button */}
              <button
                onClick={toggleMobileSearch}
                className="p-2 md:hidden transition-transform duration-200 hover:scale-110"
              >
                <Search className="h-6 w-6" />
                <span className="sr-only">Search</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
