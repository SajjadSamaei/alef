"use client";
import { Field } from "@/components/ui/catalyst/fieldset";
import { Button } from "@/components/ui/catalyst/button";
import { Text } from "@/components/ui/catalyst/text";
import { toIndiaDigits } from "@/utils/helpers/strings-numbers";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export const TablePagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  itemName,
}) => {
  if (!totalItems) return null;

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startRecord = (currentPage - 1) * itemsPerPage + 1;
  const endRecord = Math.min(startRecord + itemsPerPage - 1, totalItems);

  const displayText = `${startRecord} الی ${endRecord} از ${totalItems} ${itemName}`;

  return (
    <Field className="mt-4 flex items-center justify-center gap-4" dir="ltr">
      <Button
        plain
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeftIcon />
      </Button>
      <Text dir="rtl">{toIndiaDigits(displayText)}</Text>
      <Button
        plain
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRightIcon />
      </Button>
    </Field>
  );
};
