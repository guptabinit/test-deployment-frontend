"use client";

import { useSidebar } from "./sidebar-provider";
import Link from "next/link";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export function Sidebar() {
  const { hotelId } = useParams();
  const { isOpen, close } = useSidebar();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const navItems = [
    { name: "HOME", path: `/user/${hotelId}` },
    { name: "VIEW PDF MENU", path: `/user/${hotelId}/pdf-menu` },
    { name: "DIAL LIST", path: `/user/${hotelId}/dial-list` },
    { name: "ABOUT HOTEL", path: `/user/${hotelId}/about` },
    { name: "REPORT SOMETHING", path: `/user/${hotelId}/report-issue` },
    { name: "GENERAL FEEDBACK", path: `/user/${hotelId}/feedback` },
    { name: "PRIVACY POLICY", path: `/user/${hotelId}/privacy` },
    { name: "TERMS AND CONDITIONS", path: `/user/${hotelId}/terms` },
  ];

  // Handle mounting/unmounting with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to ensure the component mounts with initial styles first
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 500); // Match this with the transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-500 ease-in-out ${
        isAnimating
          ? "bg-white/80 backdrop-blur-sm opacity-100"
          : "bg-white/0 backdrop-blur-none opacity-0"
      }`}
      onClick={close}
    >
      <div
        className={`fixed inset-y-0 left-0 z-50 h-full w-full max-w-xs bg-white shadow-lg transition-all duration-500 ease-out ${
          isAnimating ? "translate-x-0 scale-100" : "-translate-x-full scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full flex-col">
          <div
            className={`flex items-center justify-end p-4 transition-all duration-300 delay-100 ${
              isAnimating
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
          >
            <button
              onClick={close}
              className="p-2 transition-all duration-200 hover:scale-110 hover:rotate-90 active:scale-95"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close sidebar</span>
            </button>
          </div>

          <nav className="flex-1 overflow-hidden">
            <ul className="space-y-0">
              {navItems.map((item, index) => (
                <li
                  key={item.path}
                  className={`transition-all duration-300 ${
                    isAnimating
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-8"
                  }`}
                  style={{
                    transitionDelay: isAnimating
                      ? `${150 + index * 50}ms`
                      : "0ms",
                  }}
                >
                  <Link
                    href={item.path}
                    className="block border-t border-gray-200 py-4 px-6 text-sm font-medium transition-all duration-200 hover:bg-[#FFF2E6] hover:pl-8 active:bg-[#FFE6CC]"
                    onClick={close}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div
            className={`border-t border-gray-200 p-4 text-center text-xs transition-all duration-300 ${
              isAnimating
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: isAnimating ? "500ms" : "0ms" }}
          >
            <p className="mb-2">App Version: v1.0.0</p>
            <div className="flex flex-col items-center gap-1">
              <a href={`https://www.quickgick.com`} target="_blank" rel="noopener noreferrer">
                <p>Powered by</p>
                <Image
                  src="/QG_black.png"
                  alt="Quickgick"
                  width={100}
                  height={25}
                  className={`h-auto transition-all duration-500 ${
                    isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-90"
                  }`}
                  style={{ transitionDelay: isAnimating ? "600ms" : "0ms" }}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
