import * as React from "react";
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
  onDateChange: (startDate: string | undefined, endDate: string | undefined) => void;
}

export function DatePickerWithRange({
  className,
  onDateChange,
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (date?.from && date?.to) {
      onDateChange(date.from.toISOString(), date.to.toISOString());
    } else {
      onDateChange(undefined, undefined);
    }
  }, [date, onDateChange]);

  const handleSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    if (selectedDate?.from && selectedDate?.to) {
      setIsOpen(false); // Close the popover when both dates are selected
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal rounded-xl p-6 border border-gray-300",
              !date?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {date.from.toISOString().split("T")[0]} - {date.to.toISOString().split("T")[0]}
                </>
              ) : (
                date.from.toISOString().split("T")[0]
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
            onSelect={handleSelect}
            defaultMonth={new Date()}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
