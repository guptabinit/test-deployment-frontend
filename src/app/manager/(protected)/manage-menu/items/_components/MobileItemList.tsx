"use client"

import { useState } from "react"
import Image from "next/image"
import type { Item as MenuItem } from "@/types/menu/Items"
import { ChevronLeft, ChevronRight, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EditModal } from "./edit-modal"

interface MobileItemsListProps {
  items: MenuItem[]
  toggleAvailable: (itemId: string) => Promise<void>
  updateItem: (updatedItem: MenuItem) => Promise<void>
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export function MobileItemsList({
  items,
  toggleAvailable,
  updateItem,
  currentPage,
  itemsPerPage,
  onPageChange,
}: MobileItemsListProps) {
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = items.slice(startIndex, endIndex)

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  return (
    <div className="space-y-4">
      {currentItems.length === 0 ? (
        <div className="flex items-center justify-center min-h-[200px]"><p className="text-center text-gray-500">No item</p></div>
      ) : (
        currentItems.map((item) => (
          <div key={item._id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{item.itemName}</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setEditingItem(item)}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <div className="flex items-center">
                  <span className="text-sm mr-2">Available:</span>
                  <input
                    type="checkbox"
                    checked={item.isAvailable}
                    onChange={() => toggleAvailable(String(item._id))}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300"
                  />
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-center space-x-4">
              {item.itemImage && (
                <img
                  src={
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.itemImage}` ||
                    "/placeholder.svg"
                  }
                  alt={item.itemName}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
              )}
              <p className="text-sm text-gray-500">{item.itemDesc}</p>
            </div>
            <p className="mt-2 font-semibold">Price: Rs.{item.price}</p>
          </div>
        ))
      )}

      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={endIndex >= items.length}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {editingItem && (
        <EditModal isOpen={!!editingItem} onClose={() => setEditingItem(null)} item={editingItem} onSave={updateItem} />
      )}
    </div>
  )
}
