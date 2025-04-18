import React from 'react'
import { itemVariants } from '../../[hotelId]/_animation-constants/variants'
import { motion } from 'framer-motion'
import { Eye, FileText } from 'lucide-react'
import Link from 'next/link'

function PdfCard({ customization, pdf, activeCard, setActiveCard }) {
  return (
    <motion.div
    key={pdf._id}
    variants={itemVariants}
    onHoverStart={() => setActiveCard(pdf._id)}
    onHoverEnd={() => setActiveCard(null)}
    className={`group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-md ${
      activeCard === pdf._id ? "scale-[1.02]" : ""
    }`}
  >
    <div className="flex items-start gap-4">
      <div
        className="rounded-lg p-3 transition-all duration-300 group-hover:scale-110"
        style={{
          backgroundColor: customization?.hotelColors?.primary,
          color: customization?.hotelColors?.textColor,
        }}
      >
        <FileText className="h-6 w-6" />
      </div>

      <div className="flex-1">
        <h2
          className="font-medium transition-all duration-300"
          style={{ color: customization?.hotelColors?.primary }}
        >
          {pdf.pdfName}
        </h2>
        <p className="mb-3 text-sm text-gray-600">
          {pdf.pdfDescription}
        </p>
        <div className="flex gap-2">
          <Link
            href={pdf.pdfLink}
            target='_blank'
            className="inline-flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium border transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              borderColor: customization?.hotelColors?.primary,
              color: customization?.hotelColors?.primary,
            }}
          >
            <Eye className="h-3 w-3" />
            View
          </Link>
        </div>
      </div>
    </div>

    {/* Decorative element */}
    <div
      className="absolute -right-12 -top-12 h-24 w-24 rounded-full opacity-10 transition-all duration-500 group-hover:scale-150"
      style={{
        backgroundColor: customization?.hotelColors?.primary,
      }}
    />
  </motion.div>
  )
}

export default PdfCard