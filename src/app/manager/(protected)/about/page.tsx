"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { FiEdit, FiSave, FiPlus, FiInfo, FiMapPin, FiPhone, FiClock } from "react-icons/fi"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { fetchWithAuth } from "../../_lib/fetch-with-auth"
import { FaSpinner } from "react-icons/fa"

interface Amenity {
  name: string
  description: string
}

interface GalleryItem {
  url: string
  caption?: string
  file?: File // Add this line
}

interface Overview {
  name: string
  hotelStreet: string
  hotelCity: string
  hotelState: string
  hotelCountry: string
  openingTime: string
  closingTime: string
  phoneNumber: string
}

interface About {
  _id?: string
  overview: Overview
  amenities: Amenity[]
  gallery: GalleryItem[]
  about: string | Record<string, any>
  hotelId: string
}

export default function AboutPage() {
  const [about, setAbout] = useState<About | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Modals
  const [showAmenityModal, setShowAmenityModal] = useState(false)
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [currentAmenity, setCurrentAmenity] = useState<Amenity | null>(null)
  const [currentGalleryItem, setCurrentGalleryItem] = useState<GalleryItem | null>(null)

  // Create empty about data structure for new hotels
  const createEmptyAbout = (): About => ({
    overview: {
      name: "",
      hotelStreet: "",
      hotelCity: "",
      hotelState: "",
      hotelCountry: "",
      openingTime: "",
      closingTime: "",
      phoneNumber: "",
    },
    amenities: [],
    gallery: [],
    about: "",
    hotelId: "", // This would be filled in when saving
  })

  useEffect(() => {
    const fetchAboutData = async () => {
      setLoading(true)
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-about`)

        if (res.status === 404) {
          // About doesn't exist yet, create a new one
          setAbout(createEmptyAbout())
          setIsEditing(true) // Start in edit mode since we need to create it
          setLoading(false)
          return
        }

        if (!res.ok) throw new Error("Failed to fetch about data")

        const data = await res.json()
        setAbout(data.about)
      } catch (error) {
        console.error("Error fetching about data:", error)
        toast.error("Failed to load about information")
        // Still create an empty about object so user can create one
        setAbout(createEmptyAbout())
        setIsEditing(true)
      } finally {
        setLoading(false)
      }
    }

    fetchAboutData()
  }, [])

  // Update the addGalleryItem function to include the preview URL
  const addGalleryItem = (item: GalleryItem & { file?: File; previewUrl?: string }) => {
    if (!about) return

    // Create a new gallery item with the file and preview URL
    const newItem = {
      ...item,
      // If there's a file, use the previewUrl for display before saving
      url: item.previewUrl || item.url,
    }

    if (currentGalleryItem) {
      // Edit existing gallery item
      const updatedGallery = about.gallery.map((g) => (g.url === currentGalleryItem.url ? newItem : g))
      setAbout({
        ...about,
        gallery: updatedGallery,
      })
    } else {
      // Add new gallery item
      setAbout({
        ...about,
        gallery: [...about.gallery, newItem],
      })
    }
    setCurrentGalleryItem(null)
    setShowGalleryModal(false)
  }

  // Update the handleSave function to handle the temporary preview URLs
  const handleSave = async () => {
    if (!about) return

    setSaving(true)
    try {
      const endpoint = about._id
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/edit-about`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/create-about`

      const method = about._id ? "PUT" : "POST"

      // Create FormData to handle file uploads
      const formData = new FormData()

      // Add basic about data
      formData.append("about", typeof about.about === "string" ? about.about : JSON.stringify(about.about))

      // Add overview data
      Object.entries(about.overview).forEach(([key, value]) => {
        formData.append(`overview[${key}]`, value)
      })

      // Add amenities
      about.amenities.forEach((amenity, index) => {
        formData.append(`amenities[${index}][name]`, amenity.name)
        formData.append(`amenities[${index}][description]`, amenity.description)
      })

      // Add gallery items
      about.gallery.forEach((item, index) => {
        // If the item has a file property, it's a new upload
        if (item.file) {
          formData.append(`gallery[${index}][url]`, item.file)
        } else if (item.url) {
          // For existing images, just pass the URL
          // Skip data URLs which are just previews
          if (!item.url.startsWith("data:") && !item.url.startsWith("blob:")) {
            formData.append(`gallery[${index}][url]`, item.url)
          }
        }

        if (item.caption) {
          formData.append(`gallery[${index}][caption]`, item.caption)
        }
      })

      const response = await fetchWithAuth(endpoint, {
        method,
        body: formData,
        // Don't set Content-Type header, let the browser set it with the boundary
      })

      if (!response.ok) throw new Error("Failed to save about information")

      const data = await response.json()

      setAbout(data.data)
      setIsEditing(false)
      toast.success("About information saved successfully!")
    } catch (error) {
      console.error("Error saving about information:", error)
      toast.error("Failed to save about information")
    } finally {
      setSaving(false)
    }
  }

  const handleOverviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (about) {
      setAbout({
        ...about,
        overview: {
          ...about.overview,
          [name]: value,
        },
      })
    }
  }

  const handleAboutTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (about) {
      setAbout({
        ...about,
        about: e.target.value,
      })
    }
  }

  // Amenity management
  const addAmenity = (amenity: Amenity) => {
    if (!about) return

    if (currentAmenity) {
      // Edit existing amenity
      const updatedAmenities = about.amenities.map((a) => (a.name === currentAmenity.name ? amenity : a))
      setAbout({
        ...about,
        amenities: updatedAmenities,
      })
    } else {
      // Add new amenity
      setAbout({
        ...about,
        amenities: [...about.amenities, amenity],
      })
    }
    setCurrentAmenity(null)
    setShowAmenityModal(false)
  }

  const removeAmenity = (name: string) => {
    if (!about) return

    setAbout({
      ...about,
      amenities: about.amenities.filter((a) => a.name !== name),
    })
  }

  // Gallery management

  const removeGalleryItem = (url: string) => {
    if (!about) return

    setAbout({
      ...about,
      gallery: about.gallery.filter((g) => g.url !== url),
    })
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 h-screen w-full flex items-center justify-center">
        <FaSpinner className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    )
  }

  return (
    <div className="container space-y-6 p-8">
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">About Hotel</h1>
          <p className="text-sm text-muted-foreground">Manage your hotel's about information</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <FiEdit className="mr-2 h-4 w-4" />
              Edit Information
            </Button>
          )}
        </div>
      </div>

      {about && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hotel Overview</CardTitle>
                <CardDescription>Basic information about your hotel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Hotel Name</Label>
                    <div className="flex items-center">
                      <FiInfo className="mr-2 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        value={about.overview.name}
                        onChange={handleOverviewChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <div className="flex items-center">
                      <FiPhone className="mr-2 text-muted-foreground" />
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={about.overview.phoneNumber}
                        onChange={handleOverviewChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hotelStreet">Street Address</Label>
                    <div className="flex items-center">
                      <FiMapPin className="mr-2 text-muted-foreground" />
                      <Input
                        id="hotelStreet"
                        name="hotelStreet"
                        value={about.overview.hotelStreet}
                        onChange={handleOverviewChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hotelCity">City</Label>
                    <Input
                      id="hotelCity"
                      name="hotelCity"
                      value={about.overview.hotelCity}
                      onChange={handleOverviewChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hotelState">State/Province</Label>
                    <Input
                      id="hotelState"
                      name="hotelState"
                      value={about.overview.hotelState}
                      onChange={handleOverviewChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hotelCountry">Country</Label>
                    <Input
                      id="hotelCountry"
                      name="hotelCountry"
                      value={about.overview.hotelCountry}
                      onChange={handleOverviewChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="openingTime">Opening Time</Label>
                    <div className="flex items-center">
                      <FiClock className="mr-2 text-muted-foreground" />
                      <Input
                        id="openingTime"
                        name="openingTime"
                        value={about.overview.openingTime}
                        onChange={handleOverviewChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="closingTime">Closing Time</Label>
                    <div className="flex items-center">
                      <FiClock className="mr-2 text-muted-foreground" />
                      <Input
                        id="closingTime"
                        name="closingTime"
                        value={about.overview.closingTime}
                        onChange={handleOverviewChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about">About Description</Label>
                  <Textarea
                    id="about"
                    rows={6}
                    value={typeof about.about === "string" ? about.about : JSON.stringify(about.about)}
                    onChange={handleAboutTextChange}
                    disabled={!isEditing}
                    className="min-h-[150px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Amenities Tab */}
          <TabsContent value="amenities" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Hotel Amenities</CardTitle>
                  <CardDescription>Features and services offered by your hotel</CardDescription>
                </div>
                {isEditing && (
                  <Button
                    onClick={() => {
                      setCurrentAmenity(null)
                      setShowAmenityModal(true)
                    }}
                  >
                    <FiPlus className="mr-2 h-4 w-4" />
                    Add Amenity
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {about.amenities.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No amenities added yet. Click "Add Amenity" to get started.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {about.amenities.map((amenity, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardHeader className="p-4">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{amenity.name}</CardTitle>
                            {isEditing && (
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setCurrentAmenity(amenity)
                                    setShowAmenityModal(true)
                                  }}
                                >
                                  <FiEdit size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive"
                                  onClick={() => removeAmenity(amenity.name)}
                                >
                                  <FiPlus className="rotate-45" size={16} />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-muted-foreground">{amenity.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Hotel Gallery</CardTitle>
                  <CardDescription>Images showcasing your hotel</CardDescription>
                </div>
                {isEditing && (
                  <Button
                    onClick={() => {
                      setCurrentGalleryItem(null)
                      setShowGalleryModal(true)
                    }}
                  >
                    <FiPlus className="mr-2 h-4 w-4" />
                    Add Image
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {about.gallery.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No gallery images added yet. Click "Add Image" to get started.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {about.gallery.map((item, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={
                            item.url.startsWith("blob:") || item.url.startsWith("data:")
                              ? item.url // Use the blob/data URL directly for previews
                              : item.url.startsWith("/")
                                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.url}`
                                : item.url
                          }
                          alt={item.caption || `Gallery image ${index + 1}`}
                          className="w-full h-48 object-cover rounded-md"
                        />
                        {item.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm rounded-b-md">
                            {item.caption}
                          </div>
                        )}
                        {isEditing && (
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 bg-white/80 hover:bg-white"
                              onClick={() => {
                                setCurrentGalleryItem(item)
                                setShowGalleryModal(true)
                              }}
                            >
                              <FiEdit size={14} />
                            </Button>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 bg-white/80 hover:bg-white text-destructive"
                              onClick={() => removeGalleryItem(item.url)}
                            >
                              <FiPlus className="rotate-45" size={14} />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Amenity Modal */}
      <AmenityModal
        open={showAmenityModal}
        onOpenChange={setShowAmenityModal}
        onSave={addAmenity}
        amenity={currentAmenity}
      />

      {/* Gallery Modal */}
      <GalleryModal
        open={showGalleryModal}
        onOpenChange={setShowGalleryModal}
        onSave={addGalleryItem}
        galleryItem={currentGalleryItem}
      />
    </div>
  )
}

// Amenity Modal Component
const AmenityModal = ({
  open,
  onOpenChange,
  onSave,
  amenity,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (amenity: Amenity) => void
  amenity: Amenity | null
}) => {
  const [form, setForm] = useState<Amenity>({
    name: "",
    description: "",
  })

  useEffect(() => {
    if (amenity) {
      setForm(amenity)
    } else {
      setForm({ name: "", description: "" })
    }
  }, [amenity, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    if (!form.name || !form.description) {
      toast.error("Please fill in all fields")
      return
    }

    onSave(form)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{amenity ? "Edit Amenity" : "Add Amenity"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amenity-name">Amenity Name</Label>
            <Input
              id="amenity-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Swimming Pool, Free WiFi"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amenity-description">Description</Label>
            <Textarea
              id="amenity-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the amenity..."
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{amenity ? "Update" : "Add"} Amenity</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Gallery Modal Component
const GalleryModal = ({
  open,
  onOpenChange,
  onSave,
  galleryItem,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (item: GalleryItem) => void
  galleryItem: GalleryItem | null
}) => {
  const [form, setForm] = useState<GalleryItem>({
    url: "",
    caption: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")

  useEffect(() => {
    if (galleryItem) {
      setForm(galleryItem)
      setPreview(
        galleryItem.url.startsWith("/") ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${galleryItem.url}` : galleryItem.url,
      )
    } else {
      setForm({ url: "", caption: "" })
      setPreview("")
    }
    setFile(null)
  }, [galleryItem, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Create a preview URL
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreview(objectUrl)

      // We don't set the URL here as it will be handled by the backend
    }
  }

  // Update the GalleryModal component to include the preview URL when saving
  const handleSubmit = () => {
    if (!file && !form.url) {
      toast.error("Please select an image file or provide a URL")
      return
    }

    // If we have a file, we'll pass it to the parent component with the preview URL
    onSave({
      url: form.url, // Keep the existing URL if editing
      caption: form.caption || "",
      file: file, // Add the file to the gallery item
      previewUrl: file ? preview : form.url, // Include the preview URL for display
    } as GalleryItem & { file?: File; previewUrl?: string })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{galleryItem ? "Edit Gallery Image" : "Add Gallery Image"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-file">Upload Image</Label>
            <Input id="image-file" type="file" accept="image/*" onChange={handleFileChange} />
            <p className="text-xs text-muted-foreground mt-1">
              {galleryItem ? "Upload a new image or keep the existing one" : "Select an image file to upload"}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image-caption">Caption (Optional)</Label>
            <Input
              id="image-caption"
              name="caption"
              value={form.caption || ""}
              onChange={handleChange}
              placeholder="Describe this image..."
            />
          </div>
          {(preview || form.url) && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Preview:</p>
              <div className="relative rounded-md overflow-hidden">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=400"
                    toast.error("Failed to load image. Please check the URL.")
                  }}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{galleryItem ? "Update" : "Add"} Image</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

