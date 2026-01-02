import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/catalyst/table";

export function SkeletonStatTable() {
  return (
    <Table
      striped
      className="p-2 [--gutter:--spacing(6)] sm:[--gutter:--spacing(8)]"
      dir="rtl"
      dense
    >
      <TableHead>
        <TableRow>
          <TableHeader className="hidden cursor-pointer text-center lg:block">
            شماره رسید
          </TableHeader>
          <TableHeader className="cursor-pointer text-center">
            فرستنده
          </TableHeader>
          <TableHeader className="cursor-pointer text-center">
            تاریخ رسید
          </TableHeader>
          <TableHeader className="hidden cursor-pointer text-center lg:block">
            نوع رسید
          </TableHeader>
          <TableHeader className="cursor-pointer text-center">
            هزینه
          </TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell className="hidden text-center lg:block">
            <div className="h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          </TableCell>
          <TableCell className="text-center">
            <div className="h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          </TableCell>
          <TableCell className="text-center">
            <div className="h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          </TableCell>
          <TableCell className="hidden text-center lg:block">
            <div className="h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          </TableCell>
          <TableCell className="text-center">
            <div className="h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="hidden text-center lg:block">
            <div className="h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          </TableCell>
          <TableCell className="text-center">
            <div className="h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          </TableCell>
          <TableCell className="text-center">
            <div className="h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          </TableCell>
          <TableCell className="hidden text-center lg:block">
            <div className="h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          </TableCell>
          <TableCell className="text-center">
            <div className="h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="hidden text-center lg:block">
            <div className="h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          </TableCell>
          <TableCell className="text-center">
            <div className="h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          </TableCell>
          <TableCell className="text-center">
            <div className="h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          </TableCell>
          <TableCell className="hidden text-center lg:block">
            <div className="h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          </TableCell>
          <TableCell className="text-center">
            <div className="h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="hidden text-center lg:block">
            <div className="h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          </TableCell>
          <TableCell className="text-center">
            <div className="h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          </TableCell>
          <TableCell className="text-center">
            <div className="h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          </TableCell>
          <TableCell className="hidden text-center lg:block">
            <div className="h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          </TableCell>
          <TableCell className="text-center">
            <div className="h-3 animate-pulse rounded-xs bg-[#d3e3fd] dark:bg-zinc-600"></div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
