// "use client";
// import { useState } from "react";
// import { motion } from "framer-motion";
// import type { Item } from "@/types/menu/Items";
// import type { Customization } from "@/types/Customization";

// interface MenuItemProps {
//   item: Item;
//   index: number;
//   customization: Customization;
// }

// export function MenuItem({ item, index, customization }: MenuItemProps) {
//   const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

//   // Function to determine veg/non-veg icon color
//   const getVegNonVegColor = (): string | undefined => {
//     if (!item.isFood || !item.vegNonVeg) return undefined;

//     switch (item.vegNonVeg) {
//       case "Veg":
//         return "#008000"; // Green for veg
//       case "Non-Veg":
//         return "#FF0000"; // Red for non-veg
//       case "Egg":
//         return "#FF0000"; // Red for egg
//       default:
//         return undefined;
//     }
//   };

//   const vegNonVegColor = getVegNonVegColor();

//   const toggleDescription = () => {
//     setIsDescriptionExpanded(!isDescriptionExpanded);
//   };

//   return (
//     <motion.div
//       className="rounded-lg shadow-sm overflow-hidden border"
//       style={{
//         backgroundColor: "white",
//         borderColor: `${customization.hotelColors?.secondary}30`,
//       }}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3, delay: index * 0.05 }}
//     >
//       <div className="flex p-3 gap-3">
//         {item.itemImage && (
//           <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
//             <img
//               src={item.itemImage || "/placeholder.svg"}
//               alt={item.itemName}
//               width={80}
//               height={80}
//               className="w-full h-full object-cover"
//             />
//           </div>
//         )}
//         <div className="flex-1 min-w-0">
//           <div className="flex justify-between items-start">
//             <div className="flex items-center gap-1">
//               {item.isFood && item.vegNonVeg && vegNonVegColor && (
//                 <div
//                   className="flex-shrink-0 w-4 h-4 border border-current rounded-sm flex items-center justify-center"
//                   style={{ color: vegNonVegColor }}
//                 >
//                   <div className="w-2 h-2 rounded-full bg-current"></div>
//                 </div>
//               )}
//               <h3
//                 className="font-medium"
//                 style={{ color: customization.hotelColors?.textColor }}
//               >
//                 {item.itemName}
//               </h3>
//             </div>
//           </div>
//           <p
//             className={`text-sm mt-1 pr-16 ${
//               isDescriptionExpanded ? "" : "line-clamp-2"
//             } cursor-pointer`}
//             style={{ color: `${customization.hotelColors?.textColor}90` }}
//             onClick={toggleDescription}
//           >
//             {item.itemDesc}
//           </p>

//           <div className="flex items-center mt-2 gap-2">
//             <span
//               className="font-semibold"
//               style={{ color: customization.hotelColors?.primary }}
//             >
//               ₹{item.price}
//             </span>
//             {item.pricePer && (
//               <span
//                 className="text-xs"
//                 style={{ color: `${customization.hotelColors?.textColor}80` }}
//               >
//                 / {item.pricePer}
//               </span>
//             )}
//             {item.isFood && item.calories && item.portionSize && (
//               <>
//                 <span
//                   className="text-xs mx-1"
//                   style={{ color: `${customization.hotelColors?.textColor}80` }}
//                 >
//                   •
//                 </span>
//                 <span
//                   className="text-xs"
//                   style={{ color: `${customization.hotelColors?.textColor}80` }}
//                 >
//                   {item.calories} Kcal
//                 </span>
//                 <span
//                   className="text-xs mx-1"
//                   style={{ color: `${customization.hotelColors?.textColor}80` }}
//                 >
//                   •
//                 </span>
//                 <span
//                   className="text-xs"
//                   style={{ color: `${customization.hotelColors?.textColor}80` }}
//                 >
//                   {item.portionSize} g
//                 </span>
//               </>
//             )}
//           </div>

//           <div className="flex flex-wrap gap-2 mt-2">
//             {item.tags.map((tag) => (
//               <div
//                 key={tag}
//                 className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
//                 style={{
//                   backgroundColor: `${customization.hotelColors?.tertiary}15`,
//                   color: customization.hotelColors?.tertiary,
//                 }}
//               >
//                 <span
//                   className="w-1.5 h-1.5 rounded-full"
//                   style={{
//                     backgroundColor: customization.hotelColors?.tertiary,
//                   }}
//                 ></span>
//                 {tag}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Item } from "@/types/menu/Items";
import type { Customization } from "@/types/Customization";

interface MenuItemProps {
  item: Item;
  index: number;
  customization: Customization | undefined;
  onSelectItem: (item: Item) => void;
  onOpenPopup: () => void;
}

export function MenuItem({
  item,
  index,
  customization,
  onSelectItem,
  onOpenPopup,
}: MenuItemProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Function to determine veg/non-veg icon color
  const getVegNonVegColor = (): string | undefined => {
    if (!item.isFood || !item.vegNonVeg) return undefined;

    switch (item.vegNonVeg) {
      case "Veg":
        return "#008000"; // Green for veg
      case "Non-Veg":
        return "#FF0000"; // Red for non-veg
      case "Egg":
        return "#FF0000"; // Red for egg
      default:
        return undefined;
    }
  };

  const vegNonVegColor = getVegNonVegColor();

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  return (
    <motion.div
      className="rounded-lg shadow-sm overflow-hidden border"
      style={{
        backgroundColor: "white",
        borderColor: `${customization?.hotelColors?.secondary}30`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div
        className="flex p-3 gap-2 sm:gap-3"
        onClick={() => {
          onOpenPopup();
          onSelectItem(item);
        }}
      >
        {item.itemImage && (
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-md overflow-hidden">
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.itemImage}`}
              alt={item.itemName}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1 max-w-[70%]">
              {item.isFood && item.vegNonVeg && vegNonVegColor && (
                <div
                  className="flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4 border border-current rounded-sm flex items-center justify-center"
                  style={{ color: vegNonVegColor }}
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current"></div>
                </div>
              )}
              <h3
                className="font-medium text-sm sm:text-base truncate"
                style={{ color: customization?.hotelColors?.textColor }}
              >
                {item.itemName}
              </h3>
            </div>
          </div>
          <p
            className={`text-xs sm:text-sm mt-1 pr-2 ${
              isDescriptionExpanded ? "" : "line-clamp-2"
            } cursor-pointer`}
            style={{ color: `${customization?.hotelColors?.textColor}90` }}
            onClick={toggleDescription}
          >
            {item.itemDesc}
          </p>

          <div className="flex items-center mt-1 sm:mt-2 gap-1 sm:gap-2 text-xs flex-wrap">
            <div className="text-right">
              <span
                className="font-semibold text-sm sm:text-base"
                style={{ color: customization?.hotelColors?.primary }}
              >
                ₹{item.price}
              </span>
            </div>
            {item.pricePer && (
              <span
                className="text-xs"
                style={{ color: `${customization?.hotelColors?.textColor}80` }}
              >
                / {item.pricePer}
              </span>
            )}
            {item.isFood && item.calories && item.portionSize && (
              <>
                <span
                  className="text-xs mx-0.5 sm:mx-1"
                  style={{
                    color: `${customization?.hotelColors?.textColor}80`,
                  }}
                >
                  •
                </span>
                <span
                  className="text-xs"
                  style={{
                    color: `${customization?.hotelColors?.textColor}80`,
                  }}
                >
                  {item.calories} Kcal
                </span>
                <span
                  className="text-xs mx-0.5 sm:mx-1"
                  style={{
                    color: `${customization?.hotelColors?.textColor}80`,
                  }}
                >
                  •
                </span>
                <span
                  className="text-xs"
                  style={{
                    color: `${customization?.hotelColors?.textColor}80`,
                  }}
                >
                  {item.portionSize} g
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
            {item.tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${customization?.hotelColors?.tertiary}15`,
                  color: customization?.hotelColors?.tertiary,
                }}
              >
                <span
                  className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full"
                  style={{
                    backgroundColor: customization?.hotelColors?.tertiary,
                  }}
                ></span>
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
