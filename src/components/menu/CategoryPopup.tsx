"use client";
import { Customization } from "@/types/Customization";
import type { SubCategory } from "@/types/menu/SubCategories";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface SubCategoryPopupProps {
  isOpen: boolean;
  subCategories: SubCategory[];
  activeSubCategory: SubCategory | undefined;
  onClose: () => void;
  onSubCategorySelect: (subCategory: SubCategory) => void;
  customization: Customization;
}

export function SubCategoryPopup({
  isOpen,
  subCategories,
  activeSubCategory,
  onClose,
  onSubCategorySelect,
  customization,
}: SubCategoryPopupProps) {
  if (!isOpen) return null;

  // Safely access colors with fallbacks
  const primaryColor = customization.hotelColors?.primary || "#000000";
  const secondaryColor = customization.hotelColors?.secondary || "#e5e7eb";
  const tertiaryColor = customization.hotelColors?.tertiary || "#6b7280";
  const textColor = customization.hotelColors?.textColor || "#111827";

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto"
        style={{ backgroundColor: "white" }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between p-4"
          style={{ borderBottom: `1px solid ${secondaryColor}30` }}
        >
          <h3 className="font-semibold text-lg" style={{ color: textColor }}>
            All Categories
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-opacity-10"
            style={{
              color: primaryColor,
              backgroundColor: "transparent",
            }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          {subCategories.map((subCategory) => (
            <button
              key={subCategory.subCategoryName}
              onClick={() => onSubCategorySelect(subCategory)}
              className="p-4 text-center rounded-lg transition-colors"
              style={{
                backgroundColor:
                  subCategory === activeSubCategory ? primaryColor : "white",
                color: subCategory === activeSubCategory ? "white" : textColor,
                border: `1px solid ${
                  subCategory === activeSubCategory
                    ? primaryColor
                    : secondaryColor
                }`,
              }}
            >
              {subCategory.subCategoryName}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
