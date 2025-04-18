"use client";

import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import SubCategoryForm from "./_components/subCategory-form";
import SubCategoryTable from "./_components/subCategory-table";
import { toast } from "sonner";
import { fetchWithAuth } from "@/app/manager/_lib/fetch-with-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubCategory {
  _id: string;
  subCategoryName: string;
  subCategoryDesc: string;
  time: string;
  isActive: boolean;
  updatedAt: string;
  hotelId: string;
  categoryId: string;
}

export default function Page({
  params,
}: {
  params: { service: string; category: string };
}) {
  const [fetchedSubCategories, setFetchedSubCategories] = useState<
    SubCategory[]
  >([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [editingSubCategoryId, setEditingSubCategoryId] = useState<
    string | undefined
  >(undefined);
  const [fetchedCategories, setFetchedCategories] = useState<any[]>([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [filteredSubCategories, setFilteredSubCategories] = useState<
    SubCategory[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  // Get the name of the selected service
  const getSelectedCategoryName = () => {
    if (!selectedCategoryId) return "All categories";

    const selectedCategory = fetchedCategories.find(
      (category) => category._id === selectedCategoryId
    );
    return selectedCategory ? selectedCategory.categoryName : "All categories";
  };

  // fetch categories for filtering and form
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-categories`
        );

        const data = await res.json();
        if (res.ok && Array.isArray(data.categories)) {
          setFetchedCategories(data.categories);
        }

        setIsCategoryLoading(false);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Failed to fetch services");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-subCategories`
        );

        const data = await res.json();
        console.log(data)
        if (res.ok && Array.isArray(data.subCategories)) {
          setFetchedSubCategories(data.subCategories);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching subCategories:", error);
        toast.error("Failed to fetch subCategories");
      }
    };

    fetchSubCategories();
  }, []);

  console.log("fetchedSubCategories", fetchedSubCategories);
  console.log("fetchedCategories", fetchedCategories);

  // Filter categories based on search term
  useEffect(() => {
    let filtered = fetchedSubCategories;

    if (selectedCategoryId && selectedCategoryId === "all") {
      filtered = fetchedSubCategories;
    }
    if (selectedCategoryId && selectedCategoryId != "all") {
      filtered = filtered.filter(
        (subCategory) => subCategory.categoryId === selectedCategoryId
      );
    }
    if (searchTerm) {
      filtered = filtered.filter((subCategory) =>
        subCategory.subCategoryName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSubCategories(filtered.sort((a, b) => Number(b.isActive) - Number(a.isActive)));
  }, [searchTerm, selectedCategoryId, fetchedSubCategories]);

  // Toggle active status
  const toggleActive = async (subCategoryId: string) => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/toggle-subCategory-availability/${subCategoryId}`,
        { method: "PUT" }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.message || "Failed to toggle category availability"
        );

      setFetchedSubCategories((prev) =>
        prev.map((subCategory) =>
          subCategory._id === subCategoryId
            ? { ...subCategory, isActive: !subCategory.isActive }
            : subCategory
        )
      );

      toast.success("Sub Category availability updated successfully");
    } catch (error) {
      console.error("Error toggling subCategory availability:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update subCategory"
      );

      setFetchedSubCategories((prev) =>
        prev.map((subCategory) =>
          subCategory._id === subCategoryId
            ? { ...subCategory, isActive: !subCategory.isActive }
            : subCategory
        )
      );
    }
  };

  const handleCreateSubCategory = async (formData: any) => {
    try {
      console.log(formData)
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/create-subCategory`,
        {
          method: "POST",
          body: JSON.stringify({
            subCategoryName: formData.subCategoryName,
            subCategoryDesc: formData.subCategoryDesc,
            time: formData.time,
            categoryId: formData.categoryId,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create subCategory");

      setFetchedSubCategories((prev) => [...prev, { ...data.SubCategory }]);
      setShowAddForm(false);
      toast.success("Sub Category created successfully");
    } catch (error) {
      console.error("Error creating Sub Category:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create subCategory"
      );
    }
  };

  const handleEditSubCategory = async (formData: any, subCategoryId: string) => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/edit-subCategory/${subCategoryId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            subCategoryName: formData.subCategoryName,
            subCategoryDesc: formData.subCategoryDesc,
            time: formData.time,
            categoryId: formData.categoryId,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update subCategory");

      setFetchedSubCategories((prev) =>
        prev.map((subCategory) =>
          subCategory._id === subCategoryId
            ? { ...subCategory, ...data.subCategory }
            : subCategory
        )
      );

      setShowAddForm(false);
      setEditingSubCategoryId(undefined);
      toast.success("Sub Category updated successfully");
    } catch (error) {
      console.error("Error updating Sub Category:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update subCategory"
      );
    }
  };

  const handleEditForm = async (categoryId) => {
    setEditingSubCategoryId(categoryId);
    setShowAddForm(true);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Page header section */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            All Sub-Categories
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and organize all subcategories from here
          </p>
        </div>

        {/* Search and actions bar */}
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search Sub Categories..."
              value={searchTerm}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
          </div>

          {/* Service Dropdown */}
          <Select
            value={selectedCategoryId}
            onValueChange={setSelectedCategoryId}
          >
            <SelectTrigger className="w-72">
              <SelectValue placeholder="Select a category">
                {getSelectedCategoryName()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {/* Change value="" to value="all" */}
              <SelectItem value="all">All Categories</SelectItem>
              {isCategoryLoading ? (
                <SelectItem value="loading" disabled>
                  Loading categories...
                </SelectItem>
              ) : (
                fetchedCategories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.categoryName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              Bulk Upload
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
            >
              Add New SubCategory
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <SubCategoryTable
        subCategories={filteredSubCategories}
        toggleActive={toggleActive}
        onManageSubCategory={handleEditForm}
        isLoading={isLoading}
        fetchedCategories={fetchedCategories}
        isCategoryLoading={isCategoryLoading}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />

      {showAddForm && (
        <SubCategoryForm
        onCloseAction={() => {
          setShowAddForm(false);
          setEditingSubCategoryId(undefined);
        }}
        onCreateAction={handleCreateSubCategory}
        onEditAction={handleEditSubCategory}
        subCategoryId={editingSubCategoryId}
        fetchedCategories={fetchedCategories}
        isCategoryLoading={isCategoryLoading}        />
      )}
    </div>
  );
}
