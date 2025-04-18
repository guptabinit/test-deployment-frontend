import { MenuItemSkeleton } from "./MenuItemSkeleton"

export const LoadingMenuItems = () => {
  return (
    <div className="p-4">
      <div className="bg-gray-50 p-3 mb-4 rounded-md">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MenuItemSkeleton />
        <MenuItemSkeleton />
        <MenuItemSkeleton />
        <MenuItemSkeleton />
        <MenuItemSkeleton />
        <MenuItemSkeleton />
        <MenuItemSkeleton />
        <MenuItemSkeleton />
        <MenuItemSkeleton />
      </div>
    </div>
  )
}

