"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";
import { ManagerForm } from "./_components/manager-form";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner"; // Changed from react-toastify to sonner
import { fetchWithAuth } from "../../_lib/fetch-with-auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

// Skeleton loader for table rows
const TableRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-5 w-36" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-5 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-5 w-20" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-5 w-16" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-5 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-5 w-5" />
    </TableCell>
  </TableRow>
);

export default function AccountsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [managers, setManagers] = useState<any[]>([]);
  const [isManagersLoading, setIsManagersLoading] = useState(true);
  const [editingManagerId, setEditingManagerId] = useState<string | undefined>(
    undefined
  );

  const [hotels, setHotels] = useState<any[]>([]);
  const [hotelLoading, setHotelLoading] = useState(true);

  const [assignPopup, setAssignPopup] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");
  const [selectedManagerId, setSelectedManagerId] = useState<string>("");
  const [confirmUnassignPopup, setConfirmUnassignPopup] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch hotels associated with the owner
  useEffect(() => {
    const fetchHotels = async () => {
      setHotelLoading(true);
      try {
        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/owner/fetch-hotels`
        );

        const data = await res.json();
        if (res.ok && data.hotels) {
          setHotels(data.hotels);
        } else {
          toast.error("Failed to load hotels");
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
        toast.error("Error loading hotels");
      }
      setHotelLoading(false);
    };

    fetchHotels();
  }, [managers]);

  // Fetch managers associated with the owner
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/owner/fetch-managers`
        );

        const data = await res.json();
        if (res.ok && data.managers) {
          setManagers(data.managers);
          setIsManagersLoading(false);
        }
      } catch (error) {
        console.error("Error fetching managers:", error);
        toast.error("Error loading managers");
      }
    };

    fetchManagers();
  }, []);

  const handleCreateManager = async (formData) => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/owner/create-manager`,
        {
          method: "POST",
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Manager created successfully");
        setManagers([...managers, data.Manager]);
      } else {
        toast.error(data.message || "Failed to create manager");
      }
    } catch (error) {
      console.error("Error creating manager:", error);
      toast.error("Error creating manager");
    }
  };

  const handleEditManager = async (formData) => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/owner/edit-manager/${editingManagerId}`,
        {
          method: "PUT",
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Manager updated successfully");
        setManagers(
          managers.map((manager) =>
            manager._id === editingManagerId ? data.manager : manager
          )
        );
      } else {
        toast.error(data.message || "Failed to update manager");
      }
    } catch (error) {
      console.error("Error updating manager:", error);
      toast.error("Error updating manager");
    }
  };

  const handleEditForm = async (managerId) => {
    setEditingManagerId(managerId);
    setShowAddForm(true);
  };

  // Find the selected service name based on hotelId
  const getSelectedHotelName = (hotelId) => {
    if (hotelId === "") return "Select a hotel";

    // Otherwise look up the service name from fetchedServices
    const selectedHotel = hotels.find((hotel) => hotel._id === hotelId);
    return selectedHotel ? selectedHotel.hotelName : "Select a hotel";
  };

  const handleAssign = async () => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/owner/assign-manager/${selectedManagerId}/${selectedHotelId}`,
        {
          method: "PUT",
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Manager assigned successfully");
        setManagers(
          managers.map((manager) =>
            manager._id === selectedManagerId
              ? { ...manager, isActive: true }
              : manager
          )
        );
        setAssignPopup(false);
      } else {
        toast.error(data.message || "Failed to assign manager");
      }
    } catch (error) {
      console.error("Error assigning manager:", error);
      toast.error("Error assigning manager");
    }

    setAssignPopup(false);
  };

  const handleUnassignManager = async () => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/owner/unassign-manager/${selectedManagerId}`,
        {
          method: "PUT",
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Manager unassigned successfully");
        setManagers(
          managers.map((manager) =>
            manager._id === selectedManagerId
              ? { ...manager, isActive: false }
              : manager
          )
        );
      } else {
        toast.error(data.message || "Failed to unassign manager");
      }
    } catch (error) {
      console.error("Error unassigning manager:", error);
      toast.error("Error unassigning manager");
    }

    setConfirmUnassignPopup(false);
  };

  // Pagination
  const totalPages = Math.ceil(managers.length / itemsPerPage);
  const paginatedManagers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return managers.slice(startIndex, startIndex + itemsPerPage);
  }, [managers, currentPage, itemsPerPage]);

  console.log("managers", paginatedManagers);
  console.log("hotels", hotels);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Hotel: <span className="text-gray-600">Account Management</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your branch managers and staff accounts
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Input placeholder="Search accounts..." className="pl-9" />
          <FiSearch
            className="absolute left-3 top-2.5 text-gray-400"
            size={16}
          />
        </div>

        <Button
          onClick={() => setShowAddForm(true)}
          className="flex-row items-center justify-center"
        >
          <Plus />
          <span>Add New Manager</span>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Unassign/Assign</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isManagersLoading
              ? Array(5)
                  .fill(0)
                  .map((_, index) => <TableRowSkeleton key={index} />)
              : paginatedManagers.map((manager) => (
                  <TableRow key={manager._id}>
                    <TableCell className="font-medium">
                      {manager.userName}
                    </TableCell>
                    <TableCell>{manager.email}</TableCell>
                    <TableCell>
                      {hotels?.find(
                        (hotel) => manager._id === hotel.handlingManagerId?._id
                      )?.hotelName
                        ? hotels.find(
                            (hotel) => manager._id === hotel.handlingManagerId?._id
                          ).hotelName
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {manager.isActive ? (
                        <Button
                          onClick={() => {
                            setSelectedManagerId(manager._id);
                            setConfirmUnassignPopup(true);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          {" "}
                          Unassign{" "}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            setSelectedManagerId(manager._id);
                            setAssignPopup(true);
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          {" "}
                          Assign{" "}
                        </Button>
                      )}
                      {/* HOTEL SELECTION DROPDOWN, WHILE ASSIGNING */}
                      <Dialog open={assignPopup} onOpenChange={setAssignPopup}>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Assign Hotel</DialogTitle>
                            <DialogDescription>
                              Select a hotel to assign to this manager.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div>
                              <Label>Hotel *</Label>
                              <Select
                                value={selectedHotelId}
                                onValueChange={(value) =>
                                  setSelectedHotelId(value)
                                }
                                required
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a hotel">
                                    {getSelectedHotelName(selectedHotelId)}
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
                                          hotel.handlingManagerId ? true : false
                                        }
                                      >
                                        {hotel.hotelName}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setAssignPopup(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              onClick={handleAssign}
                              disabled={selectedHotelId != "" ? false : true}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              Assign
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* CONFIRMING UNASSIGN */}
                      <Dialog
                        open={confirmUnassignPopup}
                        onOpenChange={setConfirmUnassignPopup}
                      >
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Unassign Manager</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to unassign this manager?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setConfirmUnassignPopup(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              onClick={handleUnassignManager}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              Unassign
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleEditForm(manager._id)}
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isManagersLoading && managers.length > 0 && (
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, managers.length)} of{" "}
            {managers.length} Managers
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {showAddForm && (
        <ManagerForm
          onCloseAction={() => {
            setShowAddForm(false);
            setEditingManagerId(undefined);
          }}
          onCreateAction={handleCreateManager}
          onEditAction={handleEditManager}
          managerId={editingManagerId}
          hotels={hotels}
          hotelLoading={hotelLoading}
        />
      )}
    </div>
  );
}
