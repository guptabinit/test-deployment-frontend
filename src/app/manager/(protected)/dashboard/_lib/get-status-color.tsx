// Helper function for status colors
export const getStatusColor = (status: string) => {
  const colors = {
    Completed: "bg-green-100 text-green-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};
