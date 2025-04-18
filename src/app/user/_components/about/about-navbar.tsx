"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

function AboutNavbar({ hotelId }: { hotelId: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-16 z-30 flex items-center gap-2 bg-cream/70 backdrop-blur-md px-4 py-3 shadow-sm"
    >
      <Link
        href={`/user/${hotelId}`}
        className="flex h-8 w-8 items-center justify-center rounded-full text-brown transition-all duration-200 hover:bg-[#8B5A2B]/90 hover:text-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>
      <h1 className="text-base font-medium">About Hotel</h1>
    </motion.div>
  );
}

export default AboutNavbar;
