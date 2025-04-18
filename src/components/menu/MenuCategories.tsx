"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuItem as MenuItemComponent } from "@/components/menu/MenuItem";
import type { SubCategory } from "@/types/menu/SubCategories";
import { Customization } from "@/types/Customization";
import { useMemo } from "react";
import { useEffect, useRef } from 'react';

interface MenuCategoriesProps {
  sortedSubCategories: SubCategory[] | undefined;
  expandedSubCategories: SubCategory[];
  activeSubCategory: SubCategory | undefined;
  activeCategoryId: string;
  toggleSubCategory: (SubCategory: SubCategory) => void;
  getFilteredItems: (categoryId: string, subCategoryId?: string) => any;
  setPriceRange: (range: string) => void;
  customization: Customization | undefined;
  onSectionInView: (id: string) => void;
  onResetFilters: () => void; // Add new prop
  onSelectItem: (item: any) => void;
  onOpenPopup: () => void;
}

export const MenuCategories = ({
  sortedSubCategories,
  expandedSubCategories,
  activeSubCategory,
  activeCategoryId,
  toggleSubCategory,
  getFilteredItems,
  setPriceRange,
  customization,
  onSectionInView,
  onResetFilters,
  onSelectItem,
  onOpenPopup,
}: MenuCategoriesProps) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id.replace('section-', '');
            onSectionInView(sectionId);
          }
        });
      },
      {
        rootMargin: '-20% 0px -80% 0px'
      }
    );

    document.querySelectorAll('[id^="section-"]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [onSectionInView]);

  return (
    <div>
      {sortedSubCategories?.map((subCategory) => {
        const { isExpanded, filteredItems } = useMemo(() => {
          const isExpanded = expandedSubCategories.includes(subCategory);
          const filteredItems = getFilteredItems(
            activeCategoryId,
            subCategory._id as string
          );
          return { isExpanded, filteredItems };
        }, [activeCategoryId, expandedSubCategories, getFilteredItems]);

        return (
          <motion.div
            key={subCategory.subCategoryName}
            id={`section-${subCategory._id}`}
            className="border-b last:border-b-0"
            style={{ borderColor: customization?.hotelColors?.secondary }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              onClick={() => toggleSubCategory(subCategory)}
              className="w-full flex items-center justify-between px-4 py-3 font-semibold uppercase text-sm transition-colors"
              style={{
                backgroundColor:
                  subCategory === activeSubCategory
                    ? `${customization?.hotelColors?.primary}15` // Using hex opacity
                    : `${customization?.hotelColors?.secondary}15`,
                color: customization?.hotelColors?.textColor,
              }}
              whileTap={{ scale: 0.98 }}
            >
              {subCategory.subCategoryName}
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown
                  className="h-5 w-5"
                  style={{ color: customization?.hotelColors?.primary }}
                />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  className="p-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredItems.map((item, index) => (
                      <MenuItemComponent
                        key={index}
                        item={item}
                        index={index}
                        customization={customization}
                        onSelectItem={onSelectItem}
                        onOpenPopup={onOpenPopup}
                      />
                    ))}
                  </div>

                  {filteredItems.length === 0 && (
                    <div className="py-8 text-center">
                      <p
                        style={{ color: customization?.hotelColors?.textColor }}
                      >
                        No items match your current filters.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        style={{
                          borderColor: customization?.hotelColors?.primary,
                          color: customization?.hotelColors?.primary,
                        }}
                        onClick={() => {
                          onResetFilters();
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};
