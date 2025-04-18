"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import { SubcategoriesPopover } from "./SubcategoriesPopover";
import type { SubCategory } from "@/types/menu/SubCategories";
import type { Customization } from "@/types/Customization";

interface SubCategoryTabsProps {
  subCategories: SubCategory[] | undefined;
  activeSubCategory: SubCategory | undefined;
  isLoading: boolean;
  onSubCategorySelect: (subCategory: SubCategory) => void;
  onPopupToggle: () => void;
  customization: Customization | undefined;
  onScroll: (id: string) => void;
  vegNonVegFilter?: string;
  onVegNonVegChange?: (value: string) => void;
  priceSort?: string;
  onPriceSortChange?: (value: string) => void;
  selectedTag?: string;
  onTagChange?: (value: string) => void;
  tags?: any[];
  showVegFilter?: boolean;
}

export function SubCategoryTabs({
  subCategories,
  activeSubCategory,
  isLoading,
  onSubCategorySelect,
  onPopupToggle,
  customization,
  onScroll,
  vegNonVegFilter,
  onVegNonVegChange,
  priceSort,
  onPriceSortChange,
  selectedTag,
  onTagChange,
  tags,
  showVegFilter,
}: SubCategoryTabsProps) {
  const [showPopover, setShowPopover] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const visibleSubCategories = subCategories?.slice(0, 4);
  const remainingCount = subCategories
    ? Math.max(0, subCategories.length - 4)
    : 0;

  // Safely access colors with fallbacks
  const primaryColor = customization?.hotelColors?.primary || "#111827";
  const secondaryColor = customization?.hotelColors?.secondary || "#f3f4f6";
  const tertiaryColor = customization?.hotelColors?.tertiary || "#d1d5db";
  const textColor = customization?.hotelColors?.textColor || "#374151";
  const backgroundColor =
    customization?.hotelColors?.backgroundColor || "#ffffff";

  const tabsRef = useRef<HTMLDivElement>(null);

  const scrollToSubCategory = (id: string) => {
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleTabClick = (subCategory: SubCategory) => {
    onScroll(subCategory._id);
    onSubCategorySelect(subCategory);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="w-full">
      {/* Subcategories with menu button */}
      <div className="w-full">
        <div className="overflow-x-auto hide-scrollbar">
          <div ref={tabsRef} className="flex space-x-2 px-2 py-2 items-center">
            {/* Menu Icon Button */}
            <button
              onClick={() => setShowPopover(true)}
              className="p-1.5 rounded-full hover:bg-gray-100 flex-shrink-0"
              style={{ color: customization?.hotelColors?.primary }}
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Existing subcategory buttons */}
            {visibleSubCategories?.map((subCategory) => (
              <motion.button
                key={subCategory.subCategoryName}
                onClick={() => handleTabClick(subCategory)}
                className="px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors"
                style={{
                  backgroundColor:
                    subCategory._id === activeSubCategory?._id
                      ? primaryColor
                      : `${secondaryColor}50`,
                  color:
                    subCategory._id === activeSubCategory?._id
                      ? "#ffffff"
                      : textColor,
                }}
                whileTap={{ scale: 0.95 }}
              >
                {subCategory.subCategoryName}
              </motion.button>
            ))}

            {/* Remove the "+X more" button since we now have the menu icon */}
          </div>
        </div>
      </div>

      {/* Subcategories Popover */}
      <SubcategoriesPopover
        isOpen={showPopover}
        onClose={() => setShowPopover(false)}
        subCategories={subCategories || []}
        activeSubCategory={activeSubCategory}
        onSubCategorySelect={(subCategory) => {
          handleTabClick(subCategory);
          setShowPopover(false);
        }}
        customization={customization}
      />

      {/* Mobile-only filters */}
      <div className="md:hidden border-t">
        {/* Filters header */}
        <div
          className="px-4 py-2.5 flex justify-between items-center cursor-pointer"
          onClick={toggleFilters}
          style={{ color: primaryColor }}
        >
          <div className="font-medium flex items-center">Filters</div>
          {showFilters ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </div>

        {/* Collapsible filter options */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              key="filters-container"
              className="px-4 py-2 space-y-2 border-t overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {showVegFilter && (
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Food Type</label>
                  <select
                    value={vegNonVegFilter}
                    onChange={(e) => onVegNonVegChange?.(e.target.value)}
                    className="max-w-80 border rounded mx-2 px-2 py-1.5 text-sm"
                  >
                    <option value="all">All Items</option>
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Egg">Egg</option>
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs text-gray-500">Sort By</label>
                <select
                  value={priceSort}
                  onChange={(e) => onPriceSortChange?.(e.target.value)}
                  className="max-w-80 border rounded mx-2 px-2 py-1.5 text-sm"
                >
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-500">Filter By Tag</label>
                <select
                  value={selectedTag}
                  onChange={(e) => onTagChange?.(e.target.value)}
                  className="max-w-80 border rounded mx-2 px-2 py-1.5 text-sm"
                >
                  <option value="all">All Tags</option>
                  {tags?.map((tag) => (
                    <option key={tag._id} value={tag.tagName}>
                      {tag.tagName}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
