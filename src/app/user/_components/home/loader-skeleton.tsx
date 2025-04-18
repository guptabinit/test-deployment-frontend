import React from "react";

function LoaderSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse"
        >
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoaderSkeleton;
