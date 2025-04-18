"use client";

import { Category } from "@/types/menu/Categories";
import { Service } from "@/types/menu/Services";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Item } from "@/types/menu/Items"; // Adjust the import path as needed
import Link from "next/link";
import { ItemHeader } from "@/app/user/_components/home/item-header";
import { useHotelDataStore } from "@/stores/user/hotelDataStore";

interface MenuHeaderProps {
  service: Service | undefined;
  category: Category | undefined;
  currentCategoryIndex: number;
  totalCategoryCount: number;
  hotelId: string;
  onPrevMenu: () => void;
  onNextMenu: () => void;
  items: Item[];
  serviceId: string;
}

export function MenuHeader({
  service,
  category,
  currentCategoryIndex,
  totalCategoryCount,
  hotelId,
  onPrevMenu,
  onNextMenu,
  items,
  serviceId,
}: MenuHeaderProps) {
  const { customization } = useHotelDataStore();

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center bg-white px-4 py-3 border-b shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href={`/user/${hotelId}`}
            className="text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-md font-medium">{service?.serviceName}</h1>
            {/* <p className="text-sm text-gray-500">{service?.time}</p> */}
          </div>
        </div>
      </div>

      {/* Menu Navigation */}
      <div
        className="sticky top-[65px] z-20 px-4 py-3 border-b shadow-sm backdrop-blur-sm bg-white/70"
      >
        <div className="flex items-center justify-between relative">
          {/* Left arrow */}
          <div className="absolute left-0">
            {currentCategoryIndex != 0 ? (
              <button
                onClick={onPrevMenu}
                className="p-1 hover:bg-gray-100/80 rounded-full transition-colors"
                aria-label="Previous menu"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
            ) : (
              <div className="w-7" />
            )}
          </div>

          {/* Centered category info */}
          <div className="flex-1 text-center mx-auto">
            <h2 className="text-lg font-medium">{category?.categoryName}</h2>
            <p className="text-xs text-gray-500">{category?.time}</p>
          </div>

          {/* Right arrow */}
          <div className="absolute right-0">
            {currentCategoryIndex != totalCategoryCount - 1 ? (
              <button
                onClick={onNextMenu}
                className="p-1 hover:bg-gray-100/80 rounded-full transition-colors"
                aria-label="Next menu"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            ) : (
              <div className="w-7" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
