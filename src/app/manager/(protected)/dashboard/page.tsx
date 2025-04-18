"use client"

import { useState } from "react"
import { FiRefreshCw } from "react-icons/fi"
import { FaUtensils, FaUsers, FaMoneyBillWave, FaChartLine } from "react-icons/fa"
import StatCard from "./_components/StatCard"
import { formatCurrency } from "./_lib/format-currency"
import RecentOrdersTable from "./_components/RecentOrderTable"
import PopularMenuItems from "./_components/PopularItemCard"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false)

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Today's performance overview</p>
        </div>
        <button
          onClick={refreshData}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          disabled={isLoading}
        >
          <FiRefreshCw className={`${isLoading ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} title={stat.title} value={stat.value} change={stat.change} icon={stat.icon} />
        ))}
      </div>

      {/* Recent orders */}
      <RecentOrdersTable orders={recentOrders} />

      {/* Popular items */}
      <div className="mb-8">
        <PopularMenuItems items={popularItems} />
      </div>
    </div>
  )
}

const stats = [
  {
    title: "Today's Orders",
    value: "124",
    change: "+12%",
    icon: <FaUtensils className="text-black" />,
  },
  {
    title: "Active Customers",
    value: "254",
    change: "+5.3%",
    icon: <FaUsers className="text-black" />,
  },
  {
    title: "Today's Revenue",
    value: formatCurrency(85430),
    change: "+8.1%",
    icon: <FaMoneyBillWave className="text-black" />,
  },
  {
    title: "Monthly Growth",
    value: "24.5%",
    change: "+2.4%",
    icon: <FaChartLine className="text-black" />,
  },
]

// Sample data
const recentOrders = [
  {
    id: "1234",
    room: "Room 301",
    items: "3 items",
    total: 1250,
    status: "Completed",
    time: "Just now",
  },
  {
    id: "1233",
    room: "Room 205",
    items: "1 item",
    total: 450,
    status: "In Progress",
    time: "5 mins ago",
  },
  {
    id: "1232",
    room: "Room 102",
    items: "5 items",
    total: 2100,
    status: "Pending",
    time: "15 mins ago",
  },
  {
    id: "1231",
    room: "Room 407",
    items: "2 items",
    total: 780,
    status: "Completed",
    time: "30 mins ago",
  },
  {
    id: "1230",
    room: "Room 512",
    items: "4 items",
    total: 1650,
    status: "Cancelled",
    time: "1 hour ago",
  },
]

const popularItems = [
  { id: 1, name: "Butter Chicken", orders: 24, price: 450, emoji: "🍗" },
  { id: 2, name: "Paneer Tikka", orders: 18, price: 350, emoji: "🧀" },
  { id: 3, name: "Masala Dosa", orders: 15, price: 180, emoji: "🥘" },
]

