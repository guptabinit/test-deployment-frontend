import { motion } from "framer-motion";
import { itemVariants } from "../../[hotelId]/_animation-constants/variants";
import { MapPin } from "lucide-react";

type Props = {
  aboutData: any;
};

const HeroImage = ({ aboutData }: Props) => {
  console.log("aboutData", aboutData.gallery);
  return (
    <motion.div
      variants={itemVariants}
      className="mb-6 overflow-hidden rounded-xl shadow-sm"
    >
      <div className="relative h-64 w-full">
        <img
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${aboutData.gallery[0].url}`}
          alt={aboutData.overview.name}
          className="object-cover transition-transform duration-10000 hover:scale-110 w-full h-full"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <h2 className="text-2xl font-bold drop-shadow-md">
            {aboutData.overview.name}
          </h2>
          <p className="flex items-center gap-1 text-sm">
            <MapPin className="h-4 w-4" />
            {aboutData.overview.hotelCity}, {aboutData.overview.hotelCountry}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroImage;
