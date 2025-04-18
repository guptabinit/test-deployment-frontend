"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertCircle, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { fetchWithAuth } from "../../_lib/fetch-with-auth";
import { toast } from "sonner";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Toggle } from "@/components/ui/toggle";
import { useSuperAdminStore } from "@/stores/superAdmin/superAdminStore";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import ViewRequestDetailsDialog from "./_components/view-request";

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

export default function SubscriptionsPage() {
  const { adminInfo } = useSuperAdminStore();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [myRequests, setMyRequests] = useState<boolean>(false);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any | null>(
    null
  );
  const [subscriptionRequests, setSubscriptionRequests] = useState<any[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Add new states for Process and Reject dialogs
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const [hotels, setHotels] = useState<any[]>([]);
  const [hotelsLoading, setHotelsLoading] = useState(true);

  // Fetch subscription requests
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/quickgick/get-subscription-requests`
        );

        const data = await res.json();
        if (res.ok && data.requests) {
          setSubscriptionRequests(data.requests);
        } else {
          toast.error(data.message || "Error loading requests");
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
        toast.error("Error loading requests");
      }
      setRequestsLoading(false);
    };

    fetchHotels();
  }, []);

  // Fetch hotels
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/quickgick/get-all-hotels`
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

  const handleViewDetails = (subscription: any) => {
    setSelectedSubscription(subscription);
    setViewDialogOpen(true);
  };

  // Memoized filtered subscriptions
  const filteredSubscriptions = useMemo(() => {
    let filtered = subscriptionRequests;
    if (myRequests) {
      filtered = filtered.filter(
        (sub) => sub.handledBy?._id === adminInfo?._id
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((sub) => {
        const matchesStatus =
          statusFilter === "all" || sub.status === statusFilter;
        return matchesStatus;
      });
    }

    return filtered;
  }, [subscriptionRequests, statusFilter, myRequests]);

  // Calculate summary statistics
  const stats = useMemo(() => {
    const total = filteredSubscriptions.length;
    const raised = filteredSubscriptions.filter(
      (sub) => sub.status === "Raised"
    ).length;
    const processing = filteredSubscriptions.filter(
      (sub) => sub.status === "Processing"
    ).length;
    const completed = filteredSubscriptions.filter(
      (sub) => sub.status === "Completed"
    ).length;
    const rejected = filteredSubscriptions.filter(
      (sub) => sub.status === "Rejected"
    ).length;

    return {
      total,
      raised,
      processing,
      completed,
      rejected,
    };
  }, [filteredSubscriptions]);

  // Pagination
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSubscriptions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSubscriptions, currentPage, itemsPerPage]);

  // Add handlers for Process and Reject actions
  const handleProcessClick = (subscription: any) => {
    setSelectedSubscription(subscription);
    setProcessDialogOpen(true);
  };

  const handleCompleteClick = (subscription: any) => {
    setSelectedSubscription(subscription);
    setCompleteDialogOpen(true);
  };

  const handleRejectClick = (subscription: any) => {
    setSelectedSubscription(subscription);
    setRejectDialogOpen(true);
  };

  const handleProcessSubmit = async () => {
    if (!selectedSubscription) return;
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/quickgick/process-subscription/${selectedSubscription._id}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.request) {
          toast.success("Subscription processed successfully");
          setSubscriptionRequests((prev) =>
            prev.map((sub) =>
              sub._id === selectedSubscription._id
                ? {
                    ...sub,
                    status: "Processing",
                    handledBy: {
                      userName: adminInfo?.userName,
                      _id: adminInfo?._id,
                    },
                  }
                : sub
            )
          );
        } else {
          toast.error(data.message || "Error processing subscription");
        }
      }
    } catch (error) {
      console.error("Error processing subscription:", error);
      toast.error("Error processing subscription");
    }
    setProcessDialogOpen(false);
  };

  const handleCompleteSubmit = async () => {
    if (!selectedSubscription) return;
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/quickgick/complete-subscription/${selectedSubscription._id}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.request) {
          toast.success("Subscription completed successfully");
          setSubscriptionRequests((prev) =>
            prev.map((sub) =>
              sub._id === selectedSubscription._id
                ? { ...sub, status: "Completed" }
                : sub
            )
          );
        } else {
          toast.error(data.message || "Error completing subscription");
        }
      }
    } catch (error) {
      console.error("Error completing subscription:", error);
      toast.error("Error completing subscription");
    }

    setCompleteDialogOpen(false);
  };

  const handleRejectSubmit = async () => {
    if (!selectedSubscription) return;
    try {
      const resopnse = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/quickgick/reject-subscription/${selectedSubscription._id}`,
        {
          method: "PUT",
        }
      );

      if (resopnse.ok) {
        const data = await resopnse.json();
        if (data.request) {
          toast.success("Subscription rejected successfully");
          setSubscriptionRequests((prev) =>
            prev.map((sub) =>
              sub._id === selectedSubscription._id
                ? { ...sub, status: "Rejected" }
                : sub
            )
          );
        } else {
          toast.error(data.message || "Error rejecting subscription");
        }
      }
    } catch (error) {
      console.error("Error rejecting subscription:", error);
      toast.error("Error rejecting subscription");
    }
    setRejectDialogOpen(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            System:{" "}
            <span className="text-gray-600 dark:text-gray-400">
              Subscriptions
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor all hotel subscriptions
          </p>
        </div>
      </div>

      {/* Stats Cards - Remove revenue card and keep only 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Total Requests
            </div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Raised
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.raised}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Processing
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.processing}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Completed
            </div>
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Rejected
            </div>
            <div className="text-2xl font-bold text-red-600">
              {stats.rejected}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 w-full sm:w-auto items-center py-4">
        <>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Status:
            </span>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[130px] px-4 py-2">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Raised">Raised</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </>
        <Toggle
          aria-label="Toggle italic"
          className="flex items-center gap-2 px-4 text-sm font-medium bg-white hover:bg-gray-200 data-[state=on]:bg-blue-50 data-[state=on]:text-blue-600 border border-gray-500 rounded-md shadow-sm"
          onClick={() => setMyRequests((prev) => !prev)}
        >
          My Requests
        </Toggle>
      </div>

      {/* Subscriptions Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Owner Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>No. of Branches</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Handled By</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requestsLoading ? (
              Array(5)
                .fill(0)
                .map((_, index) => <TableRowSkeleton key={index} />)
            ) : paginatedRequests.length > 0 ? (
              paginatedRequests.map((sub) => (
                <TableRow key={sub._id}>
                  <TableCell className="font-medium">
                    {sub.ownerId.userName}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        sub.status === "Raised"
                          ? "default"
                          : sub.status === "Processing"
                          ? "warning"
                          : sub.status === "Completed"
                          ? "success"
                          : "destructive"
                      }
                    >
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{sub.numOfBranches}</TableCell>
                  <TableCell>
                    {dayjs(sub.createdAt).format("MMM D, YYYY h:mm A")}
                  </TableCell>
                  <TableCell>
                    {sub.handledBy ? sub.handledBy.userName : "-"}
                  </TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">View Actions</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid grid-col gap-2">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">
                              Actions
                            </h4>
                          </div>
                          <div className="flex flex-wrap items-center justify-center gap-4">
                            <div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(sub)}
                                className="border border-gray-300"
                              >
                                View
                              </Button>
                            </div>
                            {sub.status === "Raised" && (
                              <div>
                                <Button
                                  size="sm"
                                  onClick={() => handleProcessClick(sub)}
                                  className="bg-yellow-200 text-black hover:bg-yellow-400"
                                >
                                  Process
                                </Button>
                              </div>
                            )}
                            <div>
                              {sub.status === "Processing" && (
                                <div className="flex gap-2">
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => {
                                      handleCompleteClick(sub);
                                    }}
                                    className="bg-green-200 text-black hover:bg-green-400"
                                  >
                                    Complete
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleRejectClick(sub)}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    <p>No Requests found</p>
                    <p className="text-sm">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {!requestsLoading && filteredSubscriptions.length > 0 && (
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredSubscriptions.length)}{" "}
            of {filteredSubscriptions.length} Requests
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

      {/* Process Dialog */}
      <Dialog open={processDialogOpen} onOpenChange={setProcessDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Process Subscription Request</DialogTitle>
            <DialogDescription>
              Start processing the subscription request for{" "}
              {selectedSubscription?.ownerId.userName}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProcessDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleProcessSubmit}
              className="bg-yellow-500 text-white"
            >
              Start Processing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Complete Subscription Request</DialogTitle>
            <DialogDescription>
              Complete the subscription request for{" "}
              {selectedSubscription?.ownerId.userName}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProcessDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCompleteSubmit}
              className="bg-green-500 text-white"
            >
              Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reject Subscription Request</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectSubmit}>
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Request Details Dialog */}
      <ViewRequestDetailsDialog
        isOpen={viewDialogOpen}
        onClose={setViewDialogOpen}
        request={selectedSubscription}
        hotels={hotels}
      />
    </div>
  );
}
