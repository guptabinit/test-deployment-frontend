import { Contact } from "@/types/Contact";
import { motion } from "framer-motion";
import { PhoneCall } from "lucide-react";
import { itemVariants } from "../../[hotelId]/_animation-constants/variants";

type Props = {
  contact: Contact;
  customization: any;
  fetchedServices: any[];
};

function DialCard({ contact, customization, fetchedServices }: Props) {
  // Function to handle phone call
  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // Get first letter of name for avatar
  const firstLetter = contact.name.charAt(0).toUpperCase();

  return (
    <motion.div
      variants={itemVariants}
      className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:shadow-md"
    >
      <div className="flex items-start gap-4 p-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: customization?.hotelColors.primary }}
        >
          {firstLetter}
        </div>

        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between">
            <h3
              className="font-medium"
              style={{ color: customization?.hotelColors.textColor }}
            >
              {contact.name}
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                <span className="font-medium">Landline:</span>{" "}
                {contact.landlineContact}
              </p>
              <button
                onClick={() => handleCall(contact.landlineContact)}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300"
                style={{
                  backgroundColor: `${customization?.hotelColors.primary}10`,
                  color: customization?.hotelColors.primary,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor =
                    customization?.hotelColors.primary;
                  e.currentTarget.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = `${customization?.hotelColors.primary}10`;
                  e.currentTarget.style.color =
                    customization?.hotelColors.primary;
                }}
              >
                <PhoneCall className="h-4 w-4" />
              </button>
            </div>

            {contact.mobileContact && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Mobile:</span>{" "}
                  {contact.mobileContact}
                </p>
                <button
                  onClick={() => handleCall(contact.mobileContact!)}
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: `${customization?.hotelColors.primary}10`,
                    color: customization?.hotelColors.primary,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor =
                      customization?.hotelColors.primary;
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = `${customization?.hotelColors.primary}10`;
                    e.currentTarget.style.color =
                      customization?.hotelColors.primary;
                  }}
                >
                  <PhoneCall className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div
            className="mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs"
            style={{
              backgroundColor: `${customization?.hotelColors.primary}10`,
              color: customization?.hotelColors.primary,
            }}
          >
            {
              fetchedServices.find(
                (service) => service._id === contact.serviceId
              )?.serviceName
            }
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DialCard;
