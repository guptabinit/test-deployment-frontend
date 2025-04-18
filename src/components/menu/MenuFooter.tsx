export function MenuFooter() {
  return (
    <div className="px-4 py-6 text-xs text-gray-500 text-center border-t bg-white">
      <p>Please inform our associates if you are allergic to any ingredient.</p>
      <p className="mt-1">
        "An average active adult requires 2,000 kcal energy per day, however, calorie needs may vary."
      </p>
      <p className="mt-1">All prices are in INR & subject to GST and any other tax.</p>
      <div className="mt-4">
        <p>App Version: v1.0.0</p>
        <p className="mt-1 flex items-center justify-center">
          Powered by
          <span className="font-medium text-amber-800 ml-1">BiteCart</span>
        </p>
      </div>
    </div>
  )
}
