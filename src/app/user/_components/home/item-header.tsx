"use client";

import { useState, useEffect, useMemo } from "react";
import { useSidebar } from "../sidebar-provider";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { Item } from "@/types/menu/Items";
import { Skeleton } from "@/components/ui/skeleton";

export function ItemHeader({
  hotelId,
  items,
  serviceId,
}: {
  hotelId: string;
  items: Item[];
  serviceId: string;
}) {
  const { toggle } = useSidebar();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    if (showMobileSearch) {
      setShowResults(false);
    }
  };

  const filteredItems = useMemo(() => {
    if (searchTerm.length > 0) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }

    return items.filter((item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".search-container")) {
        setShowResults(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const renderSearchResult = (item: Item) => (
    <Link
      href={`/user/${hotelId}/services/${serviceId}/items/${item._id}`}
      className="flex items-center p-2 hover:bg-gray-50 border-b border-gray-100 last:border-0"
      onClick={() => {
        setShowResults(false);
        setShowMobileSearch(false);
      }}
    >
      <div className="w-10 h-10 rounded overflow-hidden mr-2 flex-shrink-0">
        <img
          src={item.itemImage || "/placeholder.svg"}
          alt={item.itemName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{item.itemName}</h4>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-700">₹{item.price}</p>
          {item.vegNonVeg && (
            <span className="text-xs text-gray-500">{item.vegNonVeg}</span>
          )}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="bg-white">
      <div className="flex h-12 items-center justify-center px-4">
        {/* Desktop search */}
        <div className="w-full max-w-md relative search-container">
          <form className="relative w-full" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search items..."
              className="w-full h-9 pl-9 pr-3 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </form>

          {/* Desktop search results */}
          {showResults && filteredItems.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
              {filteredItems.map((item) => renderSearchResult(item))}
            </div>
          )}
        </div>

        {/* Mobile search button - only visible on mobile */}
        <button onClick={toggleMobileSearch} className="md:hidden p-2 absolute right-4">
          <Search className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile search overlay */}
      <div
        className={`fixed inset-0 bg-white z-50 md:hidden transition-all duration-300 ease-in-out ${
          showMobileSearch
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex h-16 items-center px-4">
          <div className="flex-1 mx-2 search-container">
            <form className="relative w-full" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Search items..."
                className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus={showMobileSearch}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </form>

            {/* Mobile search results */}
            {showResults && filteredItems.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 mx-4 bg-white rounded-lg shadow-lg max-h-[calc(100vh-120px)] overflow-y-auto">
                {filteredItems.map((item) => renderSearchResult(item))}
              </div>
            )}
          </div>

          <button onClick={toggleMobileSearch} className="p-2 ml-2">
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
