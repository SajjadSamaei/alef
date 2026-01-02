import { useEffect, useState, useCallback } from "react";
import { Field, FieldGroup, Fieldset } from "@/components/ui/catalyst/fieldset";
import {
  Listbox,
  ListboxOption,
  ListboxLabel,
} from "@/components/ui/catalyst/listbox";
import { datePickerData } from "@/utils/helpers/date-time";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { Notification } from "@/components/ui/notification";

export const DatePickerListbox = ({
  day,
  setDay,
  month,
  setMonth,
  year,
  setYear,
}) => {
  const [selectedMonthMaxDay, setSelectedMonthMaxDay] = useState(null);

  const getDaysByIndex = useCallback(
    (index) => {
      if (index >= 0 && index < datePickerData.length) {
        return datePickerData[index].days;
      } else {
        // Return a default value or handle error
        return []; // Default to an empty array if the index is invalid
      }
    },
    [], // Ensure datePickerData is a stable dependency
  );
  function createDayOptions(maxValue) {
    const options = [];
    for (let i = 1; i <= maxValue; i++) {
      options.push(
        <ListboxOption key={i} value={i}>
          <ListboxLabel>{digitsEnToFa(i)}</ListboxLabel>
        </ListboxOption>,
      );
    }
    return options;
  }

  useEffect(() => {
    setSelectedMonthMaxDay(getDaysByIndex(month - 1));
  }, [month, getDaysByIndex]);

  return (
    <FieldGroup>
      <Fieldset className="flex gap-2 align-middle">
        <Field>
          <Listbox name="day" value={day} placeholder="روز" onChange={setDay}>
            {createDayOptions(selectedMonthMaxDay)}
          </Listbox>
        </Field>
        <Field>
          <Listbox
            placeholder="ماه"
            name="month"
            value={month}
            onChange={setMonth}
          >
            {datePickerData.map((items) => (
              <ListboxOption key={items.monthNumber} value={items.monthNumber}>
                <ListboxLabel>{items.monthName}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>
        </Field>
        <Field>
          <Listbox
            name="year"
            placeholder="سال"
            value={year}
            onChange={setYear}
          >
            <ListboxOption value={year}>
              <ListboxLabel>{digitsEnToFa(Number(year))}</ListboxLabel>
            </ListboxOption>
            <ListboxOption value={Number(year) - 1}>
              <ListboxLabel>{digitsEnToFa(Number(year) - 1)}</ListboxLabel>
            </ListboxOption>
          </Listbox>
        </Field>
      </Fieldset>
    </FieldGroup>
  );
};
