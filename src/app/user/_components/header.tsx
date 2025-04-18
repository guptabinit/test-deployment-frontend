"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useSidebar } from "./sidebar-provider";
import { Skeleton } from "@/components/ui/skeleton";

export function Header({
  hotelId,
  hotelLogo,
  isLogoLoaded,
}: {
  hotelId: string;
  hotelLogo: string;
  isLogoLoaded: boolean;
}) {
  const { toggle } = useSidebar();

  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="relative h-16 shadow-sm">
        {/* Menu button - absolute positioned to not affect centering */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <button onClick={toggle} className="p-2">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>

        {/* Logo - centered regardless of screen size */}
        <div className="flex h-full w-full items-center justify-center">
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
      </div>
    </header>
  );
}
