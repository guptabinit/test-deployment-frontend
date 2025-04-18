import React from "react";

function AboutLoader() {
  return (
    <div className="space-y-6">
      {/* Hero Image Skeleton */}
      <div className="h-64 w-full animate-pulse rounded-xl bg-gray-200" />

      {/* Contact Info Skeleton */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-4 h-6 w-1/3 animate-pulse rounded bg-gray-200" />
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
              <div className="flex-1">
                <div className="mb-1 h-4 w-1/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Us Skeleton */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-4 h-6 w-1/3 animate-pulse rounded bg-gray-200" />
        <div className="mb-3 h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="mb-3 h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="mb-3 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

export default AboutLoader;
