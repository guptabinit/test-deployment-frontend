import React from "react";

function PdfLoader() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-white p-4"
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200"></div>
            <div className="flex-1">
              <div className="mb-2 h-5 w-2/3 animate-pulse rounded bg-gray-200"></div>
              <div className="mb-3 h-4 w-full animate-pulse rounded bg-gray-200"></div>
              <div className="h-8 w-32 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PdfLoader;
