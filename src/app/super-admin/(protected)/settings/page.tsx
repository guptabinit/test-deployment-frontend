"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Bell, Globe, Mail, Save, Server, Settings, Shield, User } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [formChanged, setFormChanged] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Mock form state
  const [formState, setFormState] = useState({
    systemName: "Hotel Management System",
    timeZone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    language: "en",
    smtpServer: "smtp.example.com",
    smtpPort: "587",
    emailFrom: "notifications@example.com",
    emailAuth: true,
    notifyNewBookings: true,
    notifyPayments: true,
    notifyCancellations: true,
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: "90",
  })

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
    setFormChanged(true)
  }

  const handleSave = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Saving settings:", formState)
      setFormChanged(false)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 sm:pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
            System: <span className="text-gray-600 dark:text-gray-400">Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Configure system settings and preferences</p>
        </div>
        <div className="mt-2 sm:mt-0">
          <Button onClick={handleSave} disabled={!formChanged || isLoading} className="w-full sm:w-auto gap-2">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-4 rounded-full" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full grid grid-cols-5 gap-1">
          <TabsTrigger value="general" className="gap-1 px-1 sm:px-3 py-1 sm:py-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-1 px-1 sm:px-3 py-1 sm:py-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1 px-1 sm:px-3 py-1 sm:py-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1 px-1 sm:px-3 py-1 sm:py-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-1 px-1 sm:px-3 py-1 sm:py-2">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">Advanced</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader className="px-3 py-2 sm:p-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                System Configuration
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Configure basic system settings and regional preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="systemName">System Name</Label>
                      <Input
                        id="systemName"
                        value={formState.systemName}
                        onChange={(e) => handleInputChange("systemName", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={formState.language}
                        onValueChange={(value) => handleInputChange("language", value)}
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="timeZone">Time Zone</Label>
                      <Select
                        value={formState.timeZone}
                        onValueChange={(value) => handleInputChange("timeZone", value)}
                      >
                        <SelectTrigger id="timeZone">
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="America/New_York">America/New York (GMT-4)</SelectItem>
                          <SelectItem value="Europe/London">Europe/London (GMT+1)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select
                        value={formState.dateFormat}
                        onValueChange={(value) => handleInputChange("dateFormat", value)}
                      >
                        <SelectTrigger id="dateFormat">
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          <SelectItem value="DD-MMM-YYYY">DD-MMM-YYYY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-3 py-2 sm:p-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                User Interface
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Customize the appearance and behavior of the user interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                      <Skeleton className="h-5 w-10 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                      <Skeleton className="h-5 w-10 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                      <Skeleton className="h-5 w-10 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                      <Skeleton className="h-5 w-10 rounded-full" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 space-y-1 sm:space-y-0">
                      <div className="space-y-0.5">
                        <Label htmlFor="darkMode" className="text-sm">
                          Dark Mode
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">Enable dark mode for the interface</p>
                      </div>
                      <Switch id="darkMode" className="mt-1 sm:mt-0" />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 space-y-1 sm:space-y-0">
                      <div className="space-y-0.5">
                        <Label htmlFor="compactView" className="text-sm">
                          Compact View
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">Show more content with less spacing</p>
                      </div>
                      <Switch id="compactView" className="mt-1 sm:mt-0" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 space-y-1 sm:space-y-0">
                      <div className="space-y-0.5">
                        <Label htmlFor="animations" className="text-sm">
                          Animations
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">Enable UI animations and transitions</p>
                      </div>
                      <Switch id="animations" className="mt-1 sm:mt-0" defaultChecked />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 space-y-1 sm:space-y-0">
                      <div className="space-y-0.5">
                        <Label htmlFor="showTips" className="text-sm">
                          Show Tips
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">Display helpful tips and suggestions</p>
                      </div>
                      <Switch id="showTips" className="mt-1 sm:mt-0" defaultChecked />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader className="px-3 py-2 sm:p-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                Email Configuration
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Configure email server settings for system notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                      <Skeleton className="h-5 w-10 rounded-full" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpServer">SMTP Server</Label>
                      <Input
                        id="smtpServer"
                        value={formState.smtpServer}
                        onChange={(e) => handleInputChange("smtpServer", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input
                        id="smtpPort"
                        value={formState.smtpPort}
                        onChange={(e) => handleInputChange("smtpPort", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="emailFrom">Email From</Label>
                      <Input
                        id="emailFrom"
                        type="email"
                        value={formState.emailFrom}
                        onChange={(e) => handleInputChange("emailFrom", e.target.value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailAuth">Require Authentication</Label>
                        <p className="text-sm text-muted-foreground">Use username and password for SMTP</p>
                      </div>
                      <Switch
                        id="emailAuth"
                        checked={formState.emailAuth}
                        onCheckedChange={(checked) => handleInputChange("emailAuth", checked)}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4">
                {isLoading ? (
                  <Skeleton className="h-10 w-36" />
                ) : (
                  <Button variant="outline" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Send Test Email
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-3 py-2 sm:p-4">
              <CardTitle className="text-base sm:text-lg">Email Templates</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Customize email templates for different notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="border border-gray-200 dark:border-gray-800">
                      <CardHeader className="p-4">
                        <Skeleton className="h-5 w-40" />
                      </CardHeader>
                      <CardFooter className="p-4 pt-0 flex justify-between">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-8 w-16" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border border-gray-200 dark:border-gray-800">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">Booking Confirmation</CardTitle>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Badge variant="outline">Default</Badge>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="border border-gray-200 dark:border-gray-800">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">Payment Receipt</CardTitle>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Badge variant="outline">Default</Badge>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="border border-gray-200 dark:border-gray-800">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">Account Notification</CardTitle>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Badge variant="outline">Custom</Badge>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader className="px-3 py-2 sm:p-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Configure which events trigger notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between py-2">
                        <div className="space-y-0.5">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                        <Skeleton className="h-5 w-10 rounded-full" />
                      </div>
                      {i < 4 && <Skeleton className="h-px w-full my-2" />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 space-y-1 sm:space-y-0">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifyNewBookings" className="text-sm">
                        New Bookings
                      </Label>
                      <p className="text-xs sm:text-sm text-muted-foreground">Receive notifications for new bookings</p>
                    </div>
                    <Switch
                      id="notifyNewBookings"
                      checked={formState.notifyNewBookings}
                      className="mt-1 sm:mt-0"
                      onCheckedChange={(checked) => handleInputChange("notifyNewBookings", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 space-y-1 sm:space-y-0">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifyPayments" className="text-sm">
                        Payments
                      </Label>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Receive notifications for payment events
                      </p>
                    </div>
                    <Switch
                      id="notifyPayments"
                      checked={formState.notifyPayments}
                      className="mt-1 sm:mt-0"
                      onCheckedChange={(checked) => handleInputChange("notifyPayments", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 space-y-1 sm:space-y-0">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifyCancellations" className="text-sm">
                        Cancellations
                      </Label>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Receive notifications for booking cancellations
                      </p>
                    </div>
                    <Switch
                      id="notifyCancellations"
                      checked={formState.notifyCancellations}
                      className="mt-1 sm:mt-0"
                      onCheckedChange={(checked) => handleInputChange("notifyCancellations", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 space-y-1 sm:space-y-0">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifySystemUpdates" className="text-sm">
                        System Updates
                      </Label>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Receive notifications for system updates
                      </p>
                    </div>
                    <Switch id="notifySystemUpdates" className="mt-1 sm:mt-0" defaultChecked />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader className="px-3 py-2 sm:p-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Configure security and access control settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-48" />
                            </div>
                            <Skeleton className="h-5 w-10 rounded-full" />
                          </div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-48" />
                            </div>
                            <Skeleton className="h-5 w-10 rounded-full" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Skeleton className="h-px w-full" />

                  <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-48" />
                            </div>
                            <Skeleton className="h-5 w-10 rounded-full" />
                          </div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-48" />
                            </div>
                            <Skeleton className="h-5 w-10 rounded-full" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Password Policy</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 space-y-1 sm:space-y-0">
                          <div className="space-y-0.5">
                            <Label className="text-sm">Minimum Length</Label>
                            <p className="text-xs sm:text-sm text-muted-foreground">Require at least 8 characters</p>
                          </div>
                          <Switch className="mt-1 sm:mt-0" defaultChecked />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 space-y-1 sm:space-y-0">
                          <div className="space-y-0.5">
                            <Label className="text-sm">Require Numbers</Label>
                            <p className="text-xs sm:text-sm text-muted-foreground">Require at least one number</p>
                          </div>
                          <Switch className="mt-1 sm:mt-0" defaultChecked />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 space-y-1 sm:space-y-0">
                          <div className="space-y-0.5">
                            <Label className="text-sm">Special Characters</Label>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Require at least one special character
                            </p>
                          </div>
                          <Switch className="mt-1 sm:mt-0" defaultChecked />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 space-y-1 sm:space-y-0">
                          <div className="space-y-0.5">
                            <Label className="text-sm">Password Expiry</Label>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Require password change every 90 days
                            </p>
                          </div>
                          <Switch className="mt-1 sm:mt-0" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Login Security</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 space-y-1 sm:space-y-0">
                          <div className="space-y-0.5">
                            <Label className="text-sm">Two-Factor Authentication</Label>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Require 2FA for all admin accounts
                            </p>
                          </div>
                          <Switch className="mt-1 sm:mt-0" />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 space-y-1 sm:space-y-0">
                          <div className="space-y-0.5">
                            <Label className="text-sm">Login Attempts</Label>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Lock account after 5 failed attempts
                            </p>
                          </div>
                          <Switch className="mt-1 sm:mt-0" defaultChecked />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 space-y-1 sm:space-y-0">
                          <div className="space-y-0.5">
                            <Label className="text-sm">Session Timeout</Label>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Automatically log out after 30 minutes of inactivity
                            </p>
                          </div>
                          <Switch className="mt-1 sm:mt-0" defaultChecked />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 space-y-1 sm:space-y-0">
                          <div className="space-y-0.5">
                            <Label className="text-sm">IP Restrictions</Label>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Limit access to specific IP addresses
                            </p>
                          </div>
                          <Switch className="mt-1 sm:mt-0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader className="px-3 py-2 sm:p-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Server className="h-4 w-4 sm:h-5 sm:w-5" />
                System Maintenance
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Configure backup, logging, and system maintenance settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                          </div>
                          <Skeleton className="h-5 w-10 rounded-full" />
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-40" />
                      </div>
                    </div>
                  </div>

                  <Skeleton className="h-px w-full" />

                  <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                          </div>
                          <Skeleton className="h-5 w-10 rounded-full" />
                        </div>
                      </div>
                    </div>
                    <Skeleton className="h-10 w-40" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Backup Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 space-y-1 sm:space-y-0">
                          <div className="space-y-0.5">
                            <Label htmlFor="autoBackup" className="text-sm">
                              Automatic Backups
                            </Label>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Enable scheduled automatic backups
                            </p>
                          </div>
                          <Switch
                            id="autoBackup"
                            checked={formState.autoBackup}
                            className="mt-1 sm:mt-0"
                            onCheckedChange={(checked) => handleInputChange("autoBackup", checked)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="backupFrequency">Backup Frequency</Label>
                          <Select
                            value={formState.backupFrequency}
                            onValueChange={(value) => handleInputChange("backupFrequency", value)}
                            disabled={!formState.autoBackup}
                          >
                            <SelectTrigger id="backupFrequency">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="dataRetention">Data Retention (days)</Label>
                          <Input
                            id="dataRetention"
                            type="number"
                            value={formState.dataRetention}
                            onChange={(e) => handleInputChange("dataRetention", e.target.value)}
                          />
                        </div>

                        <div className="pt-2">
                          <Button variant="outline" className="gap-2">
                            Create Manual Backup
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">System Logs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="logLevel">Log Level</Label>
                          <Select defaultValue="info">
                            <SelectTrigger id="logLevel">
                              <SelectValue placeholder="Select log level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="error">Error</SelectItem>
                              <SelectItem value="warn">Warning</SelectItem>
                              <SelectItem value="info">Info</SelectItem>
                              <SelectItem value="debug">Debug</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 space-y-1 sm:space-y-0">
                          <div className="space-y-0.5">
                            <Label className="text-sm">Detailed API Logging</Label>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Log detailed API request and response data
                            </p>
                          </div>
                          <Switch className="mt-1 sm:mt-0" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button variant="outline" className="gap-2">
                        View System Logs
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-3 py-2 sm:p-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                These actions are destructive and cannot be undone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-3 sm:p-4 border border-red-200 rounded-md dark:border-red-900">
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  <div className="p-3 sm:p-4 border border-red-200 rounded-md dark:border-red-900">
                    <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Reset System Settings</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                      Reset all system settings to their default values
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950"
                    >
                      Reset Settings
                    </Button>
                  </div>

                  <div className="p-3 sm:p-4 border border-red-200 rounded-md dark:border-red-900">
                    <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Purge All Data</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                      Permanently delete all system data and logs
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950"
                    >
                      Purge Data
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

