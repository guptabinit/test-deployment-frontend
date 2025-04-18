"use client";

import { useState } from "react"
import type { Item as MenuItem } from "@/types/menu/Items"
import { EditModal } from "./edit-modal"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ItemsTableProps {
  items: MenuItem[]
  toggleAvailable: (itemId: string) => Promise<void>
  updateItem: (item: MenuItem) => Promise<void>
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export function ItemsTable({
  items,
  toggleAvailable,
  updateItem,
  currentPage,
  itemsPerPage,
  onPageChange,
}: ItemsTableProps) {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Calculate pagination values
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async (updatedItem: MenuItem) => {
    await updateItem(updatedItem)
    setIsEditModalOpen(false)
    setEditingItem(null)
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 border text-xs font-medium text-gray-500">Available</th>
              <th className="px-4 py-2 border text-xs font-medium text-gray-500">Image</th>
              <th className="px-4 py-2 border text-xs font-medium text-gray-500">Item Name</th>
              <th className="px-4 py-2 border text-xs font-medium text-gray-500">Price</th>
              <th className="px-4 py-2 border text-xs font-medium text-gray-500">Food Item</th>
              <th className="px-4 py-2 border text-xs font-medium text-gray-500">Addons</th>
              <th className="px-4 py-2 border text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
  {currentItems.length === 0 ? (
    <tr>
      <td colSpan={7} className="h-[300px] text-center text-gray-500">
        No item
      </td>
    </tr>
  ) : (
    currentItems.map((item) => (
      <tr key={String(item._id)} className="border hover:bg-gray-50">
        <td className="px-4 py-2 text-center">
          <input
            type="checkbox"
            checked={item.isAvailable}
            onChange={() => toggleAvailable(String(item._id))}
            className="h-4 w-4 cursor-pointer rounded border-gray-300"
          />
        </td>
        <td className="px-4 py-2">
          {item.itemImage ? (
            <div className="relative w-12 h-12 overflow-hidden rounded-md">
              <img
                src={
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.itemImage}` ||
                  "/placeholder.svg"
                }
                alt={item.itemName}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
              No image
            </div>
          )}
        </td>
        <td className="px-4 py-2 text-sm font-medium">
          {item.itemName}
        </td>
        <td className="px-4 py-2 text-sm">
          ₹{item.price.toFixed(2)}/{item.pricePer}
        </td>
        <td className="px-4 py-2 text-sm">
          {item.isFood ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              Yes
            </span>
          ) : (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
              No
            </span>
          )}
        </td>
        <td className="px-4 py-2 text-sm">
          {item.willHaveAddon ? (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              Yes
            </span>
          ) : (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
              No
            </span>
          )}
        </td>
        <td className="px-4 py-2 text-sm">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="h-8 w-8 p-0">
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
        </td>
      </tr>
    ))
  )}
</tbody>

        </table>
      </div>

      {totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-500 order-2 sm:order-1">
            Showing <span className="font-medium">{indexOfFirstItem + 1}</span>-
            <span className="font-medium">
              {Math.min(indexOfLastItem, totalItems)}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span> items
          </div>

          <Pagination className="order-1 sm:order-2">
            <PaginationContent className="flex-wrap justify-center">
              {/* Previous button */}
              {currentPage > 1 && (
                <PaginationItem className="hidden sm:inline-flex">
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(currentPage - 1);
                    }}
                  />
                </PaginationItem>
              )}

              {/* Mobile Previous button */}
              {currentPage > 1 && (
                <PaginationItem className="sm:hidden">
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(currentPage - 1);
                    }}
                  >
                    Prev
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* First page - always show on larger screens, hide on very small screens if close to current */}
              {currentPage > 2 && (
                <PaginationItem
                  className={currentPage > 3 ? "hidden sm:inline-flex" : ""}
                >
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(1);
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Ellipsis if needed */}
              {currentPage > 3 && (
                <PaginationItem className="hidden sm:inline-flex">
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Previous page if not first */}
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(currentPage - 1);
                    }}
                  >
                    {currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Current page */}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive
                  onClick={(e) => e.preventDefault()}
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>

              {/* Next page if not last */}
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(currentPage + 1);
                    }}
                  >
                    {currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Ellipsis if needed */}
              {currentPage < totalPages - 2 && (
                <PaginationItem className="hidden sm:inline-flex">
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Last page if not current or next */}
              {currentPage < totalPages - 1 && (
                <PaginationItem
                  className={
                    currentPage < totalPages - 2 ? "hidden sm:inline-flex" : ""
                  }
                >
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(totalPages);
                    }}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Next button */}
              {currentPage < totalPages && (
                <PaginationItem className="hidden sm:inline-flex">
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              )}

              {/* Mobile Next button */}
              {currentPage < totalPages && (
                <PaginationItem className="sm:hidden">
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(currentPage + 1);
                    }}
                  >
                    Next
                  </PaginationLink>
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={editingItem}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
