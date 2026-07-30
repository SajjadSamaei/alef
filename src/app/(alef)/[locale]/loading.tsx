import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="min-h-[80vh] w-full">
      <div className="fixed right-6 bottom-6 z-50">
        <Spinner className="size-8" />
      </div>
    </div>
  );
}
