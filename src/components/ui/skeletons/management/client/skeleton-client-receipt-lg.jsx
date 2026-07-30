export function SkeletonClientReceiptLarge() {
  return (
    <>
      <div className="mb-8 lg:mb-4">
        <div className="flex-col gap-2 rounded-xl bg-[#eaf1fb] p-3 px-4 py-6 shadow-md drop-shadow-xs dark:bg-white/5 dark:shadow-none dark:drop-shadow-none">
          <div className="mt-3 h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          <div className="mt-3 h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          <div className="mt-3 h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
        </div>
      </div>
      <div className="mb-8 lg:col-span-1 lg:mb-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="mr-2 font-medium text-zinc-900 dark:text-zinc-50">
            توضیحات
          </p>
        </div>
        <div className="flex-col rounded-xl bg-[#eaf1fb] p-3 px-4 py-6 shadow-md ring-1 ring-zinc-950/5 drop-shadow-xs dark:border-2 dark:border-zinc-800 dark:bg-white/5 dark:shadow-none dark:drop-shadow-none">
          <div className="mt-3 h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
        </div>
      </div>
      <div className="mb-8 lg:mb-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="mr-2 font-medium text-zinc-900 dark:text-zinc-50">
            تصاویر رسید
          </p>
        </div>
        <div className="flex-col rounded-xl bg-[#eaf1fb] px-2 shadow-md ring-1 ring-zinc-950/5 drop-shadow-xs dark:bg-transparent dark:shadow-none dark:ring-transparent dark:drop-shadow-none">
          <div className="mt-3 h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
        </div>
      </div>
    </>
  );
}
