import React from 'react'

export const PostSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-20 sm:space-y-24 lg:space-y-32">
      <div className="grid gap-x-8 gap-y-8 pt-16 xl:flex xl:grid-cols-7 xl:justify-start xl:gap-x-24">
        {/* Left Column Skeleton (Image/Metadata) */}
        <div className="col-span-full xl:col-span-3 xl:flex xl:items-center xl:justify-between xl:gap-x-8">
          <div className="xl:flex xl:items-center xl:gap-x-6">
            <div className="relative min-h-64 xl:h-96 xl:w-80">
              <div className="absolute inset-0 overflow-hidden rounded-[40px] bg-neutral-300 dark:bg-neutral-700"></div>
            </div>
          </div>
        </div>

        {/* Right Column Skeleton (Title, Description, etc.) */}
        <div className="col-span-full xl:col-span-4 xl:max-w-2xl">
          <div className="mb-2 h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800"></div>
          <div className="prose mt-2">
            <div className="h-6 w-3/4 rounded bg-neutral-200 sm:h-8 dark:bg-neutral-800"></div>
          </div>
          <div className="mt-6 space-y-2 text-base">
            <div className="h-4 rounded bg-neutral-200 dark:bg-neutral-800"></div>
            <div className="h-4 rounded bg-neutral-200 dark:bg-neutral-800"></div>
            <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800"></div>
          </div>
          <div className="mt-8 h-10 w-32 rounded-full bg-neutral-200 dark:bg-neutral-800"></div>
        </div>
      </div>
    </div>
  )
}
