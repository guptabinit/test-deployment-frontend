"use client";

import { useState, useEffect, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { toast } from "sonner";
import ServiceTable from "./_components/service-table";
import ServiceForm from "./_components/service-form";
import { fetchWithAuth } from "@/app/manager/_lib/fetch-with-auth";

interface Service {
  _id: string;
  serviceName: string;
  serviceDesc?: string;
  time: string;
  isActive: boolean;
  isFood: boolean;
  updatedAt: string;
}

export default function Page() {
  const [fetchedServices, setFetchedServices] = useState<Service[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingServiceId, setEditingServiceId] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Failed to fetch services");
      }
    };

    fetchServices();
  }, []);

  // Dynamically filter services as the user types
  const filteredServices = useMemo(() => {
    return fetchedServices
      .filter((service) =>
        service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => Number(b.isActive) - Number(a.isActive));
  }, [searchTerm, fetchedServices]);

  // Toggle Active/Inactive
  const toggleActive = async (serviceId: string) => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/toggle-service-availability/${serviceId}`,
        { method: "PUT" }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.message || "Failed to toggle service availability"
        );

      setFetchedServices((prev) =>
        prev.map((service) =>
          service._id === serviceId
            ? { ...service, isActive: !service.isActive }
            : service
        )
      );

      toast.success("Service availability updated successfully");
    } catch (error) {
      console.error("Error toggling service availability:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update service"
      );

      setFetchedServices((prev) =>
        prev.map((service) =>
          service._id === serviceId
            ? { ...service, isActive: !service.isActive }
            : service
        )
      );
    }
  };

  const handleCreateService = async (formData: any) => {
    try {
      const submitData = new FormData();
      submitData.append("serviceName", formData.serviceName);
      submitData.append("serviceDesc", formData.serviceDesc);
      submitData.append("serviceImage", formData.serviceImage);
      submitData.append("time", formData.time);
      submitData.append("isFood", formData.isFood);

      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/create-service`,
        {
          method: "POST",
          body: submitData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create service");

      setFetchedServices((prev) => [...prev, { ...data.service }]);
      setShowAddForm(false);
      toast.success("Service created successfully");
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create service"
      );
    }
  };

  const handleEditService = async (formData: any, serviceId: string) => {
    try {
      const submitData = new FormData();
      submitData.append("serviceName", formData.serviceName);
      submitData.append("serviceDesc", formData.serviceDesc);
      submitData.append("serviceImage", formData.serviceImage);
      submitData.append("time", formData.time);
      submitData.append("isFood", formData.isFood);

      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/edit-service/${serviceId}`,
        {
          method: "PUT",
          body: submitData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update service");

      // Update the existing service in state instead of adding a new one
      setFetchedServices((prev) =>
        prev.map((service) =>
          service._id === serviceId ? { ...service, ...data.service } : service
        )
      );

      setShowAddForm(false);
      setEditingServiceId(undefined);
      toast.success("Service updated successfully");
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update service"
      );
    }
  };

  // Opens up the form in case of we are editing
  const handleEditForm = async (serviceId) => {
    setEditingServiceId(serviceId);
    setShowAddForm(true);
  };

  // TODO: HANDLE DELETE SERVICE
  const handleDeleteService = async () => {};

  return (
    <div className="space-y-6">
      {/* Page header section */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">All Services</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and organize all your services from here
          </p>
        </div>

        {/* Search and actions bar */}
        <div className="flex items-center justify-between">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              Bulk Upload
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
            >
              Add New Service
            </button>
          </div>
        </div>
      </div>

      {/* Pass the dynamically filtered services */}
      <ServiceTable
        isLoading={isLoading}
        services={filteredServices}
        toggleActive={toggleActive}
        onManageService={handleEditForm}
        onDeleteService={handleDeleteService}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />

      {/* Create service form modal */}
      {showAddForm && (
        <ServiceForm
          onCloseAction={() => {
            setShowAddForm(false);
            setEditingServiceId(undefined);
          }}
          onCreateAction={handleCreateService}
          onEditAction={handleEditService}
          serviceId={editingServiceId}
        />
      )}
    </div>
  );
}
