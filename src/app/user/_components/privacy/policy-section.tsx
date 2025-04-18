import { motion } from "framer-motion";
import { itemVariants } from "../../[hotelId]/_animation-constants/variants";

type Props = {
  policySections: any;
  sectionRefs: any;
}

const PolicySection = ({ policySections, sectionRefs }: Props) => {
  return (
    <motion.div
                variants={itemVariants}
                className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-6 border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Privacy Policy
                  </h2>
                  <p className="text-sm text-gray-500">Minimalist Hotels</p>
                  <p className="mt-2 text-xs text-gray-500">
                    Last updated: March 3, 2023
                  </p>
                </div>

                <div className="space-y-8">
                  {policySections.map((section) => (
                    <div
                      key={section.id}
                      id={section.id}
                      // ref={(el) => (sectionRefs.current[section.id] = el)}
                      className="scroll-mt-24"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF2E6] text-[#8B5A2B]">
                          <section.icon className="h-4 w-4" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800">
                          {section.title}
                        </h3>
                      </div>

                      <div className="prose prose-sm max-w-none text-gray-600">
                        <p>{section.content}</p>

                        {section.list && (
                          <ul className="mt-2 list-inside list-disc space-y-1">
                            {section.list.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
  )
}

export default PolicySection;