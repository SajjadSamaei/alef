// src/payload/components/Pagination.tsx
"use client";

import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/payload/components/ui/pagination";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import React from "react";

export const Pagination: React.FC<{
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}> = (props) => {
  const { page, totalPages, setPage } = props;
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const buildUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="my-12">
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={!hasPrevPage}
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set("page", (page - 1).toString());
                router.push(`${pathname}?${newParams.toString()}`);
              }}
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
              disabled={!hasNextPage}
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set("page", (page + 1).toString());
                router.push(`${pathname}?${newParams.toString()}`);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  );
};
