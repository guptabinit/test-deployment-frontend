import { motion } from "framer-motion";
import { itemVariants } from "../../[hotelId]/_animation-constants/variants";
import { Customization } from "@/types/Customization";

type Props = {
  customization: Customization;
  aboutData: any;
};

const AboutSection = ({ customization, aboutData }: Props) => {
  return (
    <motion.div
      variants={itemVariants}
      className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <h2
        className="mb-4 text-xl font-medium"
        style={{ color: customization?.hotelColors.primary }}
      >
        About Us
      </h2>
      <div className="space-y-4 text-gray-600">
        {typeof aboutData.about === "string" ? (
          <div
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: aboutData.about }}
          />
        ) : (
          <p className="text-sm leading-relaxed">
            {aboutData.overview.name} is a luxury hotel located in{" "}
            {aboutData.overview.hotelCity}, offering a perfect blend of modern
            amenities and traditional hospitality.
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {aboutData.amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity.name}
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: `${customization?.hotelColors.primary}10`,
                color: customization?.hotelColors.primary,
              }}
            >
              {amenity.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AboutSection;
