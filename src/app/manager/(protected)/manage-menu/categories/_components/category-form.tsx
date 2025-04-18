"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { fetchWithAuth } from "@/app/manager/_lib/fetch-with-auth";
import { z } from "zod";
import { FiX } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categoryFormSchema = z.object({
  categoryName: z.string().min(1, "Category name is required."),
  categoryDesc: z.string().min(1, "Category description is required."),
  time: z.string().min(1, "Catgory time is required."),
  serviceId: z.string().min(1, "Service ID is required."),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

type CreateCategoryFormProps = {
  onCloseAction: () => void;
  onCreateAction: (data: any) => void;
  onEditAction: (data: any, categoryId?: string) => void;
  categoryId?: string;
  fetchedServices: any[];
  isServiceLoading: boolean;
};

const CategoryForm = ({
  onCloseAction,
  onCreateAction,
  onEditAction,
  categoryId,
  fetchedServices,
  isServiceLoading,
}: CreateCategoryFormProps) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: "",
    categoryDesc: "",
    time: "",
    serviceId: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchedCategory, setFetchedCategory] = useState<any>({});

  // Fetch category data if categoryId is provided (Edit Mode)
  useEffect(() => {
    if (categoryId) {
      const fetchCategoryData = async () => {
        setLoading(true);
        try {
          const res = await fetchWithAuth(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-category-data/${categoryId}`
          );

          const data = await res.json();
          if (res.ok && data.category) {
            setFormData({
              categoryName: data.category.categoryName || "",
              categoryDesc: data.category.categoryDesc || "",
              time: data.category.time || "24/7",
              serviceId: data.category.serviceId?._id || "", // Store the service ID instead of name
            });
            setFetchedCategory(data.category);
          } else {
            toast.error("Failed to load category data");
          }
        } catch (error) {
          console.error("Error fetching category data:", error);
          toast.error("Error loading category details");
        }
        setLoading(false);
      };

      fetchCategoryData();
    }
  }, [categoryId]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data against schema
      const validatedData = categoryFormSchema.parse(formData);
      await onCreateAction(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Validation Error", {
          description: error.errors[0].message,
        });
      } else {
        toast.error("An error occurred while saving the category");
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data against schema
      const validatedData = categoryFormSchema.parse(formData);

      await onEditAction(validatedData, categoryId);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Validation Error", {
          description: error.errors[0].message,
        });
      } else {
        toast.error("An error occurred while saving the category");
      }
    }
  };

  // Find the selected service name based on serviceId
  const getSelectedServiceName = () => {
    if (!formData.serviceId) return "Select a service";

    // First check if we're in edit mode and have the fetched category data
    if (categoryId && fetchedCategory?.serviceId?._id === formData.serviceId) {
      return fetchedCategory.serviceId.serviceName;
    }

    // Otherwise look up the service name from fetchedServices
    const selectedService = fetchedServices.find(
      (service) => service._id === formData.serviceId
    );
    return selectedService ? selectedService.serviceName : "Select a service";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="p-6 w-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {categoryId ? "Edit Category" : "Create New Category"}
          </h2>{" "}
          <Button variant="ghost" size="icon" onClick={onCloseAction}>
            <FiX size={20} />
          </Button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">
            Loading category details...
          </p>
        ) : (
          <form
            onSubmit={categoryId ? handleEditSubmit : handleCreateSubmit}
            className="space-y-4"
          >
            <div>
              <Label>Category Name *</Label>
              <Input
                type="text"
                required
                value={formData.categoryName}
                onChange={(e) =>
                  setFormData({ ...formData, categoryName: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Service *</Label>
              <Select
                value={formData.serviceId || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, serviceId: value })
                }
                required
              >
                <SelectTrigger>
                  {/* <SelectValue placeholder="Select a service">
                    {fetchedCategory &&
                    categoryId &&
                    formData.serviceId === fetchedCategory.serviceId?._id
                      ? fetchedCategory.serviceId?.serviceName
                      : null}
                  </SelectValue>{" "} */}
                  <SelectValue placeholder="Select a service">
                    {getSelectedServiceName()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
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
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea
                required
                rows={3}
                value={formData.categoryDesc}
                onChange={(e) =>
                  setFormData({ ...formData, categoryDesc: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Time *</Label>
              <Input
                type="text"
                required
                placeholder="e.g., 9:00-17:00 or 24/7"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="ghost" onClick={onCloseAction}>
                Cancel
              </Button>
              <Button type="submit">
                {categoryId ? "Update Category" : "Create Category"}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default CategoryForm;
