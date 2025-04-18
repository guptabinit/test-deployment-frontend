"use client";

import { useState } from "react";
import type { Service } from "@/types/menu/Services";
import { Clock, Utensils, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useHotelDataStore } from "@/stores/user/hotelDataStore";

export interface ServiceCardProps {
  service: Service;
  hotelId: string;
}

export function ServiceCard({ service, hotelId }: ServiceCardProps) {
  const [descExpanded, setDescExpanded] = useState(false);

  const { customization } = useHotelDataStore();

  const colors = {
    primary: customization?.hotelColors?.primary || "#8B5A2B",
    secondary: customization?.hotelColors?.secondary || "#F3F4F6",
    tertiary: customization?.hotelColors?.tertiary || "#FEF3C7",
    textColor: customization?.hotelColors?.textColor || "#374151",
  };

  const primaryDarker = adjustColorBrightness(colors.primary, -15);

  // Toggle the expanded state on click
  const toggleDescription = () => {
    setDescExpanded(!descExpanded);
  };

  // Check if service is inactive
  const isInactive = service.isActive === false;

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white ${
        isInactive ? "opacity-75" : ""
      }`}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${service.serviceImage}`}
          alt={service.serviceName}
          className={`object-cover w-full h-full ${
            isInactive ? "grayscale" : ""
          }`}
          loading="lazy"
        />
        {service.isFood && (
          <div
            className="absolute top-2 right-2 p-1 rounded-md flex items-center gap-1"
            style={{
              backgroundColor: colors.tertiary,
              color: colors.primary,
            }}
          >
            <Utensils className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Food</span>
          </div>
        )}

        {isInactive && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-200 bg-opacity-40 flex items-center justify-center">
            <div className="bg-white bg-opacity-90 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <AlertCircle className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">
                Inactive
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex justify-between items-start">
          <h3
            className={`mb-1 font-medium ${isInactive ? "text-gray-500" : ""}`}
            style={!isInactive ? { color: colors.textColor } : {}}
          >
            {service.serviceName}
          </h3>
          {isInactive && (
            <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">
              Inactive
            </span>
          )}
        </div>
        <p
          className={`mb-2 text-sm cursor-pointer ${
            isInactive ? "text-gray-400" : ""
          }`}
          style={
            !isInactive
              ? {
                  color: adjustColorBrightness(colors.textColor, 20),
                  ...(!descExpanded
                    ? {
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }
                    : {}),
                }
              : {
                  ...(!descExpanded
                    ? {
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }
                    : {}),
                }
          }
          onClick={toggleDescription}
        >
          {service.serviceDesc}
        </p>
        {service.time && (
          <div className="flex items-center gap-1 mb-3">
            <Clock
              className={`h-3.5 w-3.5 ${isInactive ? "text-gray-400" : ""}`}
              style={
                !isInactive
                  ? { color: adjustColorBrightness(colors.textColor, 30) }
                  : {}
              }
            />
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                isInactive ? "bg-gray-100 text-gray-500" : ""
              }`}
              style={
                !isInactive
                  ? {
                      backgroundColor: colors.secondary,
                      color: adjustColorBrightness(colors.textColor, 10),
                    }
                  : {}
              }
            >
              {service.time}
            </span>
          </div>
        )}
        {isInactive ? (
          <button
            disabled
            className="mt-auto block rounded py-2 text-center text-xs font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
          >
            Unavailable
          </button>
        ) : (
          <Link
            href={`/user/${hotelId}/services/${service._id}`}
            className="mt-auto block rounded py-2 text-center text-xs font-medium transition-colors hover:opacity-90"
            style={{
              backgroundColor: colors.primary,
              color: "white",
            }}
          >
            View All
          </Link>
        )}
      </div>
    </div>
  );
}

// Helper function to adjust color brightness
function adjustColorBrightness(hex: string, percent: number): string {
  // Convert hex to RGB
  let r = Number.parseInt(hex.substring(1, 3), 16);
  let g = Number.parseInt(hex.substring(3, 5), 16);
  let b = Number.parseInt(hex.substring(5, 7), 16);

  // Adjust brightness
  r = Math.max(0, Math.min(255, r + (r * percent) / 100));
  g = Math.max(0, Math.min(255, g + (g * percent) / 100));
  b = Math.max(0, Math.min(255, b + (b * percent) / 100));

  // Convert back to hex
  return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g)
    .toString(16)
    .padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
}
