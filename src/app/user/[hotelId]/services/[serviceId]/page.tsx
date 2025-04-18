"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "../../../_components/sidebar";
import { AnimatePresence } from "framer-motion";
import { useMobile } from "../../../../../hook/use-mobile";
import { MenuHeader } from "@/components/menu/MenuHeader";
import { SubCategoryTabs } from "@/components/menu/CategoryTabs";
import { SubCategoryPopup } from "@/components/menu/CategoryPopup";
import { MenuCategories } from "@/components/menu/MenuCategories";
import { LoadingMenuItems } from "@/components/menu/LoadingMenuItems";
import { FooterDisclaimer } from "@/components/menu/FooterDisclaimer";
import { useHotelDataStore } from "@/stores/user/hotelDataStore";
import { Category } from "@/types/menu/Categories";
import { SubCategory } from "@/types/menu/SubCategories";
import { ItemHeader } from "@/app/user/_components/item-header";
import { Tag } from "@/types/Tag";
import { FoodItemPopup } from "@/components/menu/item-popup";
import { Item } from "@/types/menu/Items";

export default function page({
  params,
}: {
  params: { hotelId: string; serviceId: string };
}) {
  const {
    services,
    categories,
    subCategories,
    items,
    tags,
    customization,
    aboutHotel,
    isCustomizationLoaded,
    isMenuLoaded,
  } = useHotelDataStore();

  const [activeCategory, setActiveCategory] = useState<Category>();
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategory>();
  const [expandedSubCategory, setExpandedSubCategory] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");

  const [priceRange, setPriceRange] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMobile();
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
  const [vegNonVegFilter, setVegNonVegFilter] = useState<"all" | "Veg" | "Non-Veg" | "Egg">("all");
  const [priceSort, setPriceSort] = useState<"asc" | "desc">("asc");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item>({} as Item);

  const categoriesOfService = categories.filter(
    (category) => category.serviceId === params.serviceId
  );

  const currentService = services.find((s) => s._id === params.serviceId);

  const subCategoriesOfService = subCategories.filter(
    (subCategory) =>
      subCategory.categoryId === categoriesOfService[activeCategoryIndex]?._id
  );

  const toggleCategoryPopup = () => {
    setIsCategoryPopupOpen(!isCategoryPopupOpen);
  };

  useEffect(() => {
    if (isMenuLoaded) {
      setActiveCategory(categoriesOfService[activeCategoryIndex]);
      const firstSubCategory = subCategories.find(
        (s) => s.categoryId === categoriesOfService[activeCategoryIndex]?._id
      );
      setActiveSubCategory(firstSubCategory);
      setExpandedSubCategory([firstSubCategory]);
    }
  }, [isMenuLoaded]);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isMenuLoaded]);

  const handleNextMenu = () => {
    const nextIndex =
      (categoriesOfService.length + 1) % categoriesOfService.length;
    setActiveCategoryIndex(nextIndex);
    const firstSubCategory = subCategories.find(
      (s) => s.categoryId === categoriesOfService[nextIndex]._id
    );
    setActiveSubCategory(firstSubCategory);
    setExpandedSubCategory([firstSubCategory]);
  };

  const handlePrevMenu = () => {
    const prevIndex = (categories.length - 1) % categories.length;
    setActiveCategoryIndex(prevIndex);
    const firstSubCategory = subCategories.find(
      (s) => s.categoryId === categories[prevIndex]._id
    );
    setActiveSubCategory(firstSubCategory);
    setExpandedSubCategory([firstSubCategory]);
  };

  const toggleSubCategory = (subCategory: SubCategory) => {
    if (expandedSubCategory.includes(subCategory)) {
      setExpandedSubCategory(
        expandedSubCategory.filter((sub) => sub._id !== subCategory._id)
      );
    } else {
      setExpandedSubCategory([...expandedSubCategory, subCategory]);
    }
  };

  const getFilteredItems = (categoryId: string, subCategoryId?: string) => {
    if (!categoryId) return [];
    
    let filteredItems = items.filter((item) => {
      const categoryMatch = item.categoryId === categoryId;
      const subCategoryMatch = !subCategoryId || item.subCategoryId === subCategoryId;
      const vegNonVegMatch = vegNonVegFilter === "all" || item.vegNonVeg === vegNonVegFilter;
      const tagMatch = selectedTag === "all" || item.tags.includes(selectedTag);
      
      return categoryMatch && subCategoryMatch && vegNonVegMatch && tagMatch;
    });

    // Sort by price
    return filteredItems.sort((a, b) => {
      return priceSort === "asc" ? a.price - b.price : b.price - a.price;
    });
  };

  // Handle category selection
  const handleSubCategorySelect = (subCategory: SubCategory) => {
    setActiveSubCategory(subCategory);
    // Make sure the selected category is expanded
    if (!expandedSubCategory.includes(subCategory)) {
      setExpandedSubCategory([...expandedSubCategory, subCategory]);
    }
    setIsCategoryPopupOpen(false);
  };

  const shouldShowVegFilter = items.some(item => 
    item.categoryId === activeCategory?._id && item.isFood
  );

  const handleSectionInView = (sectionId: string) => {
    setActiveSection(sectionId);
    const subCategory = subCategories.find(sub => sub._id === sectionId);
    if (subCategory) {
      setActiveSubCategory(subCategory);
    }
  };

  const handleSubCategoryScroll = (id: string) => {
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleResetFilters = () => {
    setPriceRange("all");
    setVegNonVegFilter("all");
    setPriceSort("asc");
    setSelectedTag("all");
    // Force re-render of filtered items
    setExpandedSubCategory([...expandedSubCategory]);
  };

  const handleTagChange = (value: string) => {
    setSelectedTag(value);
    // Force re-render of filtered items
    setExpandedSubCategory([...expandedSubCategory]);
  };

  if (!isCustomizationLoaded || !isMenuLoaded) {
    return <LoadingMenuItems />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ItemHeader
        hotelId={params.hotelId}
        items={items}
        serviceId={params.serviceId}
        hotelLogo={customization?.hotelLogo as string}
        isLogoLoaded={true}
      />
      {!isMobile && <Sidebar />}

      <main className="flex-1">
        <MenuHeader
          service={currentService}
          category={categoriesOfService.find(
            (c) => c.categoryName === activeCategory?.categoryName
          )}
          currentCategoryIndex={activeCategoryIndex}
          totalCategoryCount={categoriesOfService.length}
          hotelId={params.hotelId}
          onPrevMenu={handlePrevMenu}
          onNextMenu={handleNextMenu}
          items={items}
          serviceId={params.serviceId}
        />

        <div className="flex flex-col">
          <div className="bg-white shadow-sm">
            {/* Desktop view */}
            <div className="hidden md:flex items-center justify-between px-4 py-2">
              <SubCategoryTabs
                subCategories={subCategoriesOfService}
                activeSubCategory={activeSubCategory}
                isLoading={isLoading}
                onSubCategorySelect={handleSubCategorySelect}
                onPopupToggle={toggleCategoryPopup}
                customization={customization}
                onScroll={handleSubCategoryScroll}
                vegNonVegFilter={vegNonVegFilter}
                onVegNonVegChange={(value) => setVegNonVegFilter(value as any)}
                priceSort={priceSort}
                onPriceSortChange={(value) => setPriceSort(value as "asc" | "desc")}
                selectedTag={selectedTag}
                onTagChange={handleTagChange}
                tags={tags}
                showVegFilter={shouldShowVegFilter}
              />
              {/* Desktop Filters */}
              <div className="flex items-center gap-2">
                {shouldShowVegFilter && (
                  <select 
                    value={vegNonVegFilter}
                    onChange={(e) => setVegNonVegFilter(e.target.value as any)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="all">All Items</option>
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Egg">Egg</option>
                  </select>
                )}
                <select 
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value as "asc" | "desc")}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </select>
                <select 
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="all">All Tags</option>
                  {tags?.map((tag: Tag) => (
                    <option key={tag._id} value={tag.tagName}>
                      {tag.tagName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile view */}
            <div className="md:hidden flex flex-col">
              <SubCategoryTabs
                subCategories={subCategoriesOfService}
                activeSubCategory={activeSubCategory}
                isLoading={isLoading}
                onSubCategorySelect={handleSubCategorySelect}
                onPopupToggle={toggleCategoryPopup}
                customization={customization}
                onScroll={handleSubCategoryScroll}
                vegNonVegFilter={vegNonVegFilter}
                onVegNonVegChange={(value) => setVegNonVegFilter(value as any)}
                priceSort={priceSort}
                onPriceSortChange={(value) => setPriceSort(value as "asc" | "desc")}
                selectedTag={selectedTag}
                onTagChange={handleTagChange}
                tags={tags}
                showVegFilter={shouldShowVegFilter}
              />
              {/* Mobile filters are handled inside SubCategoryTabs */}
            </div>
          </div>
        </div>

        {/* Menu Items - Show active category first */}
        <div className="pb-6">
          {isLoading ? (
            <LoadingMenuItems />
          ) : (
            <MenuCategories
              sortedSubCategories={subCategoriesOfService}
              expandedSubCategories={expandedSubCategory}
              activeSubCategory={activeSubCategory}
              customization={customization}
              activeCategoryId={activeCategory?._id as string}
              toggleSubCategory={toggleSubCategory}
              getFilteredItems={getFilteredItems}
              setPriceRange={setPriceRange}
              onSectionInView={handleSectionInView}
              onResetFilters={handleResetFilters}
              onSelectItem={setSelectedItem}
              onOpenPopup={() => setIsPopupOpen(true)}
            />
          )}
        </div>

        <FoodItemPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        item={selectedItem}
        customization={customization}
      />

        <FooterDisclaimer />
      </main>
    </div>
  );
}
