import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import dayjs from "dayjs";
import { Building } from "lucide-react";

interface SubscriptionRequest {
  _id: string;
  status: "Raised" | "Processing" | "Completed" | "Rejected";
  ownerId: { userName: string };
  toAddBranches: boolean;
  numOfBranches: number;
  createdAt: string;
  notes?: string;
  addHotelIds: string[];
  removeHotelIds: string[];
}

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

// View request details dialog
const ViewRequestDetailsDialog = ({
  isOpen,
  onClose,
  request,
  hotels,
}: {
  isOpen: boolean;
  onClose: any;
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
              <h3 className="text-sm font-medium text-gray-500">Owner Name</h3>
              <p className="text-sm">{request.ownerId?.userName || "N/A"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <StatusBadge status={request.status} />
              </div>
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

export default ViewRequestDetailsDialog;
