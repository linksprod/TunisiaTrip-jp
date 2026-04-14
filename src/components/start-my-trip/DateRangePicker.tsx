import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface DateRangePickerProps {
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  setCheckInDate: (date: Date | undefined) => void;
  setCheckOutDate: (date: Date | undefined) => void;
  onDaysChange: (days: number) => void;
}

export function DateRangePicker({
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
  onDaysChange
}: DateRangePickerProps) {
  const { currentLanguage } = useTranslation();

  const handleCheckInSelect = (date: Date | undefined) => {
    setCheckInDate(date);
    if (date && checkOutDate && date >= checkOutDate) {
      setCheckOutDate(undefined);
    }
    updateDays(date, checkOutDate);
  };

  const handleCheckOutSelect = (date: Date | undefined) => {
    setCheckOutDate(date);
    updateDays(checkInDate, date);
  };

  const updateDays = (start: Date | undefined, end: Date | undefined) => {
    if (start && end) {
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        onDaysChange(diffDays);
      }
    }
  };

  return (
    <div className="w-full space-y-4 bg-card p-5 rounded-lg border shadow-sm mb-6">
      <h2 className="text-lg font-medium text-foreground">
        <TranslateText text="Travel Dates" language={currentLanguage} />
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            <TranslateText text="Check-in Date" language={currentLanguage} />
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12",
                  !checkInDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkInDate ? (
                  format(checkInDate, "PPP")
                ) : (
                  <TranslateText text="Select check-in date" language={currentLanguage} />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkInDate}
                onSelect={handleCheckInSelect}
                disabled={(date) => date < new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            <TranslateText text="Check-out Date" language={currentLanguage} />
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12",
                  !checkOutDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOutDate ? (
                  format(checkOutDate, "PPP")
                ) : (
                  <TranslateText text="Select check-out date" language={currentLanguage} />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOutDate}
                onSelect={handleCheckOutSelect}
                disabled={(date) => !checkInDate || date <= checkInDate || date < new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {checkInDate && checkOutDate && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              <TranslateText text="Trip Duration:" language={currentLanguage} />
            </span>
            <span className="font-medium text-primary">
              {Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))} <TranslateText text="days" language={currentLanguage} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}