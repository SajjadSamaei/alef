'use client'
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { usePortfolioFilterContext } from '@/components/Portfolio/UI/Archive/Filters/FilterProvider'
import { useFormatter } from 'next-intl'

export const Pagination = () => {
  const format = useFormatter()
  const { currentPage, totalPages, setCurrentPage } = usePortfolioFilterContext()
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  // Function to determine if a button should be rendered
  const renderPaginationItem = (pageNumber: number): React.ReactNode => {
    return (
      <PaginationItem key={pageNumber}>
        <PaginationLink
          onClick={() => setCurrentPage(pageNumber)}
          isActive={pageNumber === currentPage}
        >
          {format.number(pageNumber)}
        </PaginationLink>
      </PaginationItem>
    )
  }

  return (
    <div className="my-12">
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              isActive={!hasPrevPage}
              onClick={() => hasPrevPage && setCurrentPage(currentPage - 1)}
            />
          </PaginationItem>

          {/* Always show the first page button */}
          {renderPaginationItem(1)}

          {/* Render ellipsis if current page is far from the start */}
          {currentPage > 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Render current page if it's not the first one */}
          {currentPage > 1 && currentPage <= totalPages && renderPaginationItem(currentPage)}

          {/* Render next page if it exists */}
          {currentPage < totalPages && renderPaginationItem(currentPage + 1)}

          {/* Render ellipsis if current page is far from the end */}
          {totalPages > currentPage + 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              isActive={!hasNextPage}
              onClick={() => hasNextPage && setCurrentPage(currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
