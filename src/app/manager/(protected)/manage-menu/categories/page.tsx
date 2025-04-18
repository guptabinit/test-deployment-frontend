"use client";

import { useState, useEffect, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import CategoryTable from "./_components/category-table";
import CategoryForm from "./_components/category-form";
import { fetchWithAuth } from "@/app/manager/_lib/fetch-with-auth";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types/menu/Categories";

export default function CategoriesPage({
  params,
}: {
  params: { service: string };
}) {
  const [fetchedCategories, setFetchedCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const itemsPerPage = 6;
  const [editingCategoryId, setEditingCategoryId] = useState<
    string | undefined
  >(undefined);
  const [fetchedServices, setFetchedServices] = useState<any[]>([]);
  const [isServiceLoading, setIsServiceLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  // Get the name of the selected service
  const getSelectedServiceName = () => {
    if (!selectedServiceId) return "All services";

    const selectedService = fetchedServices.find(
      (service) => service._id === selectedServiceId
    );
    return selectedService ? selectedService.serviceName : "All services";
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-services`
        );

        const data = await res.json();
        if (res.ok && Array.isArray(data.services)) {
          setFetchedServices(data.services);
        }

        setIsServiceLoading(false);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Failed to fetch services");
      }
    };

    fetchServices();
  }, []);

  // Simulate loading category data
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

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Failed to fetch services");
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on search term
  useEffect(() => {
    let filtered = fetchedCategories;

    if (selectedServiceId && selectedServiceId === "all") {
      filtered = fetchedCategories;
    }
    if (selectedServiceId && selectedServiceId != "all") {
      filtered = filtered.filter(
        (category) => category.serviceId === selectedServiceId
      );
    }
    if (searchTerm) {
      filtered = filtered.filter((category) =>
        category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCategories(
      filtered.sort((a, b) => Number(b.isActive) - Number(a.isActive))
    );
  }, [searchTerm, selectedServiceId, fetchedCategories]);

  // Toggle active status
  const toggleActive = async (categoryId: string) => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/toggle-category-availability/${categoryId}`,
        { method: "PUT" }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.message || "Failed to toggle category availability"
        );

      setFetchedCategories((prev) =>
        prev.map((category) =>
          category._id === categoryId
            ? { ...category, isActive: !category.isActive }
            : category
        )
      );

      toast.success("Category availability updated successfully");
    } catch (error) {
      console.error("Error toggling category availability:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update category"
      );

      setFetchedCategories((prev) =>
        prev.map((category) =>
          category._id === categoryId
            ? { ...category, isActive: !category.isActive }
            : category
        )
      );
    }
  };

  const handleCreateCategory = async (formData: any) => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/create-category`,
        {
          method: "POST",
          body: JSON.stringify({
            categoryName: formData.categoryName,
            categoryDesc: formData.categoryDesc,
            time: formData.time,
            serviceId: formData.serviceId,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create category");

      setFetchedCategories((prev) => [...prev, { ...data.category }]);
      setShowAddForm(false);
      toast.success("Category created successfully");
    } catch (error) {
      console.error("Error creating Category:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create category"
      );
    }
  };

  const handleEditCategory = async (formData: any, categoryId: string) => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/edit-category/${categoryId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            categoryName: formData.categoryName,
            categoryDesc: formData.categoryDesc,
            time: formData.time,
            serviceId: formData.serviceId,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update Category");

      setFetchedCategories((prev) =>
        prev.map((category) =>
          category._id === categoryId
            ? { ...category, ...data.category }
            : category
        )
      );

      setShowAddForm(false);
      setEditingCategoryId(undefined);
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Error updating Category:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update category"
      );
    }
  };

  const handleEditForm = async (categoryId) => {
    setEditingCategoryId(categoryId);
    setShowAddForm(true);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Page header section */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">All Categories</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and organize all your categories from here
        </p>
      </div>

      {/* Search and actions bar */}
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search categories..."
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
        <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
          <SelectTrigger className="w-72">
            <SelectValue placeholder="Select a service">
              {getSelectedServiceName()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {/* Change value="" to value="all" */}
            <SelectItem value="all">All services</SelectItem>
            {isServiceLoading ? (
              <SelectItem value="loading" disabled>
                Loading services...
              </SelectItem>
            ) : (
              fetchedServices.map((service) => (
                <SelectItem key={service._id} value={service._id}>
                  {service.serviceName}
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
            Add New Category
          </button>
        </div>
      </div>

      {/* Categories table */}
      <CategoryTable
        categories={filteredCategories}
        toggleActive={toggleActive}
        onManageCategory={handleEditForm}
        isLoading={isLoading}
        fetchedServices={fetchedServices}
        isServiceLoading={isServiceLoading}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />

      {showAddForm && (
        <CategoryForm
          onCloseAction={() => {
            setShowAddForm(false);
            setEditingCategoryId(undefined);
          }}
          onCreateAction={handleCreateCategory}
          onEditAction={handleEditCategory}
          categoryId={editingCategoryId}
          fetchedServices={fetchedServices}
          isServiceLoading={isServiceLoading}
        />
      )}
    </div>
  );
}
