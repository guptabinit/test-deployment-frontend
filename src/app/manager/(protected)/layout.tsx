"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Sidebar } from "../../../components/sidebar/Sidebar"
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"
import useManagerStore from '@/stores/manager/managerDetailsStore'

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // This function will be passed to the Sidebar component
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const router = useRouter();
  const { manager, hotel, isHotelLoading, fetchManagerDetails } = useManagerStore()

  // Fetch manager details if not already fetched
  if (!manager || !hotel) {
    fetchManagerDetails()
  }

  useEffect(()=>{
    if(!localStorage.getItem("key")){
      router.push("/manager/login");
    }
  },[])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Pass the state and toggle function to Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area that adjusts based on sidebar state */}
      <main
        className={cn("flex-1 overflow-auto transition-all duration-300 ease-in-out", isSidebarOpen ? "ml-64" : "ml-0")}
      >
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  )
}
