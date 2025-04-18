import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { SubCategory } from "@/types/menu/SubCategories";
import type { Customization } from "@/types/Customization";

interface SubcategoriesPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  subCategories: SubCategory[];
  activeSubCategory: SubCategory | undefined;
  onSubCategorySelect: (subCategory: SubCategory) => void;
  customization: Customization | undefined;
}

export function SubcategoriesPopover({
  isOpen,
  onClose,
  subCategories,
  activeSubCategory,
  onSubCategorySelect,
  customization,
}: SubcategoriesPopoverProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={onClose}
          >
            {/* Centered Popover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg z-50 w-[90%] max-w-lg max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 flex items-center justify-between p-4 border-b bg-white">
                <h3 className="font-medium">All Subcategories</h3>
                <button 
                  onClick={onClose} 
                  className="p-1.5 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto max-h-[60vh]">
                {subCategories.map((subCategory) => (
                  <button
                    key={subCategory._id}
                    onClick={() => onSubCategorySelect(subCategory)}
                    className="p-3 rounded-lg text-left transition-colors hover:bg-gray-50"
                    style={{
                      backgroundColor:
                        subCategory._id === activeSubCategory?._id
                          ? `${customization?.hotelColors?.primary}15`
                          : 'transparent',
                      border: `1px solid ${customization?.hotelColors?.secondary}30`,
                    }}
                  >
                    <span className="text-sm font-medium line-clamp-2">
                      {subCategory.subCategoryName}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
