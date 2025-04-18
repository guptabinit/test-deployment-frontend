"use client";

import type React from "react";

import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FiLogOut, FiSettings, FiChevronRight, FiMenu } from "react-icons/fi";
import {
  FaHotel,
  FaTachometerAlt,
  FaTicketAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { SidebarTab } from "./SidebarTab";

const mainMenuItems = [
  {
    icon: <FaTachometerAlt />,
    text: "Dashboard",
    href: "/super-admin/dashboard",
  },
  { icon: <FaHotel />, text: "Manage Hotels", href: "/super-admin/hotels" },
  {
    icon: <FaMoneyBillWave />,
    text: "Manage Subscriptions",
    href: "/super-admin/subscriptions",
  },
  { icon: <FiSettings />, text: "Settings", href: "/super-admin/settings" },
  { icon: <FaTicketAlt />, text: "Tickets", href: "/super-admin/tickets" },
];

const bottomMenuItems = [
  { icon: <FiLogOut />, text: "Logout", href: "/super-admin/logout" },
];

export const SuperAdminSidebar = ({
  isSidebarOpen,
  toggleSidebar,
}: {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}) => {
  const pathname = usePathname();

  return (
    <>
      {/* Toggle button for collapsed state */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "fixed z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black text-white shadow-md transition-all duration-300",
          isSidebarOpen ? "top-5 left-56" : "top-5 left-5"
        )}
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarOpen ? <FiChevronRight /> : <FiMenu />}
      </button>

      <aside
        className={cn(
          "fixed top-0 left-0 flex h-screen flex-col justify-between border-l-4 border-blue-500 bg-gradient-to-b from-gray-50 to-gray-100 shadow-md transition-all duration-300 ease-in-out z-10",
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden"
        )}
      >
        <div>
          <div className="p-6 pb-6 bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-bold">Super Admin</h2>
            <p className="text-sm text-gray-600 mt-1">System Administrator</p>
          </div>

          <ScrollArea className="h-[calc(100vh-13rem)]">
            <div className="px-3 py-2">
              <nav className="space-y-1.5">
                {mainMenuItems.map((item) => (
                  <SidebarTab
                    key={item.text}
                    {...item}
                    isActive={pathname.startsWith(item.href)}
                  />
                ))}
                {bottomMenuItems.map((item) => (
                  <SidebarTab
                    key={item.text}
                    {...item}
                    isActive={pathname.startsWith(item.href)}
                  />
                ))}
              </nav>
            </div>
          </ScrollArea>
        </div>

        {/* Footer section */}
        <div className="border-t border-gray-300 p-4 text-center text-xs bg-gradient-to-r from-gray-100 to-gray-50">
          <p className="mb-2">App Version: v1.0.0</p>
          <div className="flex flex-col items-center gap-1">
            <p>Powered by</p>
            <Image
              src="/Quickgick_transparent.png"
              alt="Quickgick"
              width={100}
              height={25}
              className="h-auto"
            />
          </div>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};
