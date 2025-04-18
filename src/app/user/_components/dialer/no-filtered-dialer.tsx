import { Customization } from "@/types/Customization";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";

type Props = {
  customization: any;
  setSearchQuery: (query: string) => void;
  setActiveServiceId: (serviceId: string | "") => void;
};

const NoFilteredDialer = ({
  customization,
  setSearchQuery,
  setActiveServiceId,
}: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-10 text-center"
    >
      <div
        className="mb-4 rounded-full p-4"
        style={{ backgroundColor: `${customization?.hotelColors.primary}10` }}
      >
        <Phone
          className="h-6 w-6"
          style={{ color: customization?.hotelColors.primary }}
        />
      </div>
      <h3 className="mb-1 text-lg font-medium">No results found</h3>
      <p className="text-sm text-gray-500">
        Try a different search term or service.
      </p>
      <button
        onClick={() => {
          setSearchQuery("");
          setActiveServiceId("");
        }}
        className="mt-4 rounded-full px-4 py-2 text-sm text-white transition-all"
        style={{
          backgroundColor: customization?.hotelColors.primary,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor &&
            customization?.hotelColors.secondary;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor &&
            customization?.hotelColors.primary;
        }}
      >
        Reset filters
      </button>
    </motion.div>
  );
};

export default NoFilteredDialer;
