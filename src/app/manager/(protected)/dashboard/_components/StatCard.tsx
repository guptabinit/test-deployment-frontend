function StatCard({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}) {
  const isPositive = change.startsWith("+");
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-md bg-gray-50">{icon}</div>
      </div>
      <div className="mt-4">
        <span
          className={`text-xs font-medium ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {change}
        </span>
        <span className="text-xs text-gray-500 ml-1">vs yesterday</span>
      </div>
    </div>
  );
}

export default StatCard;