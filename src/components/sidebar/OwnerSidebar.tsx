"use client"
import { usePathname } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FiLogOut, FiHelpCircle, FiUsers, FiMenu, FiChevronRight } from "react-icons/fi"
import { FaTachometerAlt, FaBuilding, FaMoneyBillWave } from "react-icons/fa"
import Image from "next/image"
import { cn } from "@/lib/utils"
import Link from "next/link"

const mainMenuItems = [
  { icon: <FaTachometerAlt />, text: "Dashboard", href: "/owner/dashboard" },
  { icon: <FaBuilding />, text: "Manage Branches", href: "/owner/branches" },
  { icon: <FiUsers />, text: "Manage Accounts", href: "/owner/accounts" },
  {
    icon: <FaMoneyBillWave />,
    text: "Subscription Details",
    href: "/owner/subscription",
  },
]

const bottomMenuItems = [
  { icon: <FiHelpCircle />, text: "Support", href: "/owner/support" },
  { icon: <FiLogOut />, text: "Logout", href: "/owner/logout" },
]

const OwnerSidebar = ({ isSidebarOpen, toggleSidebar }: { isSidebarOpen: boolean; toggleSidebar: () => void }) => {
  const pathname = usePathname()

  return (
    <>
      {/* Toggle button for collapsed state */}
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
          "fixed top-0 left-0 flex h-screen flex-col justify-between border-l-4 border-black bg-gradient-to-b from-gray-50 to-gray-100 shadow-md transition-all duration-300 ease-in-out z-10",
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden",
        )}
      >
        <div>
          <div className="p-6 pb-6 bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-bold">Hotel Owner</h2>
            <p className="text-sm text-gray-600 mt-1">Hotel Management</p>
          </div>

          <ScrollArea className="h-[calc(100vh-13rem)]">
            <div className="px-3 py-2">
              <nav className="space-y-1.5">
                {mainMenuItems.map((item) => (
                  <SidebarTab key={item.text} {...item} isActive={pathname.startsWith(item.href)} />
                ))}
                {bottomMenuItems.map((item) => (
                  <SidebarTab key={item.text} {...item} isActive={pathname.startsWith(item.href)} />
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
            <Image src="/Quickgick_transparent.png" alt="Quickgick" width={100} height={25} className="h-auto" />
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



export default OwnerSidebar; 

