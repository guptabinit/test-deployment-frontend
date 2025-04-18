import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 px-4 py-4 text-center text-xs text-gray-500">
      <p className="mb-2">
        Please inform our associates if you are allergic to any ingredient.
      </p>
      <p className="mb-2">
        "An average active adult requires 2,000 kcal energy per day, however,
        calorie needs may vary."
      </p>
      <p className="mb-4">
        All prices are in INR & subject to GST and any other tax.
      </p>

      <div className="mb-2">App Version: v1.0.0</div>
      <div className="flex flex-col items-center justify-center gap-1">
        <p>Powered by</p>
        <Image
          src="/QG_black.png"
          alt="Quickgick"
          width={100}
          height={25}
          className="h-auto"
        />
      </div>
    </footer>
  );
}
