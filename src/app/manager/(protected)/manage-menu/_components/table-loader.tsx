import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TableLoader() {
  const skeletonRows = Array(8).fill(null);

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full border-collapse border border-gray-200">
        <TableHeader>
          <TableRow className="bg-gray-50">
            {/* Create skeleton headers that match the actual table */}
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <TableHead
                  key={index}
                  className="px-4 py-2 border text-xs font-medium text-gray-500"
                >
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </TableHead>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeletonRows.map((_, index) => (
            <TableRow key={index} className="border">
              <TableCell className="px-4 py-2 text-center">
                <div className="h-4 w-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
              </TableCell>
              <TableCell className="px-4 py-2">
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
              </TableCell>
              <TableCell className="px-4 py-2">
                <div className="w-40 h-4 bg-gray-200 rounded animate-pulse"></div>
              </TableCell>
              <TableCell className="px-4 py-2">
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              </TableCell>
              <TableCell className="px-4 py-2">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              </TableCell>
              <TableCell className="px-4 py-2 text-center">
                <div className="w-8 h-8 bg-gray-200 rounded mx-auto animate-pulse"></div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
