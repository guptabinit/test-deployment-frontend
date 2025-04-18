export function MenuItemSkeleton() {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
        <div className="flex p-4 gap-3">
          <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-200"></div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="flex flex-col items-end">
                <div className="h-5 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-24 mt-1"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="h-3 bg-gray-200 rounded w-12"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  