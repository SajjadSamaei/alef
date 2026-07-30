export function StatsSkeletonSM() {
  return (
    <li className="rounded-xl bg-[#eaf1fb] px-4 py-2 shadow-md drop-shadow-xs dark:bg-white/5  dark:shadow-none  dark:drop-shadow-none ">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 col-start-1 h-2 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
        <div className="col-span-3 col-start-1 h-4 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
        <div className="col-span-2 col-start-1 h-2 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
      </div>
    </li>
  );
}
