"use client";

import { AnimatePresence, motion } from "framer-motion";
import { containerVariants } from "../../[hotelId]/_animation-constants/variants";
import DialCard from "./dial-card";
import NoFilteredDialer from "./no-filtered-dialer";
import DialerLoader from "./dialer-loader";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  isDialerLoaded: boolean;
  filteredDialList: any[];
  customization: any;
  fetchedServices: any[];
  activeServiceId: string;
  setActiveServiceId: (serviceId: string | "") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const ITEMS_PER_PAGE = 8;

const MainDialList = ({
  isDialerLoaded,
  filteredDialList,
  customization,
  fetchedServices,
  activeServiceId,
  setActiveServiceId,
  searchQuery,
  setSearchQuery,
}: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(filteredDialList.length / ITEMS_PER_PAGE);

  // Get current page items
  const currentItems = filteredDialList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: any[] = [];

    // Always show first page
    pages.push(1);

    // Add current page and surrounding pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (pages[pages.length - 1] !== i - 1) {
        // Add ellipsis if there's a gap
        pages.push(-1);
      }
      pages.push(i);
    }

    // Add last page if we have more than one page
    if (totalPages > 1) {
      if (pages[pages.length - 1] !== totalPages - 1) {
        // Add ellipsis if there's a gap
        pages.push(-1);
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <>
      {isDialerLoaded ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={`list-${searchQuery}-${activeServiceId}-${currentPage}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {filteredDialList.length > 0 ? (
              <>
                {currentItems.map((contact) => (
                  <DialCard
                    key={contact._id}
                    contact={contact}
                    customization={customization}
                    fetchedServices={fetchedServices}
                  />
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 mx-4">
                    <Pagination>
                      <PaginationContent>
                        {/* Previous button */}
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              currentPage > 1 &&
                              handlePageChange(currentPage - 1)
                            }
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>

                        {/* Page numbers */}
                        {getPageNumbers().map((page, index) =>
                          page === -1 ? (
                            <PaginationItem key={`ellipsis-${index}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : (
                            <PaginationItem key={`page-${page}`}>
                              <PaginationLink
                                isActive={page === currentPage}
                                onClick={() => handlePageChange(page)}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        )}

                        {/* Next button */}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              currentPage < totalPages &&
                              handlePageChange(currentPage + 1)
                            }
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <NoFilteredDialer
                customization={customization}
                setSearchQuery={setSearchQuery}
                setActiveServiceId={setActiveServiceId}
              />
            )}
          </motion.div>
        </AnimatePresence>
      ) : (
        <DialerLoader />
      )}
    </>
  );
};

export default MainDialList;
