export function HeroSkeleton() {
  return (
    <div className="w-full">
      <div className="-mt-4 flex flex-col overflow-hidden">
        <div className="bg-appletextgray max-h-4/5 w-full animate-pulse overflow-hidden rounded-[40px] sm:max-h-[20rem] md:max-h-4/5 xl:max-h-[32rem]" />
      </div>
    </div>
  );
}
