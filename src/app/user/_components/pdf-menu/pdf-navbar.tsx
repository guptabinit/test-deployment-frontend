"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  customization: any;
  hotelId: string;
};

const PdfNavbar = ({ customization, hotelId }: Props) => {
  // Convert the backgroundColor to a translucent version by adding alpha channel
  const getTranslucentColor = (color: string) => {
    // If color is in hex format (#RRGGBB), convert to rgba
    if (color && color.startsWith("#")) {
      const r = Number.parseInt(color.slice(1, 3), 16);
      const g = Number.parseInt(color.slice(3, 5), 16);
      const b = Number.parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, 0.7)`;
    }
    // If already rgba, adjust opacity
    else if (color && color.startsWith("rgb")) {
      return color.replace("rgb", "rgba").replace(")", ", 0.7)");
    }
    // Fallback
    return color;
  };

  // Get translucent version of primary color for hover
  const getTranslucentPrimary = (color: string) => {
    // If color is in hex format (#RRGGBB), convert to rgba
    if (color && color.startsWith("#")) {
      const r = Number.parseInt(color.slice(1, 3), 16);
      const g = Number.parseInt(color.slice(3, 5), 16);
      const b = Number.parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, 0.9)`;
    }
    // If already rgba, adjust opacity
    else if (color && color.startsWith("rgb")) {
      return color.replace("rgb", "rgba").replace(")", ", 0.9)");
    }
    // Fallback
    return color;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-16 z-30 flex items-center gap-2 px-4 py-3 shadow-sm"
      style={{
        backgroundColor: getTranslucentColor(
          customization?.hotelColors?.backgroundColor
        ),
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)", // For Safari support
      }}
    >
      <Link
        href={`/user/${hotelId}`}
        className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:text-white"
        style={{
          color: customization?.hotelColors?.primary,
          backgroundColor: "transparent",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = getTranslucentPrimary(
            customization?.hotelColors?.primary
          );
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>
      <h1
        className="text-base font-medium"
        style={{ color: customization?.hotelColors?.textColor }}
      >
        View PDF Menu
      </h1>
    </motion.div>
  );
};

export default PdfNavbar;
