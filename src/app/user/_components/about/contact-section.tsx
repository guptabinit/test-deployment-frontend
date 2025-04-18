import { motion } from "framer-motion";
import { Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { itemVariants } from "../../[hotelId]/_animation-constants/variants";

type Props = {
    customization: any;
    aboutData: any;
    formattedAddress: string;
};

const ContactSection = ({ customization, aboutData, formattedAddress}: Props) => {
  return (
    <motion.div
      variants={itemVariants}
      className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <h2
        className="mb-4 text-xl font-medium"
        style={{ color: customization?.hotelColors.primary }}
      >
        Contact Information
      </h2>

      <div className="space-y-4">
        <div className="flex items-start gap-3 group">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
            style={{
              backgroundColor: `${customization?.hotelColors.primary}10`,
              color: customization?.hotelColors.primary,
            }}
          >
            <MapPin className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Address</p>
            <p className="text-sm text-gray-600">{formattedAddress}</p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                formattedAddress
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs font-medium hover:underline"
              style={{ color: customization?.hotelColors.primary }}
            >
              View on Map <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3 group">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
            style={{
              backgroundColor: `${customization?.hotelColors.primary}10`,
              color: customization?.hotelColors.primary,
            }}
          >
            <Phone className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Phone</p>
            <a
              href={`tel:${aboutData.overview.phoneNumber}`}
              className="text-sm text-gray-600 hover:underline"
              onMouseOver={(e) => {
                e.currentTarget.style.color =
                  customization?.hotelColors.primary;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = "";
              }}
            >
              {aboutData.overview.phoneNumber}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3 group">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
            style={{
              backgroundColor: `${customization?.hotelColors.primary}10`,
              color: customization?.hotelColors.primary,
            }}
          >
            <Mail className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Email</p>
            <a
              href={`mailto:info@${aboutData.overview.name
                .toLowerCase()
                .replace(/\s+/g, "")}.com`}
              className="text-sm text-gray-600 hover:underline"
              onMouseOver={(e) => {
                e.currentTarget.style.color =
                  customization?.hotelColors.primary;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = "";
              }}
            >
              info@
              {aboutData.overview.name.toLowerCase().replace(/\s+/g, "")}
              .com
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3 group">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
            style={{
              backgroundColor: `${customization?.hotelColors.primary}10`,
              color: customization?.hotelColors.primary,
            }}
          >
            <Clock className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Hours</p>
            <div className="flex flex-col text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Check-in:</span>
                <span className="font-medium">
                  {aboutData.overview.openingTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Check-out:</span>
                <span className="font-medium">
                  {aboutData.overview.closingTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactSection;
