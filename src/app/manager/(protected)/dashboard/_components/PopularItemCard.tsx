import { formatCurrency } from "../_lib/format-currency";

export interface MenuItem {
  id: number;
  name: string;
  emoji: string;
  orders: number;
  price: number;
}

interface PopularMenuItemsProps {
  items: MenuItem[];
}

export default function PopularMenuItems({ items }: PopularMenuItemsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-800">Popular Menu Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded-md p-4 flex items-center gap-4"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
              <span className="text-2xl">{item.emoji}</span>
            </div>
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-500">
                {item.orders} orders today
              </p>
              <p className="text-sm font-medium">
                {formatCurrency(item.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
