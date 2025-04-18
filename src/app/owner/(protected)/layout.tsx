"use client"

import OwnerSidebar from "@/components/sidebar/OwnerSidebar"
import { cn } from "@/lib/utils"

import type React from "react"
import { useEffect, useState } from "react"
import { useBranchStore } from "@/stores/owner/branchStore" 

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { fetchBranches, isLoadingBranches } = useBranchStore()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  useEffect(() => {
    fetchBranches()
  }, [fetchBranches])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OwnerSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <main
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "md:ml-64" : "ml-0"
        )}
      >
        <div className="container mx-auto p-6">
          {isLoadingBranches ? (
            <div className="text-gray-500 text-sm">Loading branches...</div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  )
}
