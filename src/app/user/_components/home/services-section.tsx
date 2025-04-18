import { Service } from "@/types/menu/Services";
import { motion } from "framer-motion";
import { ServiceCard } from "./service-card";
import {
  containerVariants,
  itemVariants,
} from "../../[hotelId]/_animation-constants/variants";
import LoaderSkeleton from "./loader-skeleton";

type Props = {
  hotelServices: Service[];
  hotelId: string;
  isLoaded: boolean;
};

const ServicesSection = ({ hotelServices, hotelId, isLoaded }: Props) => {
  return (
    <>
      {isLoaded ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {hotelServices.length > 0 ? (
            hotelServices.map((service, index) => (
              <motion.div key={service.serviceName} variants={itemVariants}>
                <ServiceCard service={service} hotelId={hotelId as string} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <div className="text-gray-500">
                No services found! Please check back later.
              </div>
              {/* <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                }}
              >
                Reset filters
              </Button> */}
            </motion.div>
          )}
        </motion.div>
      ) : (
        <LoaderSkeleton />
      )}
    </>
  );
};

export default ServicesSection;
