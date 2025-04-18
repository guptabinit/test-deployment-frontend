"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { FiUpload, FiX } from "react-icons/fi"
import { fetchWithAuth } from "@/app/manager/_lib/fetch-with-auth"
import type { Item as MenuItem } from "@/types/menu/Items"
import type { Category } from "@/types/menu/Categories"
import type { Service } from "@/types/menu/Services"
import type { SubCategory } from "@/types/menu/SubCategories"
import type { Addon } from "@/types/menu/Addons"

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  item: MenuItem | null
  onSave: (updatedItem: MenuItem) => Promise<void>
}

// Helper function to flatten and clean tags array
const flattenAndCleanTags = (tags: any[]): string[] => {
  const result: string[] = []

  // Process each item in the array
  tags.forEach((tag) => {
    if (!tag) return // Skip null/undefined

    if (typeof tag === "string") {
      // Try to parse if it looks like JSON
      if (tag.startsWith("[") || tag.startsWith("{")) {
        try {
          const parsed = JSON.parse(tag)
          if (Array.isArray(parsed)) {
            // Recursively flatten nested arrays
            result.push(...flattenAndCleanTags(parsed))
          } else if (typeof parsed === "string") {
            result.push(parsed)
          }
        } catch (e) {
          // Not valid JSON, add as is if not empty
          if (tag.trim() !== "") {
            result.push(tag)
          }
        }
      } else if (tag.trim() !== "") {
        // Regular string, add if not empty
        result.push(tag)
      }
    } else if (Array.isArray(tag)) {
      // Recursively flatten nested arrays
      result.push(...flattenAndCleanTags(tag))
    }
  })

  // Remove duplicates and return
  return [...new Set(result)]
}

export function EditModal({ isOpen, onClose, item, onSave }: EditModalProps) {
  const [formData, setFormData] = useState<{
    itemName: string
    itemDesc: string
    itemImage: File | null
    previewUrl: string
    currentImageUrl: string | null
    price: string
    pricePer: string
    isFood: boolean
    vegNonVeg: "Veg" | "Non-Veg" | "Egg" | null
    calories: string
    portionSize: string
    tags: string[]
    isAvailable: boolean
    willHaveAddon: boolean
    categoryId: string
    subCategoryId: string
    serviceId: string
    selectedAddons: string[]
  }>({
    itemName: "",
    itemDesc: "",
    itemImage: null,
    previewUrl: "",
    currentImageUrl: null,
    price: "",
    pricePer: "plate",
    isFood: true,
    vegNonVeg: null,
    calories: "",
    portionSize: "",
    tags: [],
    isAvailable: true,
    willHaveAddon: false,
    categoryId: "",
    subCategoryId: "",
    serviceId: "",
    selectedAddons: [],
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<SubCategory[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [addons, setAddons] = useState<Addon[]>([])
  const [availableTags, setAvailableTags] = useState<{ _id: string; tagName: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showEditAddon, setShowEditAddon] = useState(false)
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null)

  // Fetch all necessary data when the modal opens
  useEffect(() => {
    if (isOpen && item) {
      fetchAllData()
    }
  }, [isOpen, item])

  // Initialize form with item data when item changes
  useEffect(() => {
    if (item) {
      // Process tags to ensure they're flat strings
      let processedTags: string[] = []

      if (item.tags) {
        // Handle if item.tags is already an array
        if (Array.isArray(item.tags)) {
          processedTags = flattenAndCleanTags(item.tags)
        }
        // Handle if item.tags is a string (possibly JSON)
        else if (typeof item.tags === "string") {
          try {
            const parsedTags = JSON.parse(item.tags)
            if (Array.isArray(parsedTags)) {
              processedTags = flattenAndCleanTags(parsedTags)
            }
          } catch (e) {
            // Not valid JSON, use as is if not empty
            if (String(item.tags).trim() !== "") {
              processedTags = [item.tags]
            }
          }
        }
      }

      setFormData({
        itemName: item.itemName || "",
        itemDesc: item.itemDesc || "",
        itemImage: null,
        previewUrl: "",
        currentImageUrl: item.itemImage || null,
        price: item.price?.toString() || "",
        pricePer: item.pricePer || "plate",
        isFood: item.isFood !== undefined ? item.isFood : true,
        vegNonVeg: (item.vegNonVeg as "Veg" | "Non-Veg" | "Egg" | null) || null,
        calories: item.calories?.toString() || "",
        portionSize: item.portionSize || "",
        tags: processedTags,
        isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
        willHaveAddon: item.willHaveAddon || false,
        categoryId: item.categoryId || "",
        subCategoryId: item.subCategoryId || "",
        serviceId: item.serviceId || "",
        selectedAddons: item.addons?.map((addon) => (typeof addon === "string" ? addon : addon._id)) || [],
      })
    }
  }, [item])

  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      // Fetch categories
      const categoryRes = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-categories`)
      const categoryData = await categoryRes.json()
      if (categoryRes.ok && Array.isArray(categoryData.categories)) {
        setCategories(categoryData.categories)
      }

      // Fetch available tags
      const tagRes = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-all-tags`)
      const tagData = await tagRes.json()
      if (tagRes.ok && Array.isArray(tagData.tags)) {
        setAvailableTags(tagData.tags)
      }

      // Fetch subcategories
      const subcategoryRes = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-subcategories`)
      const subcategoryData = await subcategoryRes.json()
      if (subcategoryRes.ok && Array.isArray(subcategoryData.subCategories)) {
        setSubcategories(subcategoryData.subCategories)
      }

      // Fetch services
      const serviceRes = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-services`)
      const serviceData = await serviceRes.json()
      if (serviceRes.ok && Array.isArray(serviceData.services)) {
        setServices(serviceData.services)
      }

      // Fetch addons
      const addonRes = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-addons`)
      const addonData = await addonRes.json()
      if (addonRes.ok && Array.isArray(addonData.addons)) {
        setAddons(addonData.addons)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load form data")
    } finally {
      setIsLoading(false)
    }
  }

  // Get subcategories for the selected category
  const getFilteredSubcategories = () => {
    if (!formData.categoryId) return []

    return subcategories.filter((sub) => {
      const subCategoryId = typeof sub.categoryId === "object" ? sub.categoryId : sub.categoryId
      return subCategoryId === formData.categoryId
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({
        ...formData,
        itemImage: file,
        previewUrl: URL.createObjectURL(file),
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!item?._id) {
      toast.error("Item ID is missing")
      return
    }

    // Validate required fields
    if (!formData.itemName.trim()) {
      toast.error("Item name is required")
      return
    }

    if (!formData.price) {
      toast.error("Price is required")
      return
    }

    if (!formData.pricePer.trim()) {
      toast.error("Price per unit is required")
      return
    }

    if (!formData.categoryId) {
      toast.error("Please select a category")
      return
    }

    if (!formData.serviceId) {
      toast.error("Please select a service")
      return
    }

    // Create FormData object for file upload
    const submitData = new FormData()
    submitData.append("itemName", formData.itemName)
    submitData.append("itemDesc", formData.itemDesc || "")
    submitData.append("price", formData.price)
    submitData.append("pricePer", formData.pricePer)
    submitData.append("isFood", String(formData.isFood))
    if (formData.vegNonVeg) submitData.append("vegNonVeg", formData.vegNonVeg)
    if (formData.calories) submitData.append("calories", formData.calories)
    if (formData.portionSize) submitData.append("portionSize", formData.portionSize)
    submitData.append("isAvailable", String(formData.isAvailable))
    submitData.append("willHaveAddon", String(formData.willHaveAddon))
    submitData.append("categoryId", formData.categoryId)
    if (formData.subCategoryId) submitData.append("subCategoryId", formData.subCategoryId)
    submitData.append("serviceId", formData.serviceId)

    // Append tags as JSON string - ensure we're sending a clean array
    const cleanedTags = [...new Set(formData.tags.filter((tag) => tag && typeof tag === "string" && tag.trim() !== ""))]
    submitData.append("tags", JSON.stringify(cleanedTags))

    // Append selected addons as JSON string
    if (formData.willHaveAddon && formData.selectedAddons.length > 0) {
      submitData.append("addons", JSON.stringify(formData.selectedAddons))
    }

    // Append image file if a new one was selected
    if (formData.itemImage) {
      submitData.append("itemImage", formData.itemImage)
    }

    setIsSubmitting(true)

    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/edit-item/${item._id}`, {
        method: "PUT",
        body: submitData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update item")
      }

      const data = await response.json()
      toast.success("Item updated successfully")

      // Call the parent's onSave to refresh the items list
      await onSave(data.item || item)
      onClose()
    } catch (error) {
      console.error("Error updating item:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update item")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get filtered subcategories
  const filteredSubcategories = getFilteredSubcategories()

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin h-6 w-6 border-2 border-gray-500 rounded-full border-t-transparent"></div>
            <span className="ml-2">Loading form data...</span>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {formData.previewUrl ? (
              <div className="relative">
                <img
                  src={formData.previewUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      itemImage: null,
                      previewUrl: "",
                    })
                  }
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                  disabled={isSubmitting}
                >
                  <FiX size={16} />
                </button>
              </div>
            ) : formData.currentImageUrl ? (
              <div className="relative">
                <img
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${formData.currentImageUrl}`}
                  alt="Current"
                  className="w-full h-48 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      currentImageUrl: null,
                    })
                  }
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                  disabled={isSubmitting}
                >
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="item-image"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="item-image"
                  className={`flex flex-col items-center gap-2 cursor-pointer ${isSubmitting ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <FiUpload size={24} className="text-gray-400" />
                  <span className="text-sm text-gray-500">Upload Item Image</span>
                </label>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label>Item Name *</Label>
              <Input
                required
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.itemDesc}
                rows={3}
                onChange={(e) => setFormData({ ...formData, itemDesc: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Service, Category, Subcategory Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Service *</Label>
              <Select
                value={formData.serviceId}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    serviceId: value,
                    // Reset category when service changes as categories are filtered by service
                    categoryId: "",
                    subCategoryId: "",
                  })
                }
                required
                disabled={isSubmitting || !services.length}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service._id} value={service._id}>
                      {service.serviceName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Category *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    categoryId: value,
                    subCategoryId: "", // Reset subcategory when category changes
                  })
                }
                required
                disabled={isSubmitting || !formData.serviceId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((category) => {
                      const catServiceId =
                        typeof category.serviceId === "object" ? category.serviceId : category.serviceId
                      return catServiceId === formData.serviceId
                    })
                    .map((category) => (
                      <SelectItem key={category._id.toString()} value={category._id.toString()}>
                        {category.categoryName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Subcategory</Label>
              <Select
                value={formData.subCategoryId}
                onValueChange={(value) => setFormData({ ...formData, subCategoryId: value })}
                disabled={isSubmitting || !formData.categoryId || filteredSubcategories.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      filteredSubcategories.length === 0 ? "No subcategories available" : "Select subcategory"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubcategories.map((subcategory) => (
                    <SelectItem key={subcategory._id.toString()} value={subcategory._id.toString()}>
                      {subcategory.subCategoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Food Type Selection */}
          <div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.isFood}
                onCheckedChange={(checked) => setFormData({ ...formData, isFood: checked as boolean })}
                id="is-food"
                disabled={isSubmitting}
              />
              <Label htmlFor="is-food">Is this a food item? *</Label>
            </div>
          </div>

          {/* Veg/Non-Veg Selection */}
          {formData.isFood && (
            <div>
              <Label>Type</Label>
              <Select
                value={formData.vegNonVeg || ""}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    vegNonVeg: value ? (value as "Veg" | "Non-Veg" | "Egg") : null,
                  })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Veg">Veg</SelectItem>
                  <SelectItem value="Non-Veg">Non-Veg</SelectItem>
                  <SelectItem value="Egg">Egg</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Price Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Price *</Label>
              <Input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label>Price Per *</Label>
              <Input
                placeholder="e.g., piece, plate"
                required
                value={formData.pricePer}
                onChange={(e) => setFormData({ ...formData, pricePer: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Additional Info */}
          {formData.isFood && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Calories</Label>
                <Input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  placeholder="e.g., 250"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label>Portion Size</Label>
                <Input
                  placeholder="e.g., 200g, 2 pieces"
                  value={formData.portionSize}
                  onChange={(e) => setFormData({ ...formData, portionSize: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          {/* Availability */}
          <div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.isAvailable}
                onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked as boolean })}
                id="is-available"
                disabled={isSubmitting}
              />
              <Label htmlFor="is-available">Item is available</Label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Tags</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <label
                  key={tag._id}
                  className={`flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full ${isSubmitting ? "opacity-50" : ""}`}
                >
                  <Checkbox
                    checked={formData.tags.includes(tag.tagName)}
                    onCheckedChange={(checked) => {
                      let updatedTags
                      if (checked) {
                        // Only add the tag if it's not already in the array
                        updatedTags = formData.tags.includes(tag.tagName)
                          ? [...formData.tags] // Create a new array reference but keep same content
                          : [...formData.tags, tag.tagName]
                      } else {
                        updatedTags = formData.tags.filter((t) => t !== tag.tagName)
                      }
                      setFormData({ ...formData, tags: updatedTags })
                    }}
                    disabled={isSubmitting}
                  />
                  <span className="text-sm">{tag.tagName}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Add-ons Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Add-ons</Label>
            </div>

            <RadioGroup
              value={formData.willHaveAddon ? "yes" : "no"}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  willHaveAddon: value === "yes",
                  selectedAddons: value === "yes" ? formData.selectedAddons : [],
                })
              }
              className="flex gap-4"
              disabled={isSubmitting}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no-addons" disabled={isSubmitting} />
                <Label htmlFor="no-addons">No Add-ons</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="has-addons" disabled={isSubmitting} />
                <Label htmlFor="has-addons">Has Add-ons</Label>
              </div>
            </RadioGroup>

            {formData.willHaveAddon && (
              <div className="space-y-4 pl-6 mt-4">
                <div className="flex justify-between items-center">
                  <Label>Select Applicable Add-ons</Label>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-3">
                  {addons.length > 0 ? (
                    addons.map((addon) => (
                      <div key={addon._id.toString()} className="flex items-start gap-2 py-2 border-b last:border-b-0">
                        <Checkbox
                          checked={formData.selectedAddons.includes(addon._id.toString())}
                          onCheckedChange={(checked) => {
                            const updatedAddons = checked
                              ? [...formData.selectedAddons, addon._id.toString()]
                              : formData.selectedAddons.filter((id) => id !== addon._id.toString())
                            setFormData({ ...formData, selectedAddons: updatedAddons })
                          }}
                          id={`addon-${addon._id}`}
                          className="mt-1"
                          disabled={isSubmitting}
                        />
                        <div className="flex-1">
                          <Label htmlFor={`addon-${addon._id}`} className="flex justify-between">
                            <span className="font-medium">{addon.addonName}</span>
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                              {addon.type === "multi-select" ? "Multi-select" : "Single-select"}
                            </span>
                          </Label>
                          {addon.addonDesc && <p className="text-xs text-gray-500 mt-1">{addon.addonDesc}</p>}
                          {addon.applicableItems && addon.applicableItems.length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs text-gray-500 mb-1">Options:</div>
                              <div className="pl-2 border-l-2 border-gray-100">
                                {addon.applicableItems.map((item, idx) => (
                                  <div key={idx} className="text-xs py-1 flex justify-between">
                                    <span>{item.name}</span>
                                    <span className="font-medium">
                                      ₹{item.price} / {item.pricePer}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">No add-ons available.</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="mr-2">Updating...</span>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                "Update Item"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

