"use client";

import { cn } from "@/lib/utils";
import { SuperAdminSidebar } from "../../../components/sidebar/SuperAdminSidebar";
import { useSuperAdminStore } from "@/stores/superAdmin/superAdminStore";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { adminInfo, fetchAdminInfo, isLoadingAdminInfo } =
    useSuperAdminStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!adminInfo) {
      fetchAdminInfo();
    }
  }, [adminInfo, fetchAdminInfo]);

  return (
    <div>
      {isLoadingAdminInfo ? (
        <div className="p-8 text-center text-gray-500 h-screen w-full flex items-center justify-center">
          <FaSpinner className="animate-spin h-6 w-6 text-gray-500" />
        </div>
      ) : (
        <div className="flex min-h-screen bg-gray-50">
          <SuperAdminSidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
          <main
            className={cn(
              "flex-1 transition-all duration-300 ease-in-out",
              isSidebarOpen ? "md:ml-64" : "ml-0"
            )}
          >
            {children}
          </main>
        </div>
      )}
    </div>
  );
}
