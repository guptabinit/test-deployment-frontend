"use client";

import type React from "react";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertCircle,
  Building,
  Minus,
} from "lucide-react";
import { FiEye } from "react-icons/fi";
import { fetchWithAuth } from "../../_lib/fetch-with-auth";
import dayjs from "dayjs";
import { toast } from "sonner";
import { z } from "zod";

// Update the interface
interface SubscriptionRequest {
  _id: string;
  status: "Raised" | "Processing" | "Completed" | "Rejected";
  toAddBranches: boolean;
  numOfBranches: number;
  createdAt: string;
  notes?: string;
  addHotelIds: string[];
  removeHotelIds: string[];
}

const subscriptionRequestSchema = z.object({
  numOfBranches: z.string().min(1, "Number of branches should be atleast 1"),
  removeHotelIds: z.array(z.string()),
  addHotelIds: z.array(z.string()),
});

// Add form state interface
type SubscriptionFormState = z.infer<typeof subscriptionRequestSchema>;

// Simple Dropdown Menu Component
const SimpleDropdown = ({
  trigger,
  children,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div className="py-1" onClick={() => setIsOpen(false)}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple Dropdown Item Component
const SimpleDropdownItem = ({
  onClick,
  children,
  className = "",
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Simple Dropdown Separator Component
const SimpleDropdownSeparator = () => {
  return <div className="h-px my-1 bg-gray-200" />;
};

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

// Update the form dialog component
const SubscriptionRequestFormDialog = ({
  isOpen,
  onClose,
  hotels,
  requestNewBranches,
  handleRequestNewBranch,
  requestActivateBranches,
  handleRequestActivateBranches,
  requestRemoveBranches,
  handleRequestRemoveBranch,
}: {
  isOpen: boolean;
  onClose: () => void;
  hotels: any[];
  requestNewBranches: boolean;
  handleRequestNewBranch: (formData: any) => void;
  requestActivateBranches: boolean;
  handleRequestActivateBranches: (formData: any) => void;
  requestRemoveBranches: boolean;
  handleRequestRemoveBranch: (formData: any) => void;
}) => {
  const [formData, setFormData] = useState<SubscriptionFormState>({
    numOfBranches: "1",
    removeHotelIds: [],
    addHotelIds: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let validatedData;
    try {
      // Validate form data against schema
      validatedData = subscriptionRequestSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Validation Error", {
          description: error.errors[0].message,
        });
      } else {
        toast.error("An error occurred while saving the manager");
      }
    }
    if (requestNewBranches) {
      await handleRequestNewBranch(validatedData);
    } else if (requestActivateBranches) {
      if (validatedData.addHotelIds.length != validatedData.numOfBranches) {
        toast.error(
          "Please select the hotels to activate as per the requested number of branches"
        );
      } else {
        await handleRequestActivateBranches(validatedData);
      }
    } else if (requestRemoveBranches) {
      if (validatedData.removeHotelIds.length != validatedData.numOfBranches) {
        toast.error(
          "Please select the hotels to remove as per the requested number of branches"
        );
      } else {
        await handleRequestRemoveBranch(validatedData);
      }
    }
  };

  const handleHotelToggle = (hotelId: string) => {
    const listType = requestRemoveBranches ? "removeHotelIds" : "addHotelIds";

    setFormData((prev) => {
      const currentList = [...(prev[listType] || [])];
      const index = currentList.indexOf(hotelId);

      if (index === -1) {
        if (currentList.length < parseInt(prev.numOfBranches)) {
          currentList.push(hotelId);
        } else {
          toast.error("You can only remove up to the number of branches");
        }
      } else {
        currentList.splice(index, 1);
      }

      return { ...prev, [listType]: currentList };
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>New Subscription Request</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new subscription request.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="branchesCount">Number of Branches</Label>
              <Input
                id="branchesCount"
                name="branchesCount"
                type="number"
                min="1"
                value={formData.numOfBranches}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    numOfBranches: (e.target.value as string) || "1",
                  }))
                }
              />
            </div>

            {!requestNewBranches ? (
              <div className="grid gap-2">
                <Label>
                  {requestRemoveBranches
                    ? "Hotels to Remove"
                    : requestActivateBranches
                    ? "Hotels to Add"
                    : ""}
                </Label>
                <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                  {hotels.map((hotel) => (
                    <div
                      key={hotel._id}
                      className="flex items-center space-x-2 py-1"
                    >
                      <Checkbox
                        id={hotel._id}
                        checked={
                          requestActivateBranches
                            ? formData.addHotelIds.includes(hotel._id)
                              ? true
                              : hotel.isActive
                            : requestRemoveBranches
                            ? formData.removeHotelIds.includes(hotel._id)
                              ? true
                              : !hotel.isActive
                            : hotel.isActive
                        }
                        onCheckedChange={() => handleHotelToggle(hotel._id)}
                        disabled={
                          requestActivateBranches
                            ? hotel.isActive
                            : !hotel.isActive
                        }
                      />
                      <Label htmlFor={hotel._id} className="text-sm">
                        {hotel.hotelName}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  addHotelIds: [],
                  removeHotelIds: [],
                }));
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// View request details dialog
const ViewRequestDetailsDialog = ({
  isOpen,
  onClose,
  request,
  hotels,
}: {
  isOpen: boolean;
  onClose: () => void;
  request: SubscriptionRequest | null;
  hotels: any[];
}) => {
  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Subscription Request Details</DialogTitle>
          <DialogDescription>
            Complete information about this subscription request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Request ID</h3>
              <p className="text-sm font-mono">{request._id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created</h3>
              <p className="text-sm">
                {dayjs(request.createdAt).format("MMM D, YYYY h:mm A")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <StatusBadge status={request.status} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Request Details
            </h3>
            <div className="bg-gray-50 rounded-md p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Add Branches:</span>
                <span className="text-sm font-medium">
                  {request.toAddBranches ? "Yes" : "No"}
                </span>
              </div>
              {request.toAddBranches && (
                <div className="flex justify-between">
                  <span className="text-sm">Number of Branches:</span>
                  <span className="text-sm font-medium">
                    {request.numOfBranches}
                  </span>
                </div>
              )}
            </div>
          </div>

          {request.addHotelIds && request.addHotelIds.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Hotels to Add
              </h3>
              <div className="bg-gray-50 rounded-md p-3">
                <ul className="space-y-1">
                  {request.addHotelIds.map((id) => (
                    <li key={`add-${id}`} className="text-sm flex items-center">
                      <Building className="h-3.5 w-3.5 text-gray-400 mr-2" />
                      {hotels.find((hotel) => hotel._id === id)?.hotelName ||
                        id}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {request.removeHotelIds && request.removeHotelIds.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Hotels to Remove
              </h3>
              <div className="bg-gray-50 rounded-md p-3">
                <ul className="space-y-1">
                  {request.removeHotelIds.map((id) => (
                    <li
                      key={`remove-${id}`}
                      className="text-sm flex items-center"
                    >
                      <Building className="h-3.5 w-3.5 text-gray-400 mr-2" />
                      {hotels.find((hotel) => hotel._id === id)?.hotelName ||
                        id}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    Raised: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    Processing: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    Completed: "bg-green-100 text-green-800 hover:bg-green-200",
    Rejected: "bg-red-100 text-red-800 hover:bg-red-200",
  };

  return (
    <Badge
      variant="outline"
      className={statusStyles[status as keyof typeof statusStyles]}
    >
      {status}
    </Badge>
  );
};

export default function SubscriptionRequestsPage() {
  // State management
  const [requests, setRequests] = useState<SubscriptionRequest[]>([]);
  const [isRequestLoading, setIsRequestLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [requestToView, setRequestToView] =
    useState<SubscriptionRequest | null>(null);

  const [requestNewBranches, setRequestNewBranches] = useState(false);
  const [requestActivateBranches, setRequestActivateBranches] = useState(false);
  const [requestRemoveBranches, setRequestRemoveBranches] = useState(false);

  const itemsPerPage = 6;

  const [hotels, setHotels] = useState<any>([]);
  const [isHotelLoading, setIsHotelLoading] = useState(true);

  // Fetching hotels here
  useEffect(() => {
    const fetchHotels = async () => {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/owner/fetch-hotels`
      );

      if (response.ok) {
        const data = await response.json();
        setHotels(data.hotels);
        setIsHotelLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Simulate API call to fetch subscription requests
  useEffect(() => {
    const fetchRequests = async () => {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/owner/get-all-subscription-requests`
      );

      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
        setIsRequestLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Filter and sort requests
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;
      return matchesStatus;
    });
  }, [requests, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRequests, currentPage, itemsPerPage]);

  // Handle request operations
  const handleRequestNewBranch = () => {
    setRequestNewBranches(true);
    setRequestActivateBranches(false);
    setRequestRemoveBranches(false);
    setIsFormOpen(true);
  };

  const handleNewBranchesSubmit = async (formData: any) => {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/owner/request-subscription-increase`,
      {
        method: "POST",
        body: JSON.stringify(formData),
      }
    );

    const data = await res.json();
    if (res.ok) {
      toast.success("New branches request submitted successfully");
      setRequests((prev) => [...prev, data.subscriptionRequest]);
      setIsFormOpen(false);
    } else {
      toast.error(data.message || "Failed to submit request");
    }
  };

  // Handle request operations
  const handleActivateBranch = () => {
    setRequestActivateBranches(true);
    setRequestNewBranches(false);
    setRequestRemoveBranches(false);
    setIsFormOpen(true);
  };

  const handleActivateBranchesSubmit = async (formData: any) => {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/owner/request-branch-subscription`,
      {
        method: "POST",
        body: JSON.stringify(formData),
      }
    );

    const data = await res.json();
    if (res.ok) {
      toast.success("Activate branches request submitted successfully");
      setRequests((prev) => [...prev, data.subscriptionRequest]);
      setIsFormOpen(false);
    } else {
      toast.error(data.message || "Failed to submit request");
    }
  };

  // Handle request operations
  const handleRemoveBranch = () => {
    setRequestRemoveBranches(true);
    setRequestNewBranches(false);
    setRequestActivateBranches(false);
    setIsFormOpen(true);
  };

  const handleRemoveBranchesSubmit = async (formData: any) => {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/owner/request-subscription-decrease`,
      {
        method: "POST",
        body: JSON.stringify(formData),
      }
    );

    const data = await res.json();
    if (res.ok) {
      toast.success("Remove branches request submitted successfully");
      setRequests((prev) => [...prev, data.subscriptionRequest]);
      setIsFormOpen(false);
    } else {
      toast.error(data.message || "Failed to submit request");
    }
  };

  // Close view dialog
  const onClose = () => {
    setIsViewDialogOpen(false);
  };

  const handleViewRequest = (request: SubscriptionRequest) => {
    setRequestToView(request);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <motion.div
        className="flex items-center justify-between pb-4 border-b border-gray-200"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Subscription Requests
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage subscription change requests
          </p>
        </div>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center gap-4">
          <Button
            onClick={handleRequestNewBranch}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Request New Branches
          </Button>
          <Button
            onClick={handleActivateBranch}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Activate Branches
          </Button>
          <Button
            onClick={handleRemoveBranch}
            className="flex items-center gap-2"
          >
            <Minus className="h-4 w-4" /> Remove Branches
          </Button>
          <div className="flex items-center gap-2">
            <SimpleDropdown
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" /> Filter
                </Button>
              }
            >
              <SimpleDropdownItem
                onClick={() => setStatusFilter("all")}
                className={statusFilter === "all" ? "bg-gray-100" : ""}
              >
                All Requests
              </SimpleDropdownItem>
              <SimpleDropdownSeparator />
              <SimpleDropdownItem
                onClick={() => setStatusFilter("Raised")}
                className={statusFilter === "Raised" ? "bg-gray-100" : ""}
              >
                Raised
              </SimpleDropdownItem>
              <SimpleDropdownItem
                onClick={() => setStatusFilter("Processing")}
                className={statusFilter === "Processing" ? "bg-gray-100" : ""}
              >
                Processing
              </SimpleDropdownItem>
              <SimpleDropdownItem
                onClick={() => setStatusFilter("Completed")}
                className={statusFilter === "Completed" ? "bg-gray-100" : ""}
              >
                Completed
              </SimpleDropdownItem>
              <SimpleDropdownItem
                onClick={() => setStatusFilter("Rejected")}
                className={statusFilter === "Rejected" ? "bg-gray-100" : ""}
              >
                Rejected
              </SimpleDropdownItem>
            </SimpleDropdown>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="rounded-md border border-gray-200 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>To Add Branches</TableHead>
              <TableHead>No. of Branches</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isRequestLoading ? (
              // Skeleton loading state
              Array(5)
                .fill(0)
                .map((_, index) => <TableRowSkeleton key={index} />)
            ) : paginatedRequests.length > 0 ? (
              // Requests data
              paginatedRequests.map((request) => (
                <TableRow key={request._id} className="hover:bg-gray-50">
                  <TableCell>
                    <StatusBadge status={request.status} />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={request.toAddBranches ? "success" : "secondary"}
                    >
                      {request.toAddBranches ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>{request.numOfBranches}</TableCell>
                  <TableCell>
                    {dayjs(request.createdAt).format("MMM D, YYYY h:mm A")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                        onClick={() => handleViewRequest(request)}
                      >
                        <FiEye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // No results
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    <p>No subscription requests found</p>
                    <p className="text-sm">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* Pagination */}
      {!isRequestLoading && filteredRequests.length > 0 && (
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of{" "}
            {filteredRequests.length} requests
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

      {/* Request Form Dialog */}
      <SubscriptionRequestFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        requestNewBranches={requestNewBranches}
        handleRequestNewBranch={handleNewBranchesSubmit}
        requestActivateBranches={requestActivateBranches}
        handleRequestActivateBranches={handleActivateBranchesSubmit}
        requestRemoveBranches={requestRemoveBranches}
        handleRequestRemoveBranch={handleRemoveBranchesSubmit}
        hotels={hotels}
      />

      {/* View Request Details Dialog */}
      <ViewRequestDetailsDialog
        isOpen={isViewDialogOpen}
        onClose={onClose}
        request={requestToView}
        hotels={hotels}
      />
    </div>
  );
}
