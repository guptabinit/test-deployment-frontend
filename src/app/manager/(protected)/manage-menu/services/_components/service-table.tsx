"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "../../_lib/format-date"
import { Pen, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import TableLoader from "../../_components/table-loader"
import Pagination from "../../_components/pagination"
import { useMediaQuery } from "./hooks/use-media-query"

export interface Service {
  _id: string
  serviceName: string
  serviceDesc?: string
  isFood: boolean
  isActive: boolean
  updatedAt: string
  serviceImage?: string
}

interface ServiceTableProps {
  isLoading: boolean
  services: Service[]
  toggleActive: (id: string) => void
  onManageService: (serviceName: string) => void
  onDeleteService: (serviceName: string) => void
  // Pagination props
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

const serviceTableHeaders = [
  { id: "active", title: "Active" },
  { id: "image", title: "Image" },
  { id: "serviceName", title: "Service Name" },
  { id: "description", title: "Description" },
  { id: "isFood", title: "Is Food" },
  { id: "lastUpdated", title: "Last Updated" },
  { id: "action", title: "Action" },
]

export default function ServiceTable({
  isLoading,
  services,
  toggleActive,
  onManageService,
  onDeleteService,
  currentPage,
  itemsPerPage,
  onPageChange,
}: ServiceTableProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (isLoading) {
    return <TableLoader />
  }

  // Calculate pagination values
  const totalItems = services.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Get current page items
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = services.slice(startIndex, endIndex)

  return (
    <div className="w-full">
      {isMobile ? (
        <MobileServiceList
          services={currentItems}
          toggleActive={toggleActive}
          onManageService={onManageService}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          totalItems={totalItems}
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {serviceTableHeaders.map((header) => (
                    <TableHead key={header.id} className="px-4 py-2 text-xs font-medium text-gray-500">
                      {header.title}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={serviceTableHeaders.length} className="h-24 text-center text-sm text-gray-500">
                      No services found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((service) => (
                    <TableRow key={service._id} className="hover:bg-gray-50">
                      <TableCell className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={service.isActive}
                          onChange={() => toggleActive(service._id)}
                          className="h-4 w-4 cursor-pointer rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={
                            service.serviceImage
                              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${service.serviceImage}`
                              : "/placeholder.svg"
                          }
                          alt={service.serviceName}
                        />
                      </TableCell>
                      <TableCell className="px-4 py-2 text-sm font-medium">{service.serviceName}</TableCell>
                      <TableCell className="px-4 py-2 text-sm text-gray-600">{service.serviceDesc || "N/A"}</TableCell>
                      <TableCell className="px-4 py-2 text-sm">{service.isFood ? "Yes" : "No"}</TableCell>
                      <TableCell className="px-4 py-2 text-xs text-gray-500">{formatDate(service.updatedAt)}</TableCell>
                      <TableCell className="px-4 py-2 text-center">
                        <div className="flex justify-center space-x-1">
                          <button
                            onClick={() => onManageService(service._id)}
                            className="rounded bg-gray-900 p-1.5 hover:bg-gray-800"
                            aria-label={`Edit ${service.serviceName}`}
                          >
                            <Pen className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalItems > 0 && (
            <div className="mt-4">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
          )}
        </>
      )}
    </div>
  )
}

interface MobileServiceListProps {
  services: Service[]
  toggleActive: (id: string) => void
  onManageService: (serviceId: string) => void
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  totalItems: number
}

function MobileServiceList({
  services,
  toggleActive,
  onManageService,
  currentPage,
  itemsPerPage,
  onPageChange,
  totalItems,
}: MobileServiceListProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const endIndex = currentPage * itemsPerPage

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <div key={service._id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{service.serviceName}</h3>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onManageService(service._id)}>
                <Pen className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <div className="flex items-center">
                <span className="text-sm mr-2">Available:</span>
                <input
                  type="checkbox"
                  checked={service.isActive}
                  onChange={() => toggleActive(service._id)}
                  className="h-4 w-4 cursor-pointer rounded border-gray-300"
                />
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-start space-x-4">
            {service.serviceImage && (
              <img
                src={
                  `${process.env.NEXT_PUBLIC_BACKEND_URL || "/placeholder.svg"}${service.serviceImage}` ||
                  "/placeholder.svg"
                }
                alt={service.serviceName}
                width={80}
                height={80}
                className="rounded-md object-cover h-20 w-20"
              />
            )}
            <div>
              <p className="text-sm text-gray-500">{service.serviceDesc || "No description available"}</p>
              <p className="mt-1 text-xs text-gray-400">Last updated: {formatDate(service.updatedAt)}</p>
              <p className="mt-1 text-xs">Type: {service.isFood ? "Food Service" : "Non-Food Service"}</p>
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between mt-4">
        <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={endIndex >= totalItems}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

