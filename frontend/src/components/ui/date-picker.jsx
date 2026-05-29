import * as React from "react"
import { format, setMonth, setYear } from "date-fns"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ value, onChange, placeholder = "Pilih tanggal", className, triggerClassName }) {
  const [date, setDate] = React.useState(value ? new Date(value) : undefined)
  const [viewMonth, setViewMonth] = React.useState(date || new Date())
  const [view, setView] = React.useState("day") // "day" | "month" | "year"
  const [currentDecade, setCurrentDecade] = React.useState(
    Math.floor(viewMonth.getFullYear() / 10) * 10
  )

  React.useEffect(() => {
    if (value) {
      const d = new Date(value);
      setDate(d);
      setViewMonth(d);
    }
  }, [value]);

  const handleSelect = (newDate) => {
    setDate(newDate)
    if (onChange && newDate) {
      onChange(format(newDate, "yyyy-MM-dd"))
    }
  }

  const handleYearSelect = (year) => {
    const newMonth = setYear(viewMonth, year)
    setViewMonth(newMonth)
    setView("month")
  }

  const handleMonthSelect = (monthIndex) => {
    const newMonth = setMonth(viewMonth, monthIndex)
    setViewMonth(newMonth)
    setView("day")
  }

  // Generate decade when opening year view
  const openYearView = () => {
    setCurrentDecade(Math.floor(viewMonth.getFullYear() / 10) * 10)
    setView("year")
  }

  const years = Array.from({ length: 12 }, (_, i) => currentDecade - 1 + i)
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            triggerClassName
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-auto p-3 bg-white dark:bg-[#1C1F21] border border-gray-200 dark:border-gray-800 shadow-lg rounded-xl z-50", className)} align="start">
        {view === "day" && (
          <div className="flex flex-col">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              month={viewMonth}
              onMonthChange={setViewMonth}
              initialFocus
              components={{
                MonthCaption: () => (
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-sm font-medium hover:text-[var(--green-dark)] hover:bg-[var(--cream)]"
                      onClick={() => setView("month")}
                    >
                      {format(viewMonth, "MMMM")}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-sm font-medium hover:text-[var(--green-dark)] hover:bg-[var(--cream)]"
                      onClick={openYearView}
                    >
                      {viewMonth.getFullYear()}
                    </Button>
                  </div>
                )
              }}
            />
          </div>
        )}

        {view === "month" && (
          <div className="w-[260px] p-2">
            <div className="flex items-center justify-between mb-4">
              <Button type="button" variant="ghost" size="icon" onClick={() => setViewMonth(setYear(viewMonth, viewMonth.getFullYear() - 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" className="font-semibold text-[var(--green-dark)] hover:bg-[var(--cream)]" onClick={openYearView}>
                {viewMonth.getFullYear()}
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => setViewMonth(setYear(viewMonth, viewMonth.getFullYear() + 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {months.map((month, i) => (
                <Button
                  key={month}
                  type="button"
                  variant={viewMonth.getMonth() === i ? "default" : "ghost"}
                  onClick={() => handleMonthSelect(i)}
                  className={cn(
                    "h-10 hover:bg-[var(--cream)] hover:text-[var(--green-dark)]", 
                    viewMonth.getMonth() === i && "bg-[var(--green-dark)] text-white hover:bg-[var(--green-mid)] hover:text-white"
                  )}
                >
                  {month}
                </Button>
              ))}
            </div>
          </div>
        )}

        {view === "year" && (
          <div className="w-[260px] p-2">
            <div className="flex items-center justify-between mb-4">
              <Button type="button" variant="ghost" size="icon" onClick={() => setCurrentDecade(currentDecade - 10)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="font-semibold text-sm text-[var(--green-dark)]">
                {currentDecade} - {currentDecade + 9}
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => setCurrentDecade(currentDecade + 10)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {years.map((year) => (
                <Button
                  key={year}
                  type="button"
                  variant={year === viewMonth.getFullYear() ? "default" : "ghost"}
                  onClick={() => handleYearSelect(year)}
                  className={cn(
                    "h-10 hover:bg-[var(--cream)] hover:text-[var(--green-dark)]",
                    year === viewMonth.getFullYear() && "bg-[var(--green-dark)] text-white hover:bg-[var(--green-mid)] hover:text-white",
                    (year < currentDecade || year > currentDecade + 9) && "text-muted-foreground opacity-50"
                  )}
                >
                  {year}
                </Button>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
