"use client";

import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/src/i18n/routing";
import React from "react";

export const Pagination: React.FC<{
  page: number;
  totalPages: number;
  // setPageAction: (page: number) => void
}> = (props) => {
  const { page, totalPages } = props;
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="my-12">
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={!hasPrevPage}
              onClick={
                hasPrevPage
                  ? () => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set("page", (page - 1).toString());
                      router.push(`${pathname}?${newParams.toString()}`);
                    }
                  : undefined
              }
            />
          </PaginationItem>
          {/* Page Links */}
          <PaginationItem>
            <PaginationLink
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set("page", page.toString());
                router.push(`${pathname}?${newParams.toString()}`);
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
          {hasNextPage && (
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set("page", (page + 1).toString());
                  router.push(`${pathname}?${newParams.toString()}`);
                }}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              aria-disabled={!hasNextPage}
              onClick={
                hasNextPage
                  ? () => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set("page", (page + 1).toString());
                      router.push(`${pathname}?${newParams.toString()}`);
                    }
                  : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  );
};
