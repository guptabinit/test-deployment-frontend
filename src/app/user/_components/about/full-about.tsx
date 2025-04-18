import { motion } from "framer-motion";
import HeroImage from "./hero-image";
import ContactSection from "./contact-section";
import { containerVariants } from "../../[hotelId]/_animation-constants/variants";
import AboutSection from "./about-section";
import AmenitiesSection from "./amenities-section";
import GallerySection from "./gallery-section";

type Props = {
  aboutData: any;
  customization: any;
  formattedAddress: string;
  setActiveImageIndex: any;
  setShowGalleryModal: any;
};

const FullAbout = ({
  aboutData,
  customization,
  formattedAddress,
  setActiveImageIndex,
  setShowGalleryModal,
}: Props) => {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Hero Image */}
      <HeroImage aboutData={aboutData} />

      {/* Contact Information */}
      <ContactSection
        customization={customization}
        aboutData={aboutData}
        formattedAddress={formattedAddress}
      />

      {/* About Us */}
      <AboutSection customization={customization} aboutData={aboutData} />

      {/* Amenities */}
      <AmenitiesSection customization={customization} aboutData={aboutData} />

      {/* Gallery */}
      <GallerySection
        customization={customization}
        aboutData={aboutData}
        setActiveImageIndex={setActiveImageIndex}
        setShowGalleryModal={setShowGalleryModal}
      />
    </motion.div>
  );
};

export default FullAbout;
