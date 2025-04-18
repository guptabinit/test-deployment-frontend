import { motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { useState } from "react";
import { itemVariants } from "../../[hotelId]/_animation-constants/variants";
import { Customization } from "@/types/Customization";

type Props = {
  customization: Customization;
  aboutData: any;
};

const AmenitiesSection = ({ customization, aboutData }: Props) => {
  const [visibleAmenities, setVisibleAmenities] = useState(6);

  return (
    <motion.div
      variants={itemVariants}
      className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <h2
        className="mb-4 text-xl font-medium"
        style={{ color: customization?.hotelColors.primary }}
      >
        Amenities
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {aboutData.amenities.slice(0, visibleAmenities).map((amenity) => {
          return (
            <div
              key={amenity.name}
              className="group flex items-start gap-3 rounded-lg p-2 transition-all duration-300"
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = `${customization?.hotelColors.primary}10`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "";
              }}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300"
                style={{
                  backgroundColor: `${customization?.hotelColors.primary}10`,
                  color: customization?.hotelColors.primary,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = `${customization?.hotelColors.primary}10`;
                }}
              >
                <Check className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{amenity.name}</p>
                <p className="text-xs text-gray-500">{amenity.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {visibleAmenities < aboutData.amenities.length && (
        <button
          onClick={() => setVisibleAmenities(aboutData.amenities.length)}
          className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border py-2 text-sm font-medium transition-all duration-300"
          style={{
            borderColor: customization?.hotelColors.primary,
            color: customization?.hotelColors.primary,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = `${customization?.hotelColors.primary}10`;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "";
          }}
        >
          Show All Amenities <ChevronRight className="h-4 w-4" />
        </button>
      )}

      {visibleAmenities === aboutData.amenities.length &&
        visibleAmenities > 6 && (
          <button
            onClick={() => setVisibleAmenities(6)}
            className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border py-2 text-sm font-medium transition-all duration-300"
            style={{
              borderColor: customization?.hotelColors.primary,
              color: customization?.hotelColors.primary,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = `${customization?.hotelColors.primary}10`;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "";
            }}
          >
            Show Less
          </button>
        )}
    </motion.div>
  );
};

export default AmenitiesSection;
