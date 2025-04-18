"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FiSave, FiUpload } from "react-icons/fi"
import { toast } from "sonner"
import { fetchWithAuth } from "../../_lib/fetch-with-auth"
import { FaSpinner } from "react-icons/fa"

interface Banner {
  bannerImage: string
  bannerText: string
  bannerImageFile?: File
}

interface HotelColors {
  primary: string
  secondary: string
  tertiary: string
  backgroundColor: string
  textColor?: string
}

interface CustomizationSettings {
  hotelId: string
  hotelLogo: string
  hotelLogoFile?: File
  hotelColors: HotelColors
  banners: Banner[]
}

const BrandingPage = () => {
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const logoFileInputRef = useRef<HTMLInputElement>(null)
  const bannerFileInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [originalSettings, setOriginalSettings] = useState<CustomizationSettings | null>(null)

  const [settings, setSettings] = useState<CustomizationSettings>({
    hotelId: "",
    hotelLogo: "",
    hotelLogoFile: undefined,
    hotelColors: {
      primary: "#000000",
      secondary: "#666666",
      tertiary: "#999999",
      backgroundColor: "#FFFFFF",
      textColor: "#000000",
    },
    banners: [
      {
        bannerImage: "",
        bannerText: "Welcome to our hotel",
        bannerImageFile: undefined,
      },
    ],
  })

  useEffect(() => {
    const fetchCustomization = async () => {
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-customization`)

        if (!res.ok) throw new Error("Failed to fetch customization data")

        const data = await res.json()

        const settingsData = {
          hotelId: data.customization.hotelId,
          hotelLogo: data.customization.hotelLogo || "",
          hotelLogoFile: undefined,
          hotelColors: {
            primary: data.customization.hotelColors?.primary || "#000000",
            secondary: data.customization.hotelColors?.secondary || "#666666",
            tertiary: data.customization.hotelColors?.tertiary || "#999999",
            backgroundColor: data.customization.hotelColors?.backgroundColor || "#FFFFFF",
            textColor: data.customization.hotelColors?.textColor || "#000000",
          },
          banners: data.customization.banners?.length
            ? data.customization.banners.map((banner: any) => ({
                bannerImage: banner.bannerImage || "",
                bannerText: banner.bannerText || "Welcome to our hotel",
                bannerImageFile: undefined,
              }))
            : [
                {
                  bannerImage: "",
                  bannerText: "Welcome to our hotel",
                  bannerImageFile: undefined,
                },
              ],
        }

        setSettings(settingsData)
        setOriginalSettings(JSON.parse(JSON.stringify(settingsData)))
      } catch (error) {
        console.error("Error fetching customization settings:", error)
        toast.error("Failed to load customization settings")
      } finally {
        setLoading(false)
      }
    }

    fetchCustomization()
  }, [])

  // Update refs array when banners change
  useEffect(() => {
    bannerFileInputRefs.current = bannerFileInputRefs.current.slice(0, settings.banners.length)
  }, [settings.banners.length])

  const handleLogoUpload = (file: File) => {
    if (file) {
      const url = URL.createObjectURL(file)
      setSettings({
        ...settings,
        hotelLogo: url,
        hotelLogoFile: file,
      })
      toast.success("Logo uploaded successfully!")
    }
  }

  const handleBannerUpload = (file: File, index: number) => {
    if (file) {
      const url = URL.createObjectURL(file)
      const newBanners = [...settings.banners]
      newBanners[index] = {
        ...newBanners[index],
        bannerImage: url,
        bannerImageFile: file,
      }
      setSettings({
        ...settings,
        banners: newBanners,
      })
      toast.success("Banner image uploaded!")
    }
  }

  const handleSave = async () => {
    // Validate banners have both image and text
    const invalidBanners = settings.banners.filter((banner) => !banner.bannerImage || !banner.bannerText)
    if (invalidBanners.length > 0) {
      toast.error("All banners must have both an image and text")
      return
    }

    try {
      setSubmitLoading(true)

      // Create FormData object
      const formData = new FormData()
      let hasChanges = false

      // Check for logo changes
      if (settings.hotelLogoFile) {
        formData.append("hotelLogo", settings.hotelLogoFile)
        hasChanges = true
      } else if (settings.hotelLogo !== originalSettings?.hotelLogo) {
        if (settings.hotelLogo && !settings.hotelLogo.startsWith("blob:")) {
          formData.append("hotelLogoPath", settings.hotelLogo)
        }
        hasChanges = true
      }

      // Check for color changes
      const colorKeys = ["primary", "secondary", "tertiary", "backgroundColor", "textColor"] as const
      let colorsChanged = false

      colorKeys.forEach((key) => {
        if (settings.hotelColors[key] !== originalSettings?.hotelColors[key]) {
          colorsChanged = true
        }
      })

      if (colorsChanged) {
        formData.append("hotelColors[primary]", settings.hotelColors.primary)
        formData.append("hotelColors[secondary]", settings.hotelColors.secondary)
        formData.append("hotelColors[tertiary]", settings.hotelColors.tertiary)
        formData.append("hotelColors[backgroundColor]", settings.hotelColors.backgroundColor)
        if (settings.hotelColors.textColor) {
          formData.append("hotelColors[textColor]", settings.hotelColors.textColor)
        }
        hasChanges = true
      }

      // Check for banner changes
      let bannersChanged = false;

      if (!originalSettings || settings.banners.length !== originalSettings.banners.length) {
        bannersChanged = true;
      } else {
        for (let index = 0; index < settings.banners.length; index++) {
          const banner = settings.banners[index];
          if (
            banner.bannerImageFile ||
            banner.bannerText !== originalSettings.banners[index]?.bannerText ||
            banner.bannerImage !== originalSettings.banners[index]?.bannerImage
          ) {
            bannersChanged = true;
            break;
          }
        }
      }
      
      // Only include banners in formData if they've changed
      if (bannersChanged) {
        for (let index = 0; index < settings.banners.length; index++) {
          const banner = settings.banners[index];
      
          if (banner.bannerImageFile) {
            formData.append(`banners[${index}][bannerImage]`, banner.bannerImageFile);
          } else if (banner.bannerImage && !banner.bannerImage.startsWith("blob:")) {
            const file = await urlToFile(banner.bannerImage, `banner${index}.jpg`);
            formData.append(`banners[${index}][bannerImage]`, file);
          }
      
          formData.append(`banners[${index}][bannerText]`, banner.bannerText);
        }
        hasChanges = true;
      }
      

      // If no changes, show message and return early
      if (!hasChanges) {
        toast.info("No changes detected")
        setSubmitLoading(false)
        return
      }

      // Send the form data
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/edit-customization`, {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to save customization")

      const data = await response.json()

      // Update the state with the returned data to ensure consistency
      if (data.customization) {
        const updatedSettings = {
          ...settings,
          hotelLogo: data.customization.hotelLogo || settings.hotelLogo,
          hotelLogoFile: undefined,
          banners:
            data.customization.banners?.map((banner: any, index: number) => ({
              bannerImage: banner.bannerImage || "",
              bannerText: banner.bannerText || "Welcome to our hotel",
              bannerImageFile: undefined,
            })) || settings.banners,
        }

        setSettings(updatedSettings)
        // Update the original settings after successful save
        setOriginalSettings(JSON.parse(JSON.stringify(updatedSettings)))
      }

      toast.success("Branding settings saved successfully!")
    } catch (error) {
      console.error("Error saving branding data:", error)
      toast.error("Failed to save branding settings")
    } finally {
      setSubmitLoading(false)
    }
  }

  async function urlToFile(url: string, filename: string): Promise<File> {
    const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 h-screen w-full flex items-center justify-center">
        <FaSpinner className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    )
  } else
    return (
      <div className="container space-y-6 p-8">
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Hotel: <span className="text-muted-foreground">Customisation & Branding</span>
            </h1>
            <p className="text-sm text-muted-foreground">Customize your hotel's branding and appearance</p>
          </div>
          <Button disabled={submitLoading} onClick={handleSave}>
            <FiSave className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Colors Card */}
          <Card>
            <CardHeader>
              <CardTitle>Colors</CardTitle>
              <CardDescription>Customize your brand colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="color"
                    value={settings.hotelColors.primary}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hotelColors: { ...settings.hotelColors, primary: e.target.value },
                      })
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={settings.hotelColors.primary.toUpperCase()}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hotelColors: { ...settings.hotelColors, primary: e.target.value },
                      })
                    }
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="color"
                    value={settings.hotelColors.secondary}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hotelColors: { ...settings.hotelColors, secondary: e.target.value },
                      })
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={settings.hotelColors.secondary.toUpperCase()}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hotelColors: { ...settings.hotelColors, secondary: e.target.value },
                      })
                    }
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tertiary Color</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="color"
                    value={settings.hotelColors.tertiary}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hotelColors: { ...settings.hotelColors, tertiary: e.target.value },
                      })
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={settings.hotelColors.tertiary.toUpperCase()}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hotelColors: { ...settings.hotelColors, tertiary: e.target.value },
                      })
                    }
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="color"
                    value={settings.hotelColors.backgroundColor}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hotelColors: { ...settings.hotelColors, backgroundColor: e.target.value },
                      })
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={settings.hotelColors.backgroundColor.toUpperCase()}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hotelColors: { ...settings.hotelColors, backgroundColor: e.target.value },
                      })
                    }
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Text Color (Optional)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="color"
                    value={settings.hotelColors.textColor || "#000000"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hotelColors: { ...settings.hotelColors, textColor: e.target.value },
                      })
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={(settings.hotelColors.textColor || "#000000").toUpperCase()}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hotelColors: { ...settings.hotelColors, textColor: e.target.value },
                      })
                    }
                    className="font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logo Card */}
          <Card>
            <CardHeader>
              <CardTitle>Hotel Logo</CardTitle>
              <CardDescription>Upload your hotel's brand logo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 relative">
                  {settings.hotelLogo ? (
                    <>
                      <div className="mb-4 relative">
                        <div className="w-40 h-40 mx-auto bg-slate-50 rounded-md flex items-center justify-center p-4">
                          <img
                            src={
                              settings.hotelLogo.startsWith("blob:")
                                ? settings.hotelLogo
                                : `${process.env.NEXT_PUBLIC_BACKEND_URL}${settings.hotelLogo}` || "/placeholder.svg"
                            }
                            alt="Hotel logo"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium mb-1">Current Logo</p>
                        <div className="flex gap-2 justify-center">
                          <Button variant="secondary" size="sm" onClick={() => logoFileInputRef.current?.click()}>
                            <FiUpload className="mr-2 h-4 w-4" />
                            Change Logo
                          </Button>
                        </div>
                        <input
                          ref={logoFileInputRef}
                          type="file"
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.webp,.svg"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleLogoUpload(file)
                            }
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="cursor-pointer flex flex-col items-center justify-center w-full py-8">
                      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                        <FiUpload className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">Upload Your Logo</h3>
                      <p className="text-sm text-muted-foreground text-center max-w-xs mb-4">
                        Drag and drop your logo file here, or click to browse
                      </p>
                      <Button variant="secondary" onClick={() => logoFileInputRef.current?.click()}>
                        <FiUpload className="mr-2 h-4 w-4" />
                        Select Logo File
                      </Button>
                      <input
                        ref={logoFileInputRef}
                        type="file"
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.webp,.svg"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleLogoUpload(file)
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Requirements</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center mt-0.5">
                          <span className="text-xs">1</span>
                        </div>
                        <span>Image size: 512×512px (recommended)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center mt-0.5">
                          <span className="text-xs">2</span>
                        </div>
                        <span>File formats: WEBP (recommended), PNG, JPG, or SVG</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center mt-0.5">
                          <span className="text-xs">3</span>
                        </div>
                        <span>Maximum file size: 2MB</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Logo Preview</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-white border rounded-md flex items-center justify-center">
                        <div className="w-full h-12 flex items-center">
                          {settings.hotelLogo ? (
                            <img
                              src={
                                settings.hotelLogo.startsWith("blob:")
                                  ? settings.hotelLogo
                                  : `${process.env.NEXT_PUBLIC_BACKEND_URL}${settings.hotelLogo}` || "/placeholder.svg"
                              }
                              alt="Logo preview light"
                              className="max-h-full max-w-full object-contain mx-auto"
                            />
                          ) : (
                            <div className="w-full text-center text-xs text-muted-foreground">Light mode</div>
                          )}
                        </div>
                      </div>
                      <div className="p-4 bg-slate-900 rounded-md flex items-center justify-center">
                        <div className="w-full h-12 flex items-center">
                          {settings.hotelLogo ? (
                            <img
                              src={
                                settings.hotelLogo.startsWith("blob:")
                                  ? settings.hotelLogo
                                  : `${process.env.NEXT_PUBLIC_BACKEND_URL}${settings.hotelLogo}` || "/placeholder.svg"
                              }
                              alt="Logo preview dark"
                              className="max-h-full max-w-full object-contain mx-auto"
                            />
                          ) : (
                            <div className="w-full text-center text-xs text-slate-400">Dark mode</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Banners Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Banners</CardTitle>
              <CardDescription>Manage promotional banners for your hotel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {settings.banners.map((banner, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Banner {index + 1}</h3>
                      {settings.banners.length > 1 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newBanners = [...settings.banners]
                            newBanners.splice(index, 1)
                            setSettings({
                              ...settings,
                              banners: newBanners,
                            })
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Banner Image</Label>
                      <div className="flex items-center gap-4">
                        <div className="w-full h-40 border-2 border-dashed rounded-lg flex items-center justify-center relative">
                          {banner.bannerImage ? (
                            <div className="relative w-full h-full">
                              <img
                                src={
                                  banner.bannerImage.startsWith("blob:")
                                    ? banner.bannerImage
                                    : `${process.env.NEXT_PUBLIC_BACKEND_URL}${banner.bannerImage}` ||
                                      "/placeholder.svg"
                                }
                                alt={`Banner ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => bannerFileInputRefs.current[index]?.click()}
                                >
                                  <FiUpload className="mr-2 h-4 w-4" />
                                  Change Image
                                </Button>
                              </div>
                              <input
                                ref={(el: any) => (bannerFileInputRefs.current[index] = el)}
                                type="file"
                                className="hidden"
                                accept=".jpg,.jpeg,.png,.webp,.svg"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    handleBannerUpload(file, index)
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center w-full h-full">
                              <FiUpload className="h-8 w-8 mb-2 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground text-center px-2 mb-4">
                                Click to upload banner image
                              </span>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => bannerFileInputRefs.current[index]?.click()}
                              >
                                Select Image
                              </Button>
                              <input
                                ref={(el: any) => (bannerFileInputRefs.current[index] = el)}
                                type="file"
                                className="hidden"
                                accept=".jpg,.jpeg,.png,.webp,.svg"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    handleBannerUpload(file, index)
                                  }
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Banner Text</Label>
                      <Textarea
                        placeholder="Enter promotional text for this banner"
                        value={banner.bannerText}
                        onChange={(e) => {
                          const newBanners = [...settings.banners]
                          newBanners[index] = {
                            ...newBanners[index],
                            bannerText: e.target.value,
                          }
                          setSettings({
                            ...settings,
                            banners: newBanners,
                          })
                        }}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={() => {
                    setSettings({
                      ...settings,
                      banners: [
                        ...settings.banners,
                        {
                          bannerImage: "",
                          bannerText: "",
                          bannerImageFile: undefined,
                        },
                      ],
                    })
                  }}
                >
                  Add New Banner
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
}

export default BrandingPage

