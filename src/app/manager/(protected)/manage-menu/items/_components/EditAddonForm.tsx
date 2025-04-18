"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { FiPlus, FiTrash2 } from "react-icons/fi"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { fetchWithAuth } from "@/app/manager/_lib/fetch-with-auth"

interface AddonItem {
  name: string
  price: string | number
  pricePer: string
}

interface Addon {
  id: string
  addonName: string
  addonDesc: string | null
  type: "single-select" | "multi-select"
  applicableItems: AddonItem[]
}

interface EditAddonFormProps {
  addon: Addon
  onCloseAction: () => void
  onSubmitAction: (data: any) => void
}

export const EditAddonForm = ({ addon, onCloseAction, onSubmitAction }: EditAddonFormProps) => {
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
      id: addon.id, // Include the ID for the update operation
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
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/edit-addon/${addon.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      })

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
                      <FiTrash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
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

