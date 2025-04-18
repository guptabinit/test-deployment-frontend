import { motion } from "framer-motion";

type Props = {
  fetchedServices: any[];
  activeServiceId: string | "";
  setActiveServiceId: (serviceId: string | "") => void;
  searchQuery: string;
  customization: any;
};

const ServiceTabs = ({
  fetchedServices,
  activeServiceId,
  setActiveServiceId,
  searchQuery,
  customization,
}: Props) => {
  return (
    <>
      {!searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
        >
          <button
            onClick={() => setActiveServiceId("")}
            className="whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium transition-all"
            style={{
              backgroundColor:
                activeServiceId === null
                  ? customization?.hotelColors.primary
                  : "white",
              color:
                activeServiceId === null
                  ? "white"
                  : customization?.hotelColors.primary,
            }}
            onMouseOver={(e) => {
              if (activeServiceId !== null) {
                e.currentTarget.style.backgroundColor = `${customization?.hotelColors.primary}10`;
              }
            }}
            onMouseOut={(e) => {
              if (activeServiceId !== null) {
                e.currentTarget.style.backgroundColor = "white";
              }
            }}
          >
            All
          </button>
          {fetchedServices.map((service) => (
            <button
              key={service.serviceName}
              onClick={() => setActiveServiceId(service._id)}
              className="whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium transition-all"
              style={{
                backgroundColor:
                  activeServiceId === service._id
                    ? customization?.hotelColors.primary
                    : "white",
                color:
                  activeServiceId === service._id
                    ? "white"
                    : customization?.hotelColors.primary,
              }}
              onMouseOver={(e) => {
                if (activeServiceId !== service._id) {
                  e.currentTarget.style.backgroundColor = `${customization?.hotelColors.primary}10`;
                }
              }}
              onMouseOut={(e) => {
                if (activeServiceId !== service._id) {
                  e.currentTarget.style.backgroundColor = "white";
                }
              }}
            >
              {service.serviceName}
            </button>
          ))}
        </motion.div>
      )}
    </>
  );
};

export default ServiceTabs;
