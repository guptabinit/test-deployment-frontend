"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FiX } from "react-icons/fi";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { fetchWithAuth } from "@/app/owner/_lib/fetch-with-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Match the backend schema exactly
const managerFormSchema = z.object({
  userName: z.string().min(1, "username is required."),
  password: z.string().min(6, "Password should be atleast 6 charecters."),
  email: z.string().email().min(1, "Email should be unique and valid."),
  role: z.string().default("BranchManager"),
  hotelId: z.string().default("Hotel isn't selected"),
});

type ManagerFormData = z.infer<typeof managerFormSchema>;

type ManagerFormProps = {
  onCloseAction: () => void;
  onCreateAction: (data: any) => void;
  onEditAction: (data: any, serviceId?: string) => void; // Optional edit action
  hotelId?: string; // Hotel ID for creating a new 
  managerId?: string; // Optional service ID for editing
  hotels: any[];
  hotelLoading: boolean;
};

export const ManagerForm = ({
  onCloseAction,
  onCreateAction,
  onEditAction,
  hotelId,
  managerId,
  hotels,
  hotelLoading,
}: ManagerFormProps) => {
  const [formData, setFormData] = useState<ManagerFormData>({
    userName: "",
    password: "",
    email: "",
    role: "BranchManager",
    hotelId: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchedManager, setFetchedManager] = useState<any>({});

  // Fetch manager data if managerId is provided (Edit Mode)
  useEffect(() => {
    if (managerId) {
      const fetchCategoryData = async () => {
        setLoading(true);
        try {
          const res = await fetchWithAuth(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/owner/fetch-manager-data/${managerId}`
          );

          const data = await res.json();
          console.log(data);
          if (res.ok && data.manager) {
            setFormData({
              userName: data.manager.userName || "",
              email: data.manager.email || "",
              role: "BranchManager",
              password: data.manager.passwordHash || "",
              hotelId: hotelId || "",
            });
            setFetchedManager(data.manager);
          } else {
            toast.error("Failed to load manager data");
          }
        } catch (error) {
          console.error("Error fetching manager data:", error);
          toast.error("Error loading manager details");
        }
        setLoading(false);
      };

      fetchCategoryData();
    }
  }, [managerId]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data against schema
      const validatedData = managerFormSchema.parse(formData);
      await onCreateAction(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Validation Error", {
          description: error.errors[0].message,
        });
      } else {
        toast.error("An error occurred while saving the manager");
      }
    }
    onCloseAction();
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data against schema
      const validatedData = managerFormSchema.parse(formData);

      await onEditAction(validatedData, managerId);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Validation Error", {
          description: error.errors[0].message,
        });
      } else {
        toast.error("An error occurred while saving the category");
      }
    }
    onCloseAction();
  };

  // Find the selected service name based on hotelId
  const getSelectedHotelName = () => {
    if (!formData.hotelId) return "Select a hotel";

    // First check if we're in edit mode and have the fetched category data
    if (managerId && fetchedManager?.hotelId === formData.hotelId) {
      return hotels.find((hotel) => hotel._id === fetchedManager.hotelId)
        .hotelName;
    }

    // Otherwise look up the service name from fetchedServices
    const selectedHotel = hotels.find(
      (hotel) => hotel._id === formData.hotelId
    );
    return selectedHotel ? selectedHotel.hotelName : "Select a hotel";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onCloseAction}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="w-[500px] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {managerId ? "Edit Branch Manager" : "Add New Branch Manager"}
              </h2>
              <Button variant="ghost" size="icon" onClick={onCloseAction}>
                <FiX size={20} />
              </Button>
            </div>

            <form
              onSubmit={managerId ? handleEditSubmit : handleCreateSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  autoComplete="off"
                  required
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                />
              </div>

              {!managerId && (
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Hotel *</Label>
                <Select
                  value={formData.hotelId || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, hotelId: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a hotel">
                      {getSelectedHotelName()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {hotelLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading hotels...
                      </SelectItem>
                    ) : (
                      hotels.map((hotel) => (
                        <SelectItem
                          key={hotel._id}
                          value={hotel._id}
                          disabled={
                            hotel.handlingManagerId === managerId
                              ? false
                              : hotel.isActive
                          }
                        >
                          {hotel.hotelName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <Button variant="outline" onClick={onCloseAction}>
                  Cancel
                </Button>
                <Button type="submit">
                  {managerId ? "Update Manager" : "Create Manager"}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
