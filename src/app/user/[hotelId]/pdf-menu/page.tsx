"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, ArrowUp } from "lucide-react";

import { Header } from "../../_components/header";
import { Sidebar } from "../../_components/sidebar";
import { Footer } from "../../_components/footer";
import PdfNavbar from "../../_components/pdf-menu/pdf-navbar";
import PdfCard from "../../_components/pdf-menu/pdf-card";
import PdfLoader from "../../_components/pdf-menu/pdf-loader";

import { containerVariants } from "../_animation-constants/variants";
import { useHotelDataStore } from "@/stores/user/hotelDataStore";

export default function PDFMenuPage() {
  const { hotelId } = useParams();
  const { customization, isCustomizationLoaded, pdfs, isPdfLoaded } =
    useHotelDataStore();

  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <div
      className="flex min-h-screen flex-col bg-gray-50"
    >
      <Header
        hotelId={hotelId as string}
        hotelLogo={customization?.hotelLogo as string}
        isLogoLoaded={isCustomizationLoaded}
      />

      <Sidebar />

      <main
        className="flex-1"
        style={{ backgroundColor: customization?.hotelColors?.backgroundColor }}
      >
        <PdfNavbar customization={customization} hotelId={hotelId as string} />

        <div className="container mx-auto max-w-3xl px-4 py-6">
          {isPdfLoaded ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {pdfs.map((pdf) => (
                <PdfCard
                  key={pdf._id}
                  customization={customization}
                  pdf={pdf}
                  activeCard={activeCard}
                  setActiveCard={setActiveCard}
                />
              ))}
            </motion.div>
          ) : (
            <PdfLoader />
          )}

          {isPdfLoaded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex justify-center"
            >
              <a
                href="#top"
                className="flex items-center gap-1 rounded-full bg-white p-2 text-xs text-gray-500 shadow-sm transition-all duration-300 hover:bg-gray-50 hover:shadow"
              >
                <ArrowUp className="h-3 w-3" />
                Back to top
              </a>
            </motion.div>
          )}

          {isPdfLoaded && pdfs.length === 0 && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400" />
                <h2 className="text-lg font-medium text-gray-600">
                  No PDFs found
                </h2>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
