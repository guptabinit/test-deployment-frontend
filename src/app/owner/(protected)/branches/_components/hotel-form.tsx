"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { fetchWithAuth } from "@/app/owner/_lib/fetch-with-auth";

// Match the backend schema exactly
const hotelFormSchema = z.object({
  hotelName: z.string().min(1, "Hotel name is required."),
  hotelCity: z.string().min(1, "Hotel city is required."),
  hotelState: z.string().min(1, "Hotel state is required."),
  description: z.string().min(1, "Description is required."),
});

type HotelFormData = z.infer<typeof hotelFormSchema>;

type HotelFormProps = {
  onCloseAction: () => void;
  onCreateAction: (data: any) => void;
  onEditAction: (data: any, hotelId?: string) => void; // Optional edit action
  hotelId?: string; // Optional hotel ID for editing
};

const HotelForm = ({
  onCloseAction,
  onCreateAction,
  onEditAction,
  hotelId,
}: HotelFormProps) => {
  const [formData, setFormData] = useState<HotelFormData>({
    hotelName: "",
    hotelCity: "",
    hotelState: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch hotel data if hotelId is provided (Edit Mode)
  useEffect(() => {
    if (hotelId) {
      const fetchHotelData = async () => {
        setLoading(true);
        try {
          const res = await fetchWithAuth(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/owner/fetch-hotel-data/${hotelId}`
          );

          const data = await res.json();
          if (res.ok && data.hotel) {
            setFormData({
              hotelName: data.hotel.hotelName || "",
              hotelCity: data.hotel.hotelCity || "",
              hotelState: data.hotel.hotelState || "",
              description: data.hotel.description || "",
            });
          } else {
            toast.error("Failed to load hotel data");
          }
        } catch (error) {
          console.error("Error fetching hotel data:", error);
          toast.error("Error loading hotel details");
        }
        setLoading(false);
      };

      fetchHotelData();
    }
  }, [hotelId]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data against schema
      const validatedData = hotelFormSchema.parse(formData);

      await onCreateAction(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Validation Error", {
          description: error.errors[0].message,
        });
      } else {
        toast.error("An error occurred while saving the hotel");
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data against schema
      const validatedData = hotelFormSchema.parse(formData);

      await onEditAction(validatedData, hotelId);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Validation Error", {
          description: error.errors[0].message,
        });
      } else {
        toast.error("An error occurred while updating the hotel");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-[600px] max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {hotelId ? "Edit Hotel" : "Create New Hotel"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCloseAction}>
            <FiX size={20} />
          </Button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading hotel details...</p>
        ) : (
          <form
            onSubmit={hotelId ? handleEditSubmit : handleCreateSubmit}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div>
                <Label>Hotel Name *</Label>
                <Input
                  required
                  value={formData.hotelName}
                  onChange={(e) =>
                    setFormData({ ...formData, hotelName: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>City *</Label>
                <Input
                  required
                  value={formData.hotelCity}
                  onChange={(e) =>
                    setFormData({ ...formData, hotelCity: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>State *</Label>
                <Input
                  required
                  value={formData.hotelState}
                  onChange={(e) =>
                    setFormData({ ...formData, hotelState: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Description *</Label>
                <Textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="ghost" onClick={onCloseAction}>
                Cancel
              </Button>
              <Button type="submit">
                {hotelId ? "Update Hotel" : "Create Hotel"}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default HotelForm;
