// DatePickerWithRange.tsx

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps {
  className?: string;
  onDateChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

export function DatePickerWithRange({
  className,
  onDateChange,
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  React.useEffect(() => {
    if (date?.from && date?.to) {
      onDateChange(date.from, date.to); // Update start and end dates when selected
    } else {
      onDateChange(undefined, undefined); // Reset if no date selected
    }
  }, [date, onDateChange]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal rounded-xl p-3 border border-gray-300",
              !date?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span className="text-base">Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 max-w-[90vw] overflow-auto min-h-[350px] h-auto"
          align="start"
        >
          <Calendar
            initialFocus
            mode="range"
            selected={date}
            onSelect={setDate}
            defaultMonth={new Date()}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
