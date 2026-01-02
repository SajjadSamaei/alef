import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/catalyst/table";

export function SkeletonAdminUsersTable() {
  return (
    <TableBody>
      <TableRow>
        <TableCell className="text-center">
          <div className="h-8 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
        </TableCell>
        <TableCell className="text-center">
          <div className="h-8 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
        </TableCell>
        <TableCell className="justify-center text-center">
          <div className="h-8 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
        </TableCell>
        <TableCell className="text-center">
          <div className="h-8 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
        </TableCell>
        <TableCell className="text-center">
          <div className="h-8 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
        </TableCell>
        <TableCell className="text-center">
          <div className="h-8 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
