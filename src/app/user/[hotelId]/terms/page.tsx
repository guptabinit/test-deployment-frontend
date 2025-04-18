"use client";

import { useState, useEffect } from "react";
import { HomeHeader } from "../../_components/home/home-header";
import { Sidebar } from "../../_components/sidebar";
import { Footer } from "../../_components/footer";
import Link from "next/link";
import {
  ChevronLeft,
  FileText,
  ArrowDown,
  CheckCircle,
  Shield,
  Scale,
} from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "../../_components/header";
import { useParams } from "next/navigation";
import {
  containerVariants,
  itemVariants,
} from "../_animation-constants/variants";
import { useHotelDataStore } from "@/stores/user/hotelDataStore";

export default function TermsAndConditionsPage() {
  const { hotelId } = useParams();

  const { customization, isCustomizationLoaded } = useHotelDataStore();

  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      content:
        "Welcome to our hotel service application. These Terms and Conditions govern your use of our application and services provided through it. By accessing or using our application, you agree to be bound by these Terms and Conditions.",
      icon: FileText,
      color: "#FFF2E6",
      textColor: "#8B5A2B",
    },
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      content:
        "By accessing or using our application, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our application.",
      icon: CheckCircle,
      color: "#E6F7FF",
      textColor: "#0072B5",
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      content:
        "Your privacy is important to us. Our Privacy Policy, which is incorporated into these Terms and Conditions, explains how we collect, use, and protect your personal information. By using our application, you consent to the collection and use of information as described in our Privacy Policy.",
      icon: Shield,
      color: "#F0FFF4",
      textColor: "#2F855A",
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      content:
        "To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use or inability to use the application.",
      icon: Scale,
      color: "#FAF5FF",
      textColor: "#6B46C1",
    },
    {
      id: "changes",
      title: "Changes to Terms",
      content:
        "We reserve the right to modify these Terms and Conditions at any time. We will provide notice of significant changes by posting the updated terms on our application. Your continued use of the application after such modifications constitutes your acceptance of the revised Terms and Conditions.",
      icon: FileText,
      color: "#FFF5F5",
      textColor: "#E53E3E",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        hotelId={hotelId as string}
        hotelLogo={customization?.hotelLogo as string}
        isLogoLoaded={isCustomizationLoaded}
      />
      <Sidebar />

      <main
        className="flex-1"
        style={{
          backgroundColor: customization?.hotelColors?.backgroundColor,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="sticky top-16 z-30 flex items-center gap-2 bg-cream/70 backdrop-blur-md px-4 py-3 shadow-sm"
        >
          <Link
            href="/user"
            className="flex h-8 w-8 items-center justify-center rounded-full text-brown transition-all duration-200 hover:bg-[#8B5A2B]/90 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-medium">Terms and Conditions</h1>
        </motion.div>

        <div className="container mx-auto max-w-3xl px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 rounded-lg border border-[#8B5A2B]/20 bg-[#FFF8F2] p-4 text-[#8B5A2B]"
          >
            <p className="text-sm">
              Last updated: March 18, 2025. Please read these terms carefully
              before using our application.
            </p>
          </motion.div>

          {isLoaded ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {sections.map((section) => (
                <motion.div
                  key={section.id}
                  variants={itemVariants}
                  onHoverStart={() => setActiveSection(section.id)}
                  onHoverEnd={() => setActiveSection(null)}
                  className={`group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-md ${
                    activeSection === section.id ? "scale-[1.01]" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="rounded-lg p-3 transition-all duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: section.color,
                        color: section.textColor,
                      }}
                    >
                      <section.icon className="h-6 w-6" />
                    </div>

                    <div className="flex-1">
                      <h2
                        className="mb-2 font-medium transition-all duration-300"
                        style={{ color: section.textColor }}
                        id={section.id}
                      >
                        {section.title}
                      </h2>
                      <p className="text-sm text-gray-600">{section.content}</p>
                    </div>
                  </div>

                  {/* Decorative element */}
                  <div
                    className="absolute -right-12 -top-12 h-24 w-24 rounded-full opacity-10 transition-all duration-500 group-hover:scale-150"
                    style={{ backgroundColor: section.textColor }}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200"></div>
                    <div className="flex-1">
                      <div className="mb-2 h-5 w-2/3 animate-pulse rounded bg-gray-200"></div>
                      <div className="mb-3 h-4 w-full animate-pulse rounded bg-gray-200"></div>
                      <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <div className="border-b border-gray-100 bg-gradient-to-r from-[#8B5A2B]/10 to-transparent p-4">
              <h2 className="text-lg font-medium text-[#8B5A2B]">
                Additional Information
              </h2>
            </div>

            <div className="p-4 text-sm text-gray-600">
              <p className="mb-4">
                If you have any questions or concerns about these Terms and
                Conditions, please contact our customer service team through the
                "Report Something" section in the app.
              </p>
              <p>
                By continuing to use our application, you acknowledge that you
                have read and understood these Terms and Conditions and agree to
                be bound by them.
              </p>
            </div>
          </motion.div>

          {isLoaded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex justify-center"
            >
              <a
                href="#top"
                className="flex items-center gap-1 rounded-full bg-white p-2 text-xs text-gray-500 shadow-sm transition-all duration-300 hover:bg-gray-50 hover:shadow"
              >
                <ArrowDown className="h-3 w-3 rotate-180" />
                Back to top
              </a>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
