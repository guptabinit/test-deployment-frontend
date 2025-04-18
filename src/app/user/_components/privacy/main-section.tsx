import { motion } from "framer-motion";
import { containerVariants } from "../../[hotelId]/_animation-constants/variants";
import PolicySection from "./policy-section";
import QuerySection from "./query-section";

type Props = {
  hotelId: string;
  policySections: any;
  sectionRefs: any;
};

const MainSection = ({ hotelId, policySections, sectionRefs }: Props) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="lg:col-span-3"
    >
      <PolicySection
        policySections={policySections}
        sectionRefs={sectionRefs}
      />

      <QuerySection hotelId={hotelId as string} />
    </motion.div>
  );
};

export default MainSection;
