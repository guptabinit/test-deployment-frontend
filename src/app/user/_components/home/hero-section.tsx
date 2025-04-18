import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import WelcomeBanner from "./welcome-banner";

interface Banner {
  bannerImage: string;
  bannerText: string;
}

type Props = {
  hotelId: string;
  hotelStreet: string;
  hotelCity: string;
  hotelState: string;
  hotelName: string;
  banners: Banner[] | undefined;
};

const HeroSection = ({
  hotelName,
  hotelStreet,
  hotelId,
  hotelCity,
  hotelState,
  banners,
}: Props) => {
  return (
    <>
      <WelcomeBanner
        hotelName={hotelName}
        hotelStreet={hotelStreet}
        hotelId={hotelId}
        hotelCity={hotelCity}
        hotelState={hotelState}
        banners={banners}
      />

      {/* Services Header section */}
      <div className="mb-6 flex items-center justify-between">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-semibold text-gray-800"
        >
          Our Services
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href={`/user/${hotelId}/pdf-menu`}
            className="group flex items-center gap-1 text-sm font-medium text-black hover:text-gray-700 transition-colors"
          >
            View Booklet
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </>
  );
};

export default HeroSection;
