"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Pen,
  Search,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { fetchWithAuth } from "../../_lib/fetch-with-auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import HotelForm from "./_components/hotel-form";

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

export default function HotelsPage() {
  const [hotelsLoading, setHotelsLoading] = useState(true);
  const [hotels, setHotels] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const itemsPerPage = 6;

  const [editHotelId, setEditHotelId] = useState<string | undefined>();
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Fetching all hotels here
  useEffect(() => {
    const fetchHotels = async () => {
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
      setHotelsLoading(false);
    };

    fetchHotels();
  }, []);

  // Create a new hotel
  const handleCreateHotel = async (formData) => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/owner/create-hotel`,
        {
          method: "POST",
          body: JSON.stringify({
            hotelName: formData.hotelName,
            hotelCity: formData.hotelCity,
            hotelState: formData.hotelState,
            description: formData.description,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create hotel");

      setHotels((prev) => [data.hotel, ...prev]);
      setShowAddForm(false);
      toast.success("Hotel created successfully");
    } catch (error) {
      console.error("Error creating hotel:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create hotel"
      );
    }
  };

  // Edit an existing hotel
  const handleEditHotel = async (formData, hotelId) => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/owner/edit-hotel/${hotelId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            hotelName: formData.hotelName,
            hotelCity: formData.hotelCity,
            hotelState: formData.hotelState,
            description: formData.description,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update hotel");

      // Update the existing hotel in state instead of adding a new one
      setHotels((prev) =>
        prev.map((hotel) =>
          hotel._id === hotelId ? { ...hotel, ...data.hotel } : hotel
        )
      );

      setShowAddForm(false);
      toast.success("Hotel updated successfully");
    } catch (error) {
      console.error("Error updating hotel:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update hotel"
      );
    }
  };

  // Filter and sort requests
  const filteredHotels = useMemo(() => {
    if (statusFilter === "active") {
      return hotels?.filter((hotel) => hotel.isActive);
    } else if (statusFilter === "inactive") {
      return hotels?.filter((hotel) => !hotel.isActive);
    }
    return hotels;
  }, [hotels, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const paginatedHotels = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredHotels.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredHotels, currentPage, itemsPerPage]);

  // Opens up the form in case of we are editing
  const handleEditForm = async (hotelId) => {
    setEditHotelId(hotelId);
    setShowAddForm(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Hotels Management</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all registered hotels
          </p>
        </div>
      </div>

      {/* Updated search and filter layout */}
      <div className="flex items-center justify-between">
        <div className="relative w-96"></div>
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-1">
            <Select
              value={statusFilter ? statusFilter : "all"}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[130px] px-4 py-2 flex items-center justify-between">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hotels</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            Add New Hotel
          </button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hotel Name</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Manager Email</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hotelsLoading ? (
              Array(5)
                .fill(0)
                .map((_, index) => <TableRowSkeleton key={index} />)
            ) : paginatedHotels.length > 0 ? (
              paginatedHotels.map((hotel) => (
                <TableRow key={hotel._id}>
                  <TableCell className="font-medium">
                    {hotel.hotelName}
                  </TableCell>
                  <TableCell>
                    {hotel.handlingManagerId
                      ? hotel.handlingManagerId.userName
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {hotel.handlingManagerId
                      ? hotel.handlingManagerId.email
                      : "-"}
                  </TableCell>
                  <TableCell>{hotel.hotelCity}</TableCell>
                  <TableCell>{hotel.hotelState}</TableCell>
                  <TableCell>
                    <Badge
                      variant={hotel.isActive ? "default" : "secondary"}
                      className={
                        hotel.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {hotel.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    <div className="flex justify-between">
                      <button
                        onClick={() => handleEditForm(hotel._id)}
                        className="p-1.5 bg-gray-900 hover:bg-gray-800 rounded"
                      >
                        <Pen className="text-white w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    <p>No hotels found</p>
                    <p className="text-sm">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      {!hotelsLoading && filteredHotels.length > 0 && (
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredHotels.length)} of{" "}
            {filteredHotels.length} hotels
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

      {/* Create service form modal */}
      {showAddForm && (
        <HotelForm
          onCloseAction={() => {
            setShowAddForm(false);
            setEditHotelId(undefined);
          }}
          onCreateAction={handleCreateHotel}
          onEditAction={handleEditHotel}
          hotelId={editHotelId}
        />
      )}
    </div>
  );
}
