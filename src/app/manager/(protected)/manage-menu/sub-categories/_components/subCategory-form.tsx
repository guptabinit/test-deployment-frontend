"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { z } from "zod"
import { toast } from "sonner"
import { fetchWithAuth } from "@/app/manager/_lib/fetch-with-auth"
import { Card } from "@/components/ui/card"
import { FiX } from "react-icons/fi"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const subCategoryFormSchema = z.object({
  subCategoryName: z.string().min(1, "Sub Category name is required."),
  subCategoryDesc: z.string().min(1, "Sub Category description is required."),
  time: z.string().min(1, "Time is required."),
  categoryId: z.string().min(1, "Category ID is required."),
})

type SubCategoryFormData = z.infer<typeof subCategoryFormSchema>

interface SubCategoryFormProps {
  onCloseAction: () => void
  onCreateAction: (data: any) => void
  onEditAction: (data: any, subCategoryId?: string) => void
  subCategoryId?: string
  fetchedCategories: any[]
  isCategoryLoading: boolean
}

function SubCategoryForm({
  onCloseAction,
  onCreateAction,
  onEditAction,
  subCategoryId,
  fetchedCategories,
  isCategoryLoading,
}: SubCategoryFormProps) {
  const [formData, setFormData] = useState<SubCategoryFormData>({
    subCategoryName: "",
    subCategoryDesc: "",
    time: "",
    categoryId: "",
  })
  const [loading, setLoading] = useState(false)
  const [fetchedSubCategory, setFetchedSubCategory] = useState<any>({})

  useEffect(() => {
    if (subCategoryId) {
      const fetchSubCategoryData = async () => {
        setLoading(true)
        try {
          const res = await fetchWithAuth(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-subCategory-data/${subCategoryId}`,
          )

          const data = await res.json()
          if (res.ok && data.subCategory) {
            setFormData({
              subCategoryName: data.subCategory.subCategoryName || "",
              subCategoryDesc: data.subCategory.subCategoryDesc || "",
              time: data.subCategory.time || "",
              categoryId: data.subCategory.categoryId?._id || "",
            })
            setFetchedSubCategory(data.subCategory)
          } else {
            toast.error("Failed to load subCategory data")
          }
        } catch (error) {
          console.error("Error fetching subCategory data:", error)
          toast.error("Error loading subCategory details")
        }
        setLoading(false)
      }

      fetchSubCategoryData()
    }
  }, [subCategoryId])

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validate form data against schema
      const validatedData = subCategoryFormSchema.parse(formData)

      await onCreateAction(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Validation Error", {
          description: error.errors[0].message,
        })
      } else {
        toast.error("An error occurred while saving the subCategory")
      }
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validate form data against schema
      const validatedData = subCategoryFormSchema.parse(formData)

      await onEditAction(validatedData, subCategoryId)
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Validation Error", {
          description: error.errors[0].message,
        })
      } else {
        toast.error("An error occurred while saving the subCategory")
      }
    }
  }

  // Find the selected service name based on serviceId
  const getSelectedCategoryName = () => {
    if (!formData.categoryId) return "Select a category"

    // First check if we're in edit mode and have the fetched sub-category data
    if (subCategoryId && fetchedSubCategory?.categoryId?._id === formData.categoryId) {
      return fetchedSubCategory.categoryId.categoryName
    }

    // Otherwise look up the category name from fetchedCategories
    const selectedCategory = fetchedCategories.find((category) => category._id === formData.categoryId)
    return selectedCategory ? selectedCategory.categoryName : "Select a category"
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="p-6 w-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{subCategoryId ? "Edit SubCategory" : "Create New SubCategory"}</h2>
          <Button variant="ghost" size="icon" onClick={onCloseAction}>
            <FiX size={20} />{" "}
          </Button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading subcategory details...</p>
        ) : (
          <form onSubmit={subCategoryId ? handleEditSubmit : handleCreateSubmit} className="space-y-4">
            <div>
              <Label>SubCategory Name *</Label>
              <Input
                type="text"
                required
                value={formData.subCategoryName}
                onChange={(e) => setFormData({ ...formData, subCategoryName: e.target.value })}
              />
            </div>

            <div>
              <Label>Category *</Label>
              <Select
                value={formData.categoryId || ""}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category">{getSelectedCategoryName()}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {isCategoryLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading categories...
                    </SelectItem>
                  ) : (
                    fetchedCategories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.categoryName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea
                required
                rows={3}
                value={formData.subCategoryDesc}
                onChange={(e) => setFormData({ ...formData, subCategoryDesc: e.target.value })}
              />
            </div>

            <div>
              <Label>Time Slot *</Label>
              <Input
                type="text"
                required
                placeholder="e.g., 9:00 AM - 5:00 PM"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="ghost" onClick={onCloseAction}>
                Cancel
              </Button>
              <Button type="submit">{subCategoryId ? "Update SubCategory" : "Create SubCategory"}</Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}

export default SubCategoryForm

