import React from "react";
import { itemVariants } from "../../[hotelId]/_animation-constants/variants";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Link from "next/link";

function QuerySection({ hotelId }: { hotelId: string }) {
  return (
    <motion.div
      variants={itemVariants}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm print:hidden"
    >
      <h3 className="mb-4 text-lg font-medium text-gray-800">
        Have Questions?
      </h3>
      <p className="mb-4 text-sm text-gray-600">
        If you have any questions about our privacy policy or how we handle your
        data, please don't hesitate to contact us.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href="mailto:privacy@minimalisthotels.com"
          className="flex items-center gap-2 rounded-lg bg-[#8B5A2B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#704A22]"
        >
          <Mail className="h-4 w-4" />
          Email Us
        </a>

        <Link
          href={`/user/${hotelId}feedback`}
          className="flex items-center gap-2 rounded-lg border border-[#8B5A2B] px-4 py-2 text-sm font-medium text-[#8B5A2B] transition-colors hover:bg-[#FFF2E6]"
        >
          Send Feedback
        </Link>
      </div>
    </motion.div>
  );
}

export default QuerySection;
