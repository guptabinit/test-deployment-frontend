import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import React from "react";

function SearchBar({
  searchQuery,
  setSearchQuery,
  setActiveServiceId,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setActiveServiceId: (serviceId: string | "") => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
      className="mb-4 relative"
    >
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        placeholder="Search by name or number..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setActiveServiceId("");
        }}
        className="pl-10 pr-10 py-2 rounded-full border-gray-200 bg-white"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
}

export default SearchBar;
