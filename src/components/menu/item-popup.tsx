"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Item } from "@/types/menu/Items";
import { Customization } from "@/types/Customization";

interface FoodItemPopupProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
  customization: Customization | undefined;
}

export function FoodItemPopup({
  isOpen,
  onClose,
  item,
  customization,
}: FoodItemPopupProps) {
  const [selectedAddOnItems, setSelectedAddOnItems] = useState<any[]>([]);

  const handleAddOnSelect = (addOnItemId: string) => {
    setSelectedAddOnItems((prev) => {
      if (prev.includes(addOnItemId)) {
        return prev.filter((id) => id !== addOnItemId); // Deselect if already selected
        }
        else {
            return [...prev, addOnItemId]; // Select if not selected
            }
        }
    );
  };

  // Get tag colors based on index for variety
  const getTagColor = (index: number) => {
    const colors = [
      customization?.hotelColors?.secondary || "#FFA500",
      customization?.hotelColors?.tertiary || "#FF6347",
      "#FFD700",
    ];
    return colors[index % colors.length];
  };

  // Get tag text color based on background color
  const getTagTextColor = (bgColor: string) => {
    // Use customization text color or default to black
    return customization?.hotelColors?.textColor || "#000000";
  };

  console.log(item);
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden max-h-[90vh]">
        <div className="relative">
          <div className="relative h-48 w-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.itemImage}`}
              alt={item.itemName}
              fill
              className="object-cover rounded-3xl px-2 py-2"
            />
            <button
              onClick={onClose}
              className="absolute top-2 right-2 bg-white rounded-full p-1"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <ScrollArea className="max-h-[calc(90vh-192px)]">
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-semibold">{item.itemName}</h3>
                <div className="text-lg font-semibold">
                  ₹ {item.price}{" "}
                  <span className="text-sm text-gray-500">/plate</span>
                </div>
              </div>

              <div className="text-sm text-gray-500 mb-3">
                {item.calories && <span>Calories: {item.calories} kcal</span>}
                {item.calories && item.portionSize && <span> | </span>}
                {item.portionSize && (
                  <span>Serving Quantity: {item.portionSize}</span>
                )}
              </div>

              {item.itemDesc && (
                <div className="mb-4">
                  <p className="text-sm text-gray-700">Description:</p>
                  <p className="text-sm">{item.itemDesc}</p>
                </div>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.tags.map((tagName, index) => {
                    const tagColor = getTagColor(index);
                    const textColor = getTagTextColor(tagColor);

                    return (
                      <div
                        key={`${tagName}-${index}`}
                        className="rounded-full px-3 py-1 text-xs flex items-center justify-center"
                        style={{
                          backgroundColor: `${tagColor}20`, // 20% opacity
                          border: `1px solid ${tagColor}`,
                          color: textColor,
                        }}
                      >
                        {tagName}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add-ons */}
              {item.addons?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-center font-semibold mb-2">ADD-ONs</h4>

                  {item.addons.map(
                    (addon, index) => (
                      <div key={index} className="mb-4">
                        <h5 className="font-medium mb-1">
                          {addon.addonName}
                          {addon.type === "single-select"
                            ? "(Select any one)"
                            : "(Select multiple)"}
                        </h5>

                        {addon.applicableItems.map((item) => (
                          <div
                            key={item._id}
                            className="flex justify-between items-center py-2 border-b"
                          >
                            <div className="flex items-center">
                              <input
                                type={
                                  addon.type === "multi-select" ? "checkbox" : "radio"
                                }
                                id={item._id}
                                name={addon.type === "multi-select" ? "multi-select" : "single-select"}
                                checked={(
                                  selectedAddOnItems || []
                                ).includes(item._id)}
                                onChange={() =>
                                  handleAddOnSelect(item._id)
                                }
                                className="mr-2"
                              />
                              <label htmlFor={item.name} className="text-sm">
                                {item.name}
                              </label>
                            </div>
                            <div className="text-sm">
                              ₹{item.price}
                              <span className="text-xs text-gray-500">
                                /{item.pricePer}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              )}

              <div className="mt-6 flex justify-center">
                <Button
                  className="w-full"
                  style={{
                    backgroundColor:
                      customization?.hotelColors?.primary || "#4F46E5",
                    color: "#FFFFFF",
                  }}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
