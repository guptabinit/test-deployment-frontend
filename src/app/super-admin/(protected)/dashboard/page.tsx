"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  RefreshCw,
  Hotel,
  Users,
  BanknoteIcon,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  PlusCircle,
  Settings,
  FileText,
  Bell,
  Calendar,
  ArrowUpRight,
} from "lucide-react"

import {useSuperAdminStore} from '@/stores/superAdmin/superAdminStore'

type StatCardProps = {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  isLoading?: boolean
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<Array<StatCardProps>>([])
  const [hotelsLoading, setHotelsLoading] = useState(true)
  const [ticketsLoading, setTicketsLoading] = useState(true)
  const [activitiesLoading, setActivitiesLoading] = useState(true)
  const [renewalsLoading, setRenewalsLoading] = useState(true)

  const { adminInfo } = useSuperAdminStore() // demonstrating how to get info from store.
  console.log(adminInfo)

  // Simulate initial data loading
  useEffect(() => {
    fetchDashboardData()
    

    // Simulate loading data for other sections with staggered timing
    setTimeout(() => setHotelsLoading(false), 1800)
    setTimeout(() => setTicketsLoading(false), 2200)
    setTimeout(() => setActivitiesLoading(false), 1600)
    setTimeout(() => setRenewalsLoading(false), 2000)
  }, [])

  const fetchDashboardData = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setStats([
        {
          title: "Total Hotels",
          value: "24",
          change: "+3",
          icon: <Hotel className="h-5 w-5 text-white" />,
        },
        {
          title: "Total Owners",
          value: "18",
          change: "+2",
          icon: <Users className="h-5 w-5 text-white" />,
        },
        {
          title: "Monthly Revenue",
          value: "₹4,52,435",
          change: "+12.5%",
          icon: <BanknoteIcon className="h-5 w-5 text-white" />,
        },
        {
          title: "Active Subscriptions",
          value: "21",
          change: "+4",
          icon: <TrendingUp className="h-5 w-5 text-white" />,
        },
      ])
      setIsLoading(false)
    }, 1500)
  }

  const refreshSection = (section: string) => {
    switch (section) {
      case "hotels":
        setHotelsLoading(true)
        setTimeout(() => setHotelsLoading(false), 1000)
        break
      case "tickets":
        setTicketsLoading(true)
        setTimeout(() => setTicketsLoading(false), 1000)
        break
      case "activities":
        setActivitiesLoading(true)
        setTimeout(() => setActivitiesLoading(false), 1000)
        break
      case "renewals":
        setRenewalsLoading(true)
        setTimeout(() => setRenewalsLoading(false), 1000)
        break
      default:
        break
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">System performance overview and statistics</p>
        </div>
        <Button
          variant="outline"
          onClick={fetchDashboardData}
          disabled={isLoading}
          className="flex items-center gap-2 self-start sm:self-center"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      <div className="space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? // Skeleton loaders when data is loading
              Array(4)
                .fill(0)
                .map((_, index) => <StatCardSkeleton key={index} />)
            : // Actual stat cards when data is loaded
              stats.map((stat, index) => (
                <StatCard key={index} title={stat.title} value={stat.value} change={stat.change} icon={stat.icon} />
              ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <QuickActionButton icon={<PlusCircle className="h-5 w-5" />} label="Add Hotel" />
              <QuickActionButton icon={<Users className="h-5 w-5" />} label="Manage Owners" />
              <QuickActionButton icon={<FileText className="h-5 w-5" />} label="View Reports" />
              <QuickActionButton icon={<Settings className="h-5 w-5" />} label="System Settings" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Hotels and Tickets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Recently Added Hotels</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refreshSection("hotels")}
                disabled={hotelsLoading}
                className="h-8 px-2"
              >
                <RefreshCw className={`h-4 w-4 ${hotelsLoading ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh</span>
              </Button>
            </CardHeader>
            <CardContent>
              {hotelsLoading ? (
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-md" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-8 w-16 ml-auto" />
                      </div>
                    ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { name: "Grand Plaza Hotel", location: "Mumbai", date: "2 days ago" },
                    { name: "Sunset Resort", location: "Goa", date: "5 days ago" },
                    { name: "Mountain View Inn", location: "Shimla", date: "1 week ago" },
                  ].map((hotel, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-md bg-black dark:bg-white flex items-center justify-center">
                        <Hotel className="h-6 w-6 text-white dark:text-black" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{hotel.name}</p>
                        <p className="text-sm text-muted-foreground">{hotel.location}</p>
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        {hotel.date}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Recent Support Tickets</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refreshSection("tickets")}
                disabled={ticketsLoading}
                className="h-8 px-2"
              >
                <RefreshCw className={`h-4 w-4 ${ticketsLoading ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh</span>
              </Button>
            </CardHeader>
            <CardContent>
              {ticketsLoading ? (
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="h-6 w-16 ml-auto rounded-full" />
                      </div>
                    ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { title: "Payment issue", hotel: "Grand Plaza Hotel", status: "Open", priority: "High" },
                    { title: "Login problem", hotel: "Sunset Resort", status: "In Progress", priority: "Medium" },
                    { title: "Booking error", hotel: "Mountain View Inn", status: "Resolved", priority: "Low" },
                  ].map((ticket, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          ticket.status === "Open"
                            ? "bg-gray-200 dark:bg-gray-700"
                            : ticket.status === "In Progress"
                              ? "bg-gray-200 dark:bg-gray-700"
                              : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        {ticket.status === "Open" ? (
                          <AlertCircle className="h-4 w-4 text-black dark:text-white" />
                        ) : ticket.status === "In Progress" ? (
                          <Clock className="h-4 w-4 text-black dark:text-white" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-black dark:text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{ticket.title}</p>
                        <p className="text-sm text-muted-foreground">{ticket.hotel}</p>
                      </div>
                      <Badge
                        variant={
                          ticket.status === "Open" ? "outline" : ticket.status === "In Progress" ? "outline" : "default"
                        }
                        className={
                          ticket.status === "Resolved"
                            ? "bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black"
                            : ""
                        }
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities and Upcoming Renewals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refreshSection("activities")}
                disabled={activitiesLoading}
                className="h-8 px-2"
              >
                <RefreshCw className={`h-4 w-4 ${activitiesLoading ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh</span>
              </Button>
            </CardHeader>
            <CardContent>
              {activitiesLoading ? (
                <div className="space-y-4">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <Skeleton className="h-8 w-8 rounded-full mt-1" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    {
                      action: "New hotel added",
                      user: "Raj Patel",
                      time: "2 hours ago",
                      icon: <PlusCircle className="h-4 w-4" />,
                    },
                    {
                      action: "Subscription renewed",
                      user: "Priya Sharma",
                      time: "5 hours ago",
                      icon: <ArrowUpRight className="h-4 w-4" />,
                    },
                    {
                      action: "Support ticket resolved",
                      user: "Admin",
                      time: "Yesterday",
                      icon: <CheckCircle className="h-4 w-4" />,
                    },
                    {
                      action: "System settings updated",
                      user: "Admin",
                      time: "2 days ago",
                      icon: <Settings className="h-4 w-4" />,
                    },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full bg-black dark:bg-white flex items-center justify-center mt-1">
                        {React.cloneElement(activity.icon as React.ReactElement, {
                          className: "h-4 w-4 text-white dark:text-black",
                        })}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">
                          by {activity.user} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 px-6">
              <Button variant="outline" size="sm" className="w-full">
                View All Activities
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Upcoming Renewals</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refreshSection("renewals")}
                disabled={renewalsLoading}
                className="h-8 px-2"
              >
                <RefreshCw className={`h-4 w-4 ${renewalsLoading ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh</span>
              </Button>
            </CardHeader>
            <CardContent>
              {renewalsLoading ? (
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="h-8 w-24" />
                      </div>
                    ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { hotel: "Grand Plaza Hotel", plan: "Premium Plan", date: "15 May 2023", daysLeft: 5 },
                    { hotel: "Sunset Resort", plan: "Standard Plan", date: "22 May 2023", daysLeft: 12 },
                    { hotel: "Mountain View Inn", plan: "Basic Plan", date: "30 May 2023", daysLeft: 20 },
                  ].map((renewal, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-black dark:text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{renewal.hotel}</p>
                        <p className="text-sm text-muted-foreground">
                          {renewal.plan} • {renewal.date}
                        </p>
                      </div>
                      <Badge className="ml-auto bg-black text-white dark:bg-white dark:text-black">
                        {renewal.daysLeft} days left
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 px-6">
              <Button variant="outline" size="sm" className="w-full">
                View All Renewals
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* System Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">System Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="h-8 w-8 rounded-full bg-black dark:bg-white flex items-center justify-center">
                  <Bell className="h-4 w-4 text-white dark:text-black" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">System Maintenance Scheduled</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    The system will undergo maintenance on May 15, 2023, from 2:00 AM to 4:00 AM IST. Some features may
                    be temporarily unavailable during this time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="h-8 w-8 rounded-full bg-black dark:bg-white flex items-center justify-center">
                  <Bell className="h-4 w-4 text-white dark:text-black" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">New Feature Released</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    We've added a new reporting feature that allows hotel owners to track their revenue by room type.
                    Check it out in the Reports section.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, icon }: StatCardProps) {
  const isPositive = change.startsWith("+")

  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{value}</p>
          </div>
          <div className="p-3 rounded-lg bg-black dark:bg-white">{icon}</div>
        </div>
        <div className="mt-4 flex items-center">
          <span
            className={`text-sm font-medium ${isPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}
          >
            {change}
          </span>
          <span className="text-xs text-muted-foreground ml-1.5">vs last month</span>
        </div>
      </CardContent>
    </Card>
  )
}

function StatCardSkeleton() {
  return (
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="w-full">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-20 mt-2" />
          </div>
          <Skeleton className="h-12 w-12 rounded-lg" />
        </div>
        <div className="mt-4 flex items-center">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24 ml-2" />
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Button
      variant="outline"
      className="h-auto py-6 flex flex-col items-center justify-center gap-2 w-full border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <div className="h-10 w-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
        {React.cloneElement(icon as React.ReactElement, {
          className: "h-5 w-5 text-white dark:text-black",
        })}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </Button>
  )
}

