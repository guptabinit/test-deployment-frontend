"use client"

import { useEffect, useState } from "react"
import { FiSearch } from "react-icons/fi"
import { FaSpinner } from "react-icons/fa"
import { toast } from "sonner"
import { fetchWithAuth } from "@/app/manager/_lib/fetch-with-auth"
import { ItemsTable } from "./_components/itemTable"
import { MobileItemsList } from "./_components/MobileItemList"
import { AddItemForm } from "./_components/AddItemForm"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Using the correct Item type structure
type Addon = any // Replace with your actual Addon type if needed

type Item = {
  _id: string
  itemName: string
  itemDesc: string | null
  itemImage: string | null
  price: number
  pricePer: string
  isFood: boolean
  vegNonVeg: "Veg" | "Non-Veg" | "Egg" | null
  calories: number | null
  portionSize: string | null
  tags: string[]
  isAvailable: boolean
  willHaveAddon: boolean
  addons: Addon[] | []
  subCategoryId: string | null
  categoryId: string
  serviceId: string
  hotelId: string
  createdAt: Date
  updatedAt: Date
}

// For storing category and subcategory data
type CategoryMap = {
  [id: string]: any
}

// Add custom styles for dropdown scrollbars
const scrollbarStyles = `
  .scrollable-dropdown::-webkit-scrollbar {
    width: 6px;
  }
  .scrollable-dropdown::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  .scrollable-dropdown::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  .scrollable-dropdown::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`

export default function Page() {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCategoryLoading, setIsCategoryLoading] = useState(true)
  const [isSubCategoryLoading, setIsSubCategoryLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null)

  // Maps to store category and subcategory names by ID
  const [categoryMap, setCategoryMap] = useState<CategoryMap>({})
  const [subCategoryMap, setSubCategoryMap] = useState<CategoryMap>({})
  const [fetchedCategories, setFetchedCategories] = useState<any[]>([])
  const [fetchedSubCategories, setFetchedSubCategories] = useState<any[]>([])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch items
        const itemsRes = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-items`)
        const itemsData = await itemsRes.json()

        if (!itemsRes.ok || !Array.isArray(itemsData.items)) {
          throw new Error("Failed to fetch items")
        }

        setItems(itemsData.items)

        // Fetch categories and subcategories
        await fetchCategoriesAndSubCategories()
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load items")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const fetchCategoriesAndSubCategories = async () => {
    try {
      setIsCategoryLoading(true)
      setIsSubCategoryLoading(true)

      // Fetch categories
      const catRes = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-categories`)
      const catData = await catRes.json()

      if (catRes.ok && Array.isArray(catData.categories)) {
        const catMap: CategoryMap = {}
        catData.categories.forEach((cat: any) => {
          catMap[cat._id] = cat
        })
        setCategoryMap(catMap)
        setFetchedCategories(catData.categories)
      }
      setIsCategoryLoading(false)

      // Fetch subcategories
      const subCatRes = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-subCategories`)
      const subCatData = await subCatRes.json()

      if (subCatRes.ok && Array.isArray(subCatData.subCategories)) {
        const subCatMap: CategoryMap = {}
        subCatData.subCategories.forEach((subCat: any) => {
          subCatMap[subCat._id] = subCat
        })
        setSubCategoryMap(subCatMap)
        setFetchedSubCategories(subCatData.subCategories)
      }
      setIsSubCategoryLoading(false)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to load categories")
      setIsCategoryLoading(false)
      setIsSubCategoryLoading(false)
    }
  }

  const toggleAvailable = async (itemId: string) => {
    try {
      await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/toggle-item-avalibility/${itemId}`, {
        method: "PUT",
      })

      const updatedItems = items.map((item) =>
        item._id === itemId ? { ...item, isAvailable: !item.isAvailable } : item,
      )
      setItems(updatedItems)
      toast.success("Item availability updated")
    } catch (error) {
      console.error("Error updating item availability:", error)
      toast.error("Failed to update item availability")
    }
  }

  const updateItem = async (updatedItem: Item) => {
    try {
      // Find the item in the current items array and update it
      const updatedItems = items.map((item) => (item._id === updatedItem._id ? updatedItem : item))

      setItems(updatedItems)
      toast.success("Item updated successfully")

      // Optionally refresh the items list from the server
      const refreshRes = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-items`)
      const refreshData = await refreshRes.json()

      if (refreshRes.ok && Array.isArray(refreshData.items)) {
        setItems(refreshData.items)
      }
    } catch (error) {
      console.error("Error updating item:", error)
      toast.error("Failed to update item")
    }
  }

  const handleAddItem = async (formData: FormData) => {
    try {
      const refreshRes = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-items`)
      const refreshData = await refreshRes.json()

      if (refreshRes.ok && Array.isArray(refreshData.items)) {
        setItems(refreshData.items)
      }

      // Refresh categories and subcategories in case new ones were added
      await fetchCategoriesAndSubCategories()

      setShowAddForm(false)
      toast.success("Item added successfully")
    } catch (error) {
      console.error("Error adding item:", error)
      toast.error(error instanceof Error ? error.message : "Failed to add item")
    }
  }

  const getSelectedCategoryName = () => {
    if (!selectedCategoryId || selectedCategoryId === "all") return "All Categories"
    return categoryMap[selectedCategoryId]?.categoryName || categoryMap[selectedCategoryId]?.name || "Category"
  }

  const getSelectedSubCategoryName = () => {
    if (!selectedSubCategoryId || selectedSubCategoryId === "all") return "All Subcategories"
    return (
      subCategoryMap[selectedSubCategoryId]?.subCategoryName ||
      subCategoryMap[selectedSubCategoryId]?.name ||
      "Subcategory"
    )
  }

  // Filter items based on search query and filters
  const filteredItems = items.filter((item) => {
    // Search query filter
    const matchesSearch =
      !searchQuery.trim() ||
      item.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemDesc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (categoryMap[item.categoryId] &&
        (categoryMap[item.categoryId].categoryName || categoryMap[item.categoryId].name)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))

    // Category filter
    const matchesCategory =
      !selectedCategoryId || selectedCategoryId === "all" || item.categoryId === selectedCategoryId

    // Subcategory filter
    const matchesSubCategory =
      !selectedSubCategoryId || selectedSubCategoryId === "all" || item.subCategoryId === selectedSubCategoryId

    return matchesSearch && matchesCategory && matchesSubCategory
  })

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategoryId(null)
    setSelectedSubCategoryId(null)
  }

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategoryId, selectedSubCategoryId])

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500 h-screen w-full flex items-center justify-center">
        <FaSpinner className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <style jsx global>
        {scrollbarStyles}
      </style>
      {/* Page header section */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Manage Items</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and organize all items from here</p>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Search input */}
          <div className="relative w-full md:w-[280px] lg:w-[320px] xl:w-[360px]">
            <input
              type="text"
              placeholder="Search items..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={16} />
            {searchQuery && (
              <button
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            {/* Category filter */}
            <Select value={selectedCategoryId || "all"} onValueChange={setSelectedCategoryId}>
              <SelectTrigger className="w-full md:w-[220px] lg:w-[240px]">
                <SelectValue placeholder="Select a category">{getSelectedCategoryName()}</SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto scrollable-dropdown">
                <SelectItem value="all">All Categories</SelectItem>
                {isCategoryLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading categories...
                  </SelectItem>
                ) : (
                  fetchedCategories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.categoryName || category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {/* Subcategory filter */}
            <Select value={selectedSubCategoryId || "all"} onValueChange={setSelectedSubCategoryId}>
              <SelectTrigger className="w-full md:w-[220px] lg:w-[240px]">
                <SelectValue placeholder="Select a subcategory">{getSelectedSubCategoryName()}</SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto scrollable-dropdown">
                <SelectItem value="all">All Subcategories</SelectItem>
                {isSubCategoryLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading subcategories...
                  </SelectItem>
                ) : (
                  fetchedSubCategories.map((subcategory) => (
                    <SelectItem key={subcategory._id} value={subcategory._id}>
                      {subcategory.subCategoryName || subcategory.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto md:ml-auto">
            {(searchQuery || selectedCategoryId || selectedSubCategoryId) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 w-full md:w-auto whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 w-full md:w-auto whitespace-nowrap"
            >
              Add New Item
            </button>
          </div>
        </div>
      </div>

      {/* Display active filters */}
      {(searchQuery || selectedCategoryId || selectedSubCategoryId) && (
        <div className="text-sm text-gray-500 flex flex-wrap gap-2 items-center">
          <span>
            Found {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
          </span>

          {searchQuery && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100">
              Search: {searchQuery}
              <button className="ml-1 text-gray-500 hover:text-gray-700" onClick={() => setSearchQuery("")}>
                ×
              </button>
            </span>
          )}

          {selectedCategoryId && selectedCategoryId !== "all" && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100">
              Category:{" "}
              {categoryMap[selectedCategoryId]?.categoryName ||
                categoryMap[selectedCategoryId]?.name ||
                selectedCategoryId}
              <button className="ml-1 text-gray-500 hover:text-gray-700" onClick={() => setSelectedCategoryId(null)}>
                ×
              </button>
            </span>
          )}

          {selectedSubCategoryId && selectedSubCategoryId !== "all" && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100">
              Subcategory:{" "}
              {subCategoryMap[selectedSubCategoryId]?.subCategoryName ||
                subCategoryMap[selectedSubCategoryId]?.name ||
                selectedSubCategoryId}
              <button className="ml-1 text-gray-500 hover:text-gray-700" onClick={() => setSelectedSubCategoryId(null)}>
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden sm:block">
        <ItemsTable
          items={filteredItems}
          toggleAvailable={toggleAvailable}
          updateItem={updateItem}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Mobile Cards - Only visible on mobile */}
      <div className="sm:hidden">
        <MobileItemsList
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          items={filteredItems}
          toggleAvailable={toggleAvailable}
          updateItem={updateItem}
        />
      </div>

      {showAddForm && <AddItemForm onCloseAction={() => setShowAddForm(false)} onSubmitAction={handleAddItem} />}
    </div>
  )
}

