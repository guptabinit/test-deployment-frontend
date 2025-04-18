"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import TableLoader from "../../_components/table-loader"
import Pagination from "../../_components/pagination"
import { formatDate } from "../../_lib/format-date"
import { ChevronLeft, ChevronRight, Pen, Search } from "lucide-react"
import type { Category } from "@/types/menu/Categories"
import { Button } from "@/components/ui/button"

interface CategoryTableProps {
  categories: Category[]
  toggleActive: (categoryId: string) => void
  onManageCategory: (categoryId: string) => void
  isLoading?: boolean
  fetchedServices: any
  isServiceLoading: boolean
  // Pagination props
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

// Define table headers
const categoryTableHeaders = [
  { id: "active", title: "Active" },
  { id: "categoryName", title: "Category Name" },
  { id: "ServiceName", title: "Service" },
  { id: "description", title: "Description" },
  { id: "time", title: "Time" },
  { id: "lastUpdated", title: "Last Updated" },
  { id: "action", title: "Action" },
]

export default function CategoryTable({
  categories,
  toggleActive,
  onManageCategory,
  isLoading = false,
  fetchedServices,
  isServiceLoading,
  currentPage,
  itemsPerPage,
  onPageChange,
}: CategoryTableProps) {
  if (isLoading) {
    return <TableLoader />
  }
  // Calculate pagination values
  const totalItems = categories.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Get current page items
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = categories.slice(startIndex, endIndex)

  return (
    <div>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="min-w-full border-collapse border border-gray-200">
          <TableHeader>
            <TableRow className="bg-gray-50">
              {categoryTableHeaders.map((header) => (
                <TableHead key={header.id} className="px-4 py-2 border text-xs font-medium text-gray-500">
                  {header.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3 py-8">
                    <div className="rounded-full bg-gray-100 p-3">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium text-gray-900">No categories found</h3>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((category) => (
                <TableRow key={String(category._id)} className="border hover:bg-gray-200">
                  <TableCell className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={category.isActive}
                      onChange={() => toggleActive(String(category._id))}
                      className="h-4 w-4 cursor-pointer rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell className="px-4 py-2 text-sm">{category.categoryName}</TableCell>
                  <TableCell className="px-4 py-2 text-sm">
                    {fetchedServices.find((service) => service._id === category.serviceId)?.serviceName}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-sm text-gray-600">{category.categoryDesc}</TableCell>
                  <TableCell className="px-4 py-2 text-sm">{category.time}</TableCell>
                  <TableCell className="px-4 py-2 text-xs text-gray-500">{formatDate(category.updatedAt)}</TableCell>
                  <TableCell className="px-4 py-2 text-center">
                    <button
                      onClick={() => onManageCategory(String(category._id))}
                      className="p-1.5 bg-gray-900 hover:bg-gray-800 rounded"
                    >
                      <Pen className="text-white w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {currentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-8 border rounded-lg">
            <div className="rounded-full bg-gray-100 p-3">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-gray-900">No categories found</h3>
            </div>
          </div>
        ) : (
          currentItems.map((category) => (
            <div key={String(category._id)} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{category.categoryName}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onManageCategory(String(category._id))}
                    className="p-1.5 bg-gray-900 hover:bg-gray-800 rounded"
                  >
                    <Pen className="text-white w-4 h-4" />
                  </button>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Active:</span>
                    <input
                      type="checkbox"
                      checked={category.isActive}
                      onChange={() => toggleActive(String(category._id))}
                      className="h-4 w-4 cursor-pointer rounded border-gray-300"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-semibold text-gray-500">Service:</span>{" "}
                  {fetchedServices.find((service) => service._id === category.serviceId)?.serviceName}
                </div>
                <div>
                  <span className="font-semibold text-gray-500">Time:</span> {category.time}
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-gray-500">Description:</span> {category.categoryDesc}
                </div>
                <div className="col-span-2 text-xs text-gray-500">
                  <span className="font-semibold">Last Updated:</span> {formatDate(category.updatedAt)}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Mobile Pagination */}
        {totalItems > 0 && (
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={endIndex >= categories.length}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Desktop Pagination */}
      {totalItems > 0 && (
        <div className="hidden md:block">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  )
}

