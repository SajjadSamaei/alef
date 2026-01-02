import { clsx } from "clsx";
import AlefLogotype from "@/public/logos/alef/alef-logo.svg";

export function Logo({ className }: { className?: string }) {
  return <AlefLogotype className={clsx("w-16 text-black", className)} />;
}
