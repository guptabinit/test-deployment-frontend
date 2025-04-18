import { motion } from "framer-motion";
import { itemVariants } from "../../[hotelId]/_animation-constants/variants";
import { Customization } from "@/types/Customization";

type Props = {
    customization: Customization;
    aboutData: any;
    setActiveImageIndex: (index: any) => void;
    setShowGalleryModal: (check: boolean) => void;

};

const GallerySection = ({ customization, aboutData, setActiveImageIndex, setShowGalleryModal
 }: Props) => {
  return (
    <motion.div
      variants={itemVariants}
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <h2
        className="mb-4 text-xl font-medium"
        style={{ color: customization?.hotelColors.primary }}
      >
        Gallery
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {aboutData.gallery.slice(0, 4).map((image, index) => (
          <div
            key={index}
            className="group relative h-32 cursor-pointer overflow-hidden rounded-lg"
            onClick={() => {
              setActiveImageIndex(index);
              setShowGalleryModal(true);
            }}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${image.url}`}
              alt={image.caption || `Gallery image ${index + 1}`}
              className="object-cover transition-transform duration-500 group-hover:scale-110 w-full h-full"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 p-2 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="text-xs font-medium">
                {image.caption || `View ${index + 1}`}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowGalleryModal(true)}
        className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg py-2 text-sm font-medium text-white transition-all duration-300"
        style={{
          backgroundColor: customization?.hotelColors.primary,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor =
            customization?.hotelColors.secondary;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor =
            customization?.hotelColors.primary;
        }}
      >
        View All Photos
      </button>
    </motion.div>
  );
};

export default GallerySection;
