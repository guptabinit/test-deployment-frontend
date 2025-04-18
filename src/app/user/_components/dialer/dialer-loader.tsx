import React from "react";

function DialerLoader() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4"
        >
          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
          <div className="flex-1">
            <div className="mb-2 flex items-center justify-between">
              <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200"></div>
              <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200"></div>
            </div>
            <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DialerLoader;
