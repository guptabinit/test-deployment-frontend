"use client"

import type React from "react"

import { useState, useCallback, memo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  RefreshCw,
  Building,
  Users,
  UtensilsCrossed,
  TrendingUp,
  Clock,
  MapPin,
  CreditCard,
  Calendar,
  ChevronRight,
  Bell,
  Settings,
  Shield,
  Star,
} from "lucide-react"

// Types for our data
type StatCardProps = {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  isLoading: boolean
}

type ActionCardProps = {
  title: string
  description: string
  icon: React.ReactNode
  action: string
  onClick: () => void
  isLoading: boolean
}

type BranchCardProps = {
  name: string
  address: string
  status: "active" | "maintenance" | "closed"
  isLoading: boolean
}

type SubscriptionCardProps = {
  plan: string
  status: "active" | "expiring" | "expired"
  nextBilling: string
  price: string
  isLoading: boolean
}

// Memoized StatCard component to prevent unnecessary re-renders
const StatCard = memo(({ title, value, change, icon, isLoading }: StatCardProps) => {
  const isPositive = change.startsWith("+")

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="border-gray-200 hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{title}</p>
                  <p className="text-2xl font-semibold mt-1 text-gray-900">{value}</p>
                </div>
                <div className="p-2 rounded-md bg-gray-100">{icon}</div>
              </div>
              <div className="mt-4">
                <span className={`text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                  {change}
                </span>
                <span className="text-xs text-gray-500 ml-1">vs last month</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
})

StatCard.displayName = "StatCard"

// Action Card Component
const ActionCard = memo(({ title, description, icon, action, onClick, isLoading }: ActionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer h-full" onClick={onClick}>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-base font-medium text-gray-900">{title}</p>
                </div>
                <div className="p-2 rounded-md bg-gray-100">{icon}</div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{description}</p>
            </>
          )}
        </CardContent>
        {!isLoading && (
          <CardFooter className="pt-2 pb-4 border-t border-gray-100">
            <div className="flex items-center text-sm font-medium text-gray-900">
              {action} <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
})

ActionCard.displayName = "ActionCard"

// Branch Card Component
const BranchCard = memo(({ name, address, status, isLoading }: BranchCardProps) => {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    maintenance: "bg-yellow-100 text-yellow-800",
    closed: "bg-gray-100 text-gray-800",
  }

  const statusText = {
    active: "Active",
    maintenance: "Maintenance",
    closed: "Closed",
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="border-gray-200 hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <p className="text-base font-medium text-gray-900">{name}</p>
                <Badge variant="outline" className={statusColors[status]}>
                  {statusText[status]}
                </Badge>
              </div>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                {address}
              </div>
            </>
          )}
        </CardContent>
        {!isLoading && (
          <CardFooter className="pt-2 pb-4 border-t border-gray-100">
            <div className="flex items-center text-sm font-medium text-gray-900">
              View details <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
})

BranchCard.displayName = "BranchCard"

// Subscription Card Component
const SubscriptionCard = memo(({ plan, status, nextBilling, price, isLoading }: SubscriptionCardProps) => {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    expiring: "bg-yellow-100 text-yellow-800",
    expired: "bg-red-100 text-red-800",
  }

  const statusText = {
    active: "Active",
    expiring: "Expiring Soon",
    expired: "Expired",
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="border-gray-200 hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-5 w-24" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <p className="text-lg font-medium text-gray-900">{plan}</p>
                  {plan === "Premium" && <Star className="h-4 w-4 ml-1 text-gray-900 fill-gray-900" />}
                </div>
                <Badge variant="outline" className={statusColors[status]}>
                  {statusText[status]}
                </Badge>
              </div>
              <div className="flex items-center mt-3 text-sm text-gray-500">
                <Calendar className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                Next billing: {nextBilling}
              </div>
              <p className="text-lg font-semibold mt-3 text-gray-900">{price}</p>
            </>
          )}
        </CardContent>
        {!isLoading && (
          <CardFooter className="pt-2 pb-4 border-t border-gray-100 flex justify-between">
            <div className="flex items-center text-sm font-medium text-gray-900">
              Manage subscription <ChevronRight className="h-4 w-4 ml-1" />
            </div>
            <Badge variant="outline" className="bg-gray-100 text-gray-800">
              Auto-renew ON
            </Badge>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
})

SubscriptionCard.displayName = "SubscriptionCard"

// Current time component
const CurrentTime = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center text-sm text-gray-500">
      <Clock className="h-4 w-4 mr-1" />
      {time.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}{" "}
      |{" "}
      {time.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </div>
  )
}

// Dashboard skeleton loader
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <Card key={i} className="border-gray-200">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-10 rounded-md" />
                </div>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  </div>
)

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [stats, setStats] = useState({
    branches: "5",
    staff: "42",
    orders: "28",
    revenue: "₹52,435",
  })

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Memoized refresh function to prevent recreation on each render
  const refreshData = useCallback(() => {
    setIsRefreshing(true)

    // Simulate API call
    setTimeout(() => {
      // Update with slightly different data to show change
      setStats({
        branches: "5",
        staff: (Number.parseInt(stats.staff) + Math.floor(Math.random() * 3)).toString(),
        orders: (Number.parseInt(stats.orders) + Math.floor(Math.random() * 5)).toString(),
        revenue: `₹${(
          Number.parseInt(stats.revenue.replace("₹", "").replace(",", "")) + Math.floor(Math.random() * 5000)
        ).toLocaleString("en-IN")}`,
      })
      setIsRefreshing(false)
    }, 1000)
  }, [stats])

  // Mock action handlers
  const handleActionClick = useCallback((action: string) => {
    alert(`You clicked: ${action}`)
  }, [])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Restaurant Dashboard</h1>
          <CurrentTime />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => handleActionClick("Notifications")}
          >
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleActionClick("Settings")}>
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={refreshData} disabled={isRefreshing} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-3">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Branches"
            value={stats.branches}
            change="+1"
            icon={<Building className="h-5 w-5 text-black" />}
            isLoading={isRefreshing}
          />
          <StatCard
            title="Total Staff"
            value={stats.staff}
            change="+3"
            icon={<Users className="h-5 w-5 text-black" />}
            isLoading={isRefreshing}
          />
          <StatCard
            title="Active Orders"
            value={stats.orders}
            change="+12"
            icon={<UtensilsCrossed className="h-5 w-5 text-black" />}
            isLoading={isRefreshing}
          />
          <StatCard
            title="Today's Revenue"
            value={stats.revenue}
            change="+8.1%"
            icon={<TrendingUp className="h-5 w-5 text-black" />}
            isLoading={isRefreshing}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionCard
            title="Manage Accounts"
            description="Update user roles, permissions and account settings"
            icon={<Shield className="h-5 w-5 text-black" />}
            action="Manage accounts"
            onClick={() => handleActionClick("Manage Accounts")}
            isLoading={isRefreshing}
          />
          <ActionCard
            title="Branch Operations"
            description="View and manage all your restaurant branches"
            icon={<Building className="h-5 w-5 text-black" />}
            action="View branches"
            onClick={() => handleActionClick("Branch Operations")}
            isLoading={isRefreshing}
          />
          <ActionCard
            title="Billing & Subscription"
            description="Manage your subscription plan and billing details"
            icon={<CreditCard className="h-5 w-5 text-black" />}
            action="View details"
            onClick={() => handleActionClick("Billing & Subscription")}
            isLoading={isRefreshing}
          />
        </div>
      </div>

      {/* Branch Locations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-gray-900">Branch Locations</h2>
          <Button variant="ghost" size="sm" className="text-sm" onClick={() => handleActionClick("View All Branches")}>
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <BranchCard
            name="Indiranagar Branch"
            address="100 Feet Road, Indiranagar, Bangalore"
            status="active"
            isLoading={isRefreshing}
          />
          <BranchCard
            name="Koramangala Branch"
            address="80 Feet Road, 6th Block, Koramangala, Bangalore"
            status="active"
            isLoading={isRefreshing}
          />
          <BranchCard
            name="HSR Layout Branch"
            address="27th Main, Sector 2, HSR Layout, Bangalore"
            status="maintenance"
            isLoading={isRefreshing}
          />
        </div>
      </div>

      {/* Subscription Details */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-3">Subscription Details</h2>
        <div className="grid grid-cols-1 gap-4">
          <SubscriptionCard
            plan="Premium Restaurant Management"
            status="active"
            nextBilling="May 15, 2025"
            price="₹4,999/month"
            isLoading={isRefreshing}
          />
        </div>
      </div>

      <div className="mt-8">
        <AnimatePresence>
          {isRefreshing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 p-3 rounded-md text-sm text-gray-500 flex items-center justify-center"
            >
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Refreshing dashboard data...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

