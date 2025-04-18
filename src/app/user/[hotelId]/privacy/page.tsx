"use client";

import { useState, useEffect, useRef } from "react";
import { Sidebar } from "../../_components/sidebar";
import { Footer } from "../../_components/footer";
import {
  ChevronUp,
  Shield,
  Lock,
  Eye,
  Server,
  UserCheck,
  RefreshCw,
  Mail,
} from "lucide-react";
import { useParams } from "next/navigation";
import { Header } from "../../_components/header";
import PrivacySidebar from "../../_components/privacy/privacy-sidebar";
import PrivacyNavbar from "../../_components/privacy/privacy-navbar";
import MainSection from "../../_components/privacy/main-section";
import { useHotelDataStore } from "@/stores/user/hotelDataStore";

// Privacy policy sections
const policySections = [
  {
    id: "introduction",
    title: "Introduction",
    icon: Shield,
    content:
      "At Minimalist Hotels, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our digital menu application.",
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    icon: Eye,
    content:
      "We may collect personal information such as your name, email address, room number, and preferences when you use our application to place orders, make reservations, or provide feedback.",
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    icon: Server,
    content:
      "We use the information we collect to process and fulfill your orders and requests, improve our services and user experience, communicate with you about your orders or inquiries, and personalize your experience with our application.",
    list: [
      "Process and fulfill your orders and requests",
      "Improve our services and user experience",
      "Communicate with you about your orders or inquiries",
      "Personalize your experience with our application",
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    icon: Lock,
    content:
      "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.",
  },
  {
    id: "third-party",
    title: "Third-Party Services",
    icon: UserCheck,
    content:
      "We may use third-party services to process payments, analyze usage data, or provide other functionalities. These third parties have access to your personal information only to perform specific tasks on our behalf.",
  },
  {
    id: "your-rights",
    title: "Your Rights",
    icon: UserCheck,
    content:
      "You have the right to access, correct, or delete your personal information. If you wish to exercise these rights, please contact our front desk or email us at privacy@minimalisthotels.com.",
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    icon: RefreshCw,
    content:
      "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.",
  },
  {
    id: "contact",
    title: "Contact Us",
    icon: Mail,
    content:
      "If you have any questions about this Privacy Policy, please contact us at privacy@minimalisthotels.com.",
  },
];

export default function PrivacyPage() {
  const { hotelId } = useParams();

  const sectionRefs = useRef<any>({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { customization, isCustomizationLoaded } = useHotelDataStore();

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
        <PrivacyNavbar hotelId={hotelId as string} />

        <div className="container mx-auto max-w-4xl px-4 py-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Sidebar */}
            <PrivacySidebar
              sectionRefs={sectionRefs}
              setShowScrollTop={setShowScrollTop}
              policySections={policySections}
            />

            {/* Main Content */}
            <MainSection
              hotelId={hotelId as string}
              policySections={policySections}
              sectionRefs={sectionRefs}
            />
          </div>
        </div>

        {/* Scroll to top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#8B5A2B] text-white shadow-lg transition-all duration-300 print:hidden ${
            showScrollTop ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      </main>

      <Footer />

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          main,
          main * {
            visibility: visible;
          }
          main {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
