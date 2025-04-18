"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { FiUpload, FiX, FiPlus, FiEdit } from "react-icons/fi"
import { fetchWithAuth } from "@/app/manager/_lib/fetch-with-auth"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { Category } from "@/types/menu/Categories"
import type { Service } from "@/types/menu/Services"
import type { SubCategory } from "@/types/menu/SubCategories"
import type { Addon } from "@/types/menu/Addons"
import { CreateAddonForm } from "./CreateAddonForm"
import { FiTrash2 as FiTrash } from "react-icons/fi"

interface AddonItem {
  name: string
  price: string | number
  pricePer: string
}

interface EditAddonFormProps {
  addon: Addon
  onCloseAction: () => void
  onSubmitAction: (data: any) => void
}

const EditAddonForm = ({ addon, onCloseAction, onSubmitAction }: EditAddonFormProps) => {
  const [formData, setFormData] = useState({
    addonName: "",
    addonDesc: "",
    type: "multi-select" as "single-select" | "multi-select",
    applicableItems: [{ name: "", price: "", pricePer: "item" }],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with existing addon data
  useEffect(() => {
    if (addon) {
      setFormData({
        addonName: addon.addonName,
        addonDesc: addon.addonDesc || "",
        type: addon.type,
        applicableItems: addon.applicableItems.map((item) => ({
          name: item.name,
          price: typeof item.price === "number" ? item.price.toString() : item.price,
          pricePer: item.pricePer || "item",
        })),
      })
    }
  }, [addon])

  const handleAddOption = () => {
    setFormData({
      ...formData,
      applicableItems: [...formData.applicableItems, { name: "", price: "", pricePer: "item" }],
    })
  }

  const handleRemoveOption = (index: number) => {
    if (formData.applicableItems.length <= 1) return

    const updatedOptions = [...formData.applicableItems]
    updatedOptions.splice(index, 1)
    setFormData({
      ...formData,
      applicableItems: updatedOptions,
    })
  }

  const handleOptionChange = (index: number, field: "name" | "price" | "pricePer", value: string) => {
    const updatedOptions = [...formData.applicableItems]
    updatedOptions[index][field] = value
    setFormData({
      ...formData,
      applicableItems: updatedOptions,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.addonName.trim()) {
      toast.error("Addon name is required")
      return
    }

    // Validate all applicable items have names and prices
    const invalidItems = formData.applicableItems.filter((item) => !item.name.trim() || !item.price.toString().trim())

    if (invalidItems.length > 0) {
      toast.error("All applicable items must have a name and price")
      return
    }

    // Format the data to match the schema
    const formattedData = {
      id: addon._id, // Include the ID for the update operation
      addonName: formData.addonName,
      addonDesc: formData.addonDesc || null,
      type: formData.type,
      applicableItems: formData.applicableItems.map((item) => ({
        name: item.name,
        price: Number.parseFloat(item.price.toString()),
        pricePer: item.pricePer || "item",
      })),
    }

    setIsSubmitting(true)

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/edit-addon/${addon._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update addon")
      }

      const data = await response.json()
      toast.success("Addon updated successfully")

      // Pass the updated addon back to the parent component and close the modal
      onSubmitAction(data.addon || formattedData)
      onCloseAction() // Close the modal
    } catch (error) {
      console.error("Error updating addon:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update addon")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this add-on?")) {
      setIsSubmitting(true)
      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/delete-addon/${addon._id}`,
          {
            method: "DELETE",
          },
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to delete addon")
        }

        toast.success("Add-on deleted successfully")
        onSubmitAction({ deleted: true, id: addon._id })
        onCloseAction() // Close the modal
      } catch (error) {
        console.error("Error deleting addon:", error)
        toast.error(error instanceof Error ? error.message : "Failed to delete add-on")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <Dialog open onOpenChange={onCloseAction}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Add-on</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Add-on Name *</Label>
            <Input
              required
              value={formData.addonName}
              onChange={(e) => setFormData({ ...formData, addonName: e.target.value })}
              placeholder="e.g., Extra Toppings"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.addonDesc || ""}
              onChange={(e) => setFormData({ ...formData, addonDesc: e.target.value })}
              placeholder="Description"
              rows={2}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label>Selection Type *</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  type: value as "single-select" | "multi-select",
                })
              }
              className="flex gap-4"
              disabled={isSubmitting}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single-select" id="single-select" />
                <Label htmlFor="single-select">Single-select (radio buttons)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multi-select" id="multi-select" />
                <Label htmlFor="multi-select">Multi-select (checkboxes)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Applicable Items *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="flex items-center gap-1"
                disabled={isSubmitting}
              >
                <FiPlus size={14} />
                <span>Add Item</span>
              </Button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto border rounded-md p-3">
              {formData.applicableItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Input
                      value={item.name}
                      onChange={(e) => handleOptionChange(index, "name", e.target.value)}
                      placeholder="Item name *"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleOptionChange(index, "price", e.target.value)}
                      placeholder="Price *"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      value={item.pricePer}
                      onChange={(e) => handleOptionChange(index, "pricePer", e.target.value)}
                      placeholder="Per"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOption(index)}
                      className="text-red-500 h-8 w-8 p-0"
                      disabled={formData.applicableItems.length <= 1 || isSubmitting}
                    >
                      <FiTrash size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="destructive"
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="mr-auto"
            >
              <FiTrash size={16} className="mr-2" />
              Delete
            </Button>
            <Button variant="outline" type="button" onClick={onCloseAction} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="mr-2">Updating...</span>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                "Update Add-on"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface AddItemFormProps {
  onCloseAction: () => void
  onSubmitAction: (data: any) => Promise<void>
}

export const AddItemForm = ({ onCloseAction, onSubmitAction }: AddItemFormProps) => {
  const [formData, setFormData] = useState({
    itemName: "",
    itemDesc: "",
    itemImage: null as File | null,
    previewUrl: "",
    price: "",
    pricePer: "plate",
    isFood: true,
    vegNonVeg: "Veg" as "Veg" | "Non-Veg" | "Egg" | null,
    calories: "",
    portionSize: "",
    tags: [] as string[],
    isAvailable: true,
    willHaveAddon: false,
    categoryId: "",
    subCategoryId: "",
    serviceId: "",
    selectedAddons: [] as any,
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<SubCategory[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [addons, setAddons] = useState<Addon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCreateAddon, setShowCreateAddon] = useState(false)
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null)
  const [debug, setDebug] = useState<{
    categoryIds: string[]
    subcategoryIds: string[]
    matches: number
  }>({ categoryIds: [], subcategoryIds: [], matches: 0 })

  const [availableTags, setAvailableTags] = useState<{ _id: string; tagName: string }[]>([])

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

        // Debug: Check if any subcategories match any categories
        if (categoryData.categories && categoryData.categories.length > 0 && subcategoryData.subCategories.length > 0) {
          const catIds = categoryData.categories.map((c: any) => c._id.toString())
          const subCatIds = subcategoryData.subCategories.map((s: any) => s.categoryId.toString())

          let matchCount = 0
          for (const subCatId of subCatIds) {
            if (catIds.includes(subCatId)) {
              matchCount++
            }
          }

          setDebug({
            categoryIds: catIds,
            subcategoryIds: subCatIds,
            matches: matchCount,
          })
        }
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

  useEffect(() => {
    fetchAllData()
  }, [])

  // Get subcategories for the selected category
  const getFilteredSubcategories = () => {
    if (!formData.categoryId) return []

    // For debugging
    console.log("Looking for subcategories with categoryId:", formData.categoryId)

    return subcategories.filter((sub) => {
      const subCategoryId = typeof sub.categoryId === "object" ? sub.categoryId : sub.categoryId

      const result = subCategoryId === formData.categoryId

      if (result) {
        console.log("Match found:", sub.subCategoryName)
      }

      return result
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

  const handleDelete = async (addonId: string) => {
    if (window.confirm("Are you sure you want to delete this add-on?")) {
      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/delete-addon/${addonId}`,
          {
            method: "DELETE",
          },
        )

        if (response.ok) {
          toast.success("Add-on deleted successfully.")
          setAddons((prevAddons) => prevAddons.filter((addon) => addon._id !== addonId))
        } else {
          toast.error("Failed to delete add-on.")
        }
      } catch (error) {
        toast.error("An error occurred while deleting the add-on.")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.itemName.trim()) {
      toast.error("Item name is required")
      return
    }

    if (!formData.itemImage) {
      toast.error("Please upload an item image")
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

    // Append tags as JSON string
    submitData.append("tags", JSON.stringify(formData.tags))

    // Append selected addons as JSON string
    if (formData.willHaveAddon && formData.selectedAddons.length > 0) {
      submitData.append("addons", JSON.stringify(formData.selectedAddons))
    }

    // Append image file
    if (formData.itemImage) {
      submitData.append("itemImage", formData.itemImage)
    }

    setIsSubmitting(true)

    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/create-item`, {
        method: "POST",
        body: submitData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create item")
      }

      const data = await response.json()
      toast.success("Item created successfully")

      // Close the form and refresh the items list
      onCloseAction()

      // Call the parent's onSubmitAction to refresh the items list
      await onSubmitAction(data)
    } catch (error) {
      console.error("Error creating item:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create item")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateAddon = async (addonData: any) => {
    try {
      // Close the modal first
      setShowCreateAddon(false)

      // Only fetch the addons without refreshing the entire form
      const addonRes = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-addons`)
      const addonData = await addonRes.json()

      if (addonRes.ok && Array.isArray(addonData.addons)) {
        // Only update the addons state, not all form data
        setAddons(addonData.addons)
        toast.success("New addon added successfully")
      }
    } catch (error) {
      console.error("Error refreshing addons:", error)
      toast.error("Failed to refresh addon list")
    }
  }

  const handleEditAddon = (addon: Addon) => {
    setEditingAddon(addon)
  }

  const handleEditAddonSubmit = async (data: any) => {
    // If the addon was deleted
    if (data.deleted) {
      setAddons((prevAddons) => prevAddons.filter((addon) => addon._id !== data.id))
      setEditingAddon(null)
      return
    }

    try {
      // Refresh the addons list
      const addonRes = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-addons`)
      const addonData = await addonRes.json()

      if (addonRes.ok && Array.isArray(addonData.addons)) {
        setAddons(addonData.addons)
      }

      setEditingAddon(null)
    } catch (error) {
      console.error("Error refreshing addons after edit:", error)
      toast.error("Failed to refresh addon list")
    }
  }

  // Get filtered subcategories
  const filteredSubcategories = getFilteredSubcategories()

  if (isLoading) {
    return (
      <Dialog open onOpenChange={onCloseAction}>
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
    <Dialog open onOpenChange={onCloseAction}>
      <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
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
                  <span className="text-sm text-gray-500">Upload Item Image *</span>
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
              {debug.matches === 0 && formData.categoryId && (
                <p className="text-xs text-amber-600 mt-1">
                  No subcategories found for this category. Subcategory selection is optional.
                </p>
              )}
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
                disabled={true}
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
                      const updatedTags = checked
                        ? [...formData.tags, tag.tagName]
                        : formData.tags.filter((t) => t !== tag.tagName)
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
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateAddon(true)}
                    className="flex items-center gap-1"
                    disabled={isSubmitting}
                  >
                    <FiPlus size={14} />
                    <span>Create New Add-on</span>
                  </Button>
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
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAddon(addon)}
                            className="h-8 w-8 p-0"
                            disabled={isSubmitting}
                          >
                            <FiEdit size={14} />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No add-ons available. Please create add-ons first.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={onCloseAction} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="mr-2">Creating...</span>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                "Add Item"
              )}
            </Button>
          </div>
        </form>

        {/* Create Addon Dialog */}
        {showCreateAddon && (
          <CreateAddonForm onCloseAction={() => setShowCreateAddon(false)} onSubmitAction={handleCreateAddon} />
        )}

        {/* Edit Addon Dialog */}
        {editingAddon && (
          <EditAddonForm
            addon={editingAddon}
            onCloseAction={() => setEditingAddon(null)}
            onSubmitAction={handleEditAddonSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

