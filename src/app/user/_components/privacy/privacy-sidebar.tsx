import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FileText, Printer } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  sectionRefs: any;
  setShowScrollTop: any;
  policySections: any;
};

const PrivacySidebar = ({
  sectionRefs,
  setShowScrollTop,
  policySections,
}: Props) => {
  const [activeSection, setActiveSection] = useState("");

  // Scroll to section
  const scrollToSection = (id: string) => {
    const section = sectionRefs.current[id];
    if (section) {
      const yOffset = -80; // Account for header
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Show/hide scroll to top button
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // Update active section based on scroll position
      const scrollPosition = window.scrollY + 100;

      for (const id of Object.keys(sectionRefs.current)) {
        const section = sectionRefs.current[id];
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Print the policy
  const handlePrint = () => {
    window.print();
  };
  return (
    <>
      {/* Sidebar - Table of Contents */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-1 print:hidden"
      >
        <div className="sticky top-28 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
            <FileText className="h-4 w-4 text-[#8B5A2B]" />
            <h2 className="text-sm font-medium">Table of Contents</h2>
          </div>

          <nav className="space-y-1">
            {policySections.map((section) => (
              <Button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                variant="ghost"
                className={cn(
                  "h-auto w-full justify-start rounded-lg px-3 py-2 text-left text-xs",
                  activeSection === section.id
                    ? "bg-[#FFF2E6] font-medium text-[#8B5A2B] hover:bg-[#FFF2E6] hover:text-[#8B5A2B]"
                    : "text-gray-600 hover:bg-[#FFF2E6] hover:text-[#8B5A2B]"
                )}
              >
                {section.title}
              </Button>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="flex h-auto items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-700"
            >
              <Printer className="h-3 w-3" />
              Print Policy
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default PrivacySidebar;
