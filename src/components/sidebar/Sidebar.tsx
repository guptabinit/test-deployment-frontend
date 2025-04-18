"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  FiLogOut,
  FiHelpCircle,
  FiFileText,
  FiSettings,
  FiUsers,
  FiCoffee,
  FiLayers,
  FiGrid,
  FiImage,
  FiMenu,
  FiChevronRight,
  FiFile
} from "react-icons/fi"
import { FaTag, FaUtensils, FaTachometerAlt, FaPaintBrush } from "react-icons/fa"
import { ChevronDown } from "lucide-react"
import { fetchWithAuth } from "@/app/manager/_lib/fetch-with-auth"
import useManagerStore from '@/stores/manager/managerDetailsStore'
import Link from "next/link"

const mainMenuItems = [{ icon: <FaTachometerAlt />, text: "Dashboard", href: "/manager/dashboard" }]

const manageMenuSubItems = [
  {
    icon: <FiImage />,
    text: "Services",
    href: "/manager/manage-menu/services",
  },
  {
    icon: <FiGrid />,
    text: "Categories",
    href: "/manager/manage-menu/categories",
  },
  {
    icon: <FiLayers />,
    text: "Sub Categories",
    href: "/manager/manage-menu/sub-categories",
  },
  { icon: <FiCoffee />, text: "Items", href: "/manager/manage-menu/items" },
]

const settingsSubItems = [
  { icon: <FiFileText />, text: "PDFs", href: "/manager/pdfs" },
  { icon: <FaPaintBrush />, text: "Customisation", href: "/manager/branding" },
  { icon: <FiFile />, text: "About", href: "/manager/about" }
]

const bottomMenuItems = [
  { icon: <FaTag />, text: "Manage Tags", href: "/manager/tags" },
  { icon: <FiUsers />, text: "Contact List", href: "/manager/contacts" },
  { icon: <FiHelpCircle />, text: "Support", href: "/manager/support" },
  { icon: <FiLogOut />, text: "Logout", href: "/manager/logout" },
]

interface SidebarProps {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

export const Sidebar = ({ isSidebarOpen, toggleSidebar }: SidebarProps) => {
  const pathname = usePathname()
  const [isSettingsOpen, setIsSettingsOpen] = useState(true)
  const [isManageMenuOpen, setIsManageMenuOpen] = useState(true)
  const { manager, hotel, isHotelLoading } = useManagerStore()
  

  return (
    <>
      {/* Toggle button for collapsed state - now with black and white colors */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "fixed z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black text-white shadow-md transition-all duration-300",
          isSidebarOpen ? "top-5 left-56" : "top-5 left-5",
        )}
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarOpen ? <FiChevronRight /> : <FiMenu />}
      </button>

      <aside
        className={cn(
          "fixed top-0 left-0 h-screen border-l-4 border-black bg-gradient-to-b from-gray-50 to-gray-100 shadow-md transition-all duration-300 ease-in-out z-10",
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden",
        )}
      >
        <div className="p-6 pb-6 bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-bold bg-clip-text flex items-center gap-2">
            {isHotelLoading ? (
              <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></span>
            ) : (
              hotel.hotelName
            )}
          </h2>
          <p className="text-sm text-gray-600 mt-1">Branch Manager</p>
        </div>

        <ScrollArea className="h-[calc(100vh-5.5rem)]">
          <div className="px-3 py-2">
            <nav className="space-y-1.5">
              {mainMenuItems.map((item) => (
                <SidebarTab key={item.text} {...item} isActive={pathname.startsWith(item.href)} />
              ))}

              {/* Manage Menu with dropdown */}
              <DropdownMenu
                title="Manage Menu"
                icon={<FaUtensils className="w-5 h-5 min-w-[20px] mr-3" />}
                isOpen={isManageMenuOpen}
                setIsOpen={setIsManageMenuOpen}
                isActive={pathname.includes("/manager/manage-menu")}
              >
                {manageMenuSubItems.map((item) => (
                  <SidebarTab key={item.text} {...item} isActive={pathname === item.href} isSubmenu={true} />
                ))}
              </DropdownMenu>

              {/* Settings with dropdown */}
              <DropdownMenu
                title="Settings"
                icon={<FiSettings className="w-5 h-5 min-w-[20px] mr-3" />}
                isOpen={isSettingsOpen}
                setIsOpen={setIsSettingsOpen}
                isActive={
                  pathname.startsWith("/manager/settings") ||
                  pathname === "/manager/pdfs" ||
                  pathname === "/manager/branding"
                }
              >
                {settingsSubItems.map((item) => (
                  <SidebarTab key={item.text} {...item} isActive={pathname === item.href} isSubmenu={true} />
                ))}
              </DropdownMenu>

              <div className="my-4 border-t border-gray-200 opacity-70"></div>

              {bottomMenuItems.map((item) => (
                <SidebarTab key={item.text} {...item} isActive={pathname.startsWith(item.href)} />
              ))}
            </nav>
          </div>
        </ScrollArea>
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
  )
}

interface DropdownMenuProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  isActive: boolean
}

const DropdownMenu = ({ title, icon, children, isOpen, setIsOpen, isActive }: DropdownMenuProps) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0)
    }
  }, [isOpen, children])

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full px-4 py-2.5 text-sm rounded-md transition-all duration-200 ease-in-out",
          isActive
            ? "bg-gradient-to-r from-gray-200 to-gray-100 font-medium shadow-sm"
            : "text-gray-700 hover:bg-gray-200/70",
        )}
      >
        <div className="flex items-center truncate pr-2">
          {icon}
          <span className="truncate">{title}</span>
        </div>
        <span className="ml-auto">
          <ChevronDown
            className={cn(
              "w-4 h-4 text-gray-500 transition-transform duration-300 ease-in-out",
              isOpen && "transform rotate-180",
            )}
          />
        </span>
      </button>

      <div
        ref={contentRef}
        style={{ height: height !== undefined ? `${height}px` : "auto" }}
        className={cn(
          "pl-8 pr-3 space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
          !isOpen && "opacity-80",
        )}
      >
        <div className="py-1.5">{children}</div>
      </div>
    </div>
  )
}

interface SidebarTabProps {
  icon: React.ReactNode
  text: string
  href: string
  isActive: boolean
  isSubmenu?: boolean
}

const SidebarTab = ({ icon, text, href, isActive, isSubmenu = false }: SidebarTabProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center w-full px-3 py-2 text-sm rounded-md transition-all duration-200 ease-in-out",
        isActive
          ? isSubmenu
            ? "bg-gradient-to-r from-gray-200/80 to-gray-100 font-medium text-black"
            : "bg-gradient-to-r from-gray-200 to-gray-100 font-medium shadow-sm"
          : "text-gray-700 hover:bg-gray-200/70",
        isSubmenu ? "text-sm" : "",
      )}
    >
      <span className={cn("flex items-center", isSubmenu ? "text-gray-600" : "")}>
        <span className={cn("w-5 h-5 min-w-[20px]", isSubmenu ? "w-4 h-4 min-w-[16px]" : "")}>{icon}</span>
        <span className={cn("ml-3 truncate", isActive ? "font-medium" : "")}>{text}</span>
      </span>
    </Link>
  )
}

