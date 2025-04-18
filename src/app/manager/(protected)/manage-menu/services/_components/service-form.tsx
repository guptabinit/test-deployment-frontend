"use client";

import { useState, useEffect } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { z } from "zod";
import { fetchWithAuth } from "@/app/manager/_lib/fetch-with-auth";

// Match the backend schema exactly
const serviceFormSchema = z.object({
  serviceName: z.string().min(1, "Service name is required."),
  serviceDesc: z.string().min(1, "Service description is required."),
  serviceImage: z.instanceof(File).nullable().optional(),
  previewUrl: z.string().optional(),
  time: z.string().min(1, "Service time is required."),
  isFood: z.boolean().default(false),
});

type ServiceFormData = z.infer<typeof serviceFormSchema>;

type CreateServiceFormProps = {
  onCloseAction: () => void;
  onCreateAction: (data: any) => void;
  onEditAction: (data: any, serviceId?: string) => void; // Optional edit action
  serviceId?: string; // Optional service ID for editing
};

const ServiceForm = ({
  onCloseAction,
  onCreateAction,
  onEditAction,
  serviceId,
}: CreateServiceFormProps) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    serviceName: "",
    serviceDesc: "",
    serviceImage: null as File | null,
    previewUrl: "",
    time: "24/7",
    isFood: false,
  });

  const [loading, setLoading] = useState(false);

  // Fetch service data if serviceId is provided (Edit Mode)
  useEffect(() => {
    if (serviceId) {
      const fetchServiceData = async () => {
        setLoading(true);
        try {
          const res = await fetchWithAuth(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-service-data/${serviceId}`
          );
          const data = await res.json();
          
          if (data.status == 200 && data.services) {
            // Fetch the image and convert it to a blob
            const imageResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}${data.services.serviceImage}`
            );
            if (!imageResponse.ok) {
              toast.error("Can't preview service image");
            }
            const blob = await imageResponse.blob();
      
            // If you need a File object, create one from the blob
            const file = new File([blob], "serviceImage.webp", { type: blob.type });
      
            // Update state in one call to avoid overwriting
            setFormData(prevFormData => ({
              ...prevFormData,
              serviceName: data.services.serviceName || "",
              serviceDesc: data.services.serviceDesc || "",
              time: data.services.time || "24/7",
              isFood: data.services.isFood || false,
              // Use the file if you need a File, otherwise you can use blob
              serviceImage: file, // or simply blob if File is not strictly required
              previewUrl: URL.createObjectURL(blob),
            }));
          }
        } catch (error) {
          console.error("Error fetching service data:", error);
          toast.error("Error loading service details");
        }
        setLoading(false);
      };

      fetchServiceData();
    }
  }, [serviceId]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data against schema
      const validatedData = serviceFormSchema.parse(formData);
      await onCreateAction(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Validation Error", {
          description: error.errors[0].message,
        });
      } else {
        toast.error("An error occurred while saving the service");
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data against schema
      const validatedData = serviceFormSchema.parse(formData);
      await onEditAction(validatedData, serviceId);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Validation Error", {
          description: error.errors[0].message,
        });
      } else {
        toast.error("An error occurred while saving the service");
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        serviceImage: file,
        previewUrl: URL.createObjectURL(file),
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-[600px] max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {serviceId ? "Edit Service" : "Create New Service"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCloseAction}>
            <FiX size={20} />
          </Button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">
            Loading service details...
          </p>
        ) : (
          <form
            onSubmit={serviceId ? handleEditSubmit : handleCreateSubmit}
            className="w-full"
          >
            <div className="space-y-4">
              {/* Image Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {formData.previewUrl ? (
                  <div className="relative">
                    <img
                      src={`${formData.previewUrl}` || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded"
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          serviceImage: null,
                          previewUrl: "",
                        })
                      }
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                    >
                      <FiX size={16} />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="service-image"
                    />
                    <label
                      htmlFor="service-image"
                      className="flex flex-col items-center gap-2 cursor-pointer"
                    >
                      <FiUpload size={24} className="text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Upload Service Image
                      </span>
                    </label>
                  </div>
                )}
              </div>

              <div>
                <Label>Service Name *</Label>
                <Input
                  required
                  value={formData.serviceName}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceName: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Service Description *</Label>
                <Input
                  required
                  value={formData.serviceDesc}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceDesc: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Time *</Label>
                <Input
                  required
                  placeholder="eg., 24/7 or 9:00 AM - 9:00 PM"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Is Food Service?</Label>
                <Switch
                  checked={formData.isFood}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isFood: checked })
                  }
                />
              </div>

              <Button type="submit">Submit</Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ServiceForm;
