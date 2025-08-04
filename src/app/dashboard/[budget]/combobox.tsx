'use client'

import React from "react";

import { cn } from "~/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Button } from "~/components/ui/button";

import { Check, ChevronsUpDown } from "lucide-react";

export function ComboboxDemo({ month, setMonth, months }: { month: { month: number, year: number }, setMonth: (month: { month: number, year: number }) => void, months: { label: string, month: number, year: number }[] }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          // biome-ignore lint/a11y/useSemanticElements: <explanation>
          role="combobox"
          aria-expanded={open}
          className="w-fit justify-between font-semibold text-6xl p-10 font-mono"
        >
          {months.find((m) => m.month === month.month && m.year === month.year)?.label}
          <ChevronsUpDown className="scale-200 ml-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search month..." className="h-9" />
          <CommandList>
            <CommandEmpty>No month found.</CommandEmpty>
            <CommandGroup>
              {months.map((m) => (
                <CommandItem
                  key={m.label}
                  onSelect={(currentValue) => {
                    setMonth({ month: m.month, year: m.year })
                    setOpen(false)
                  }}
                >
                  {m.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      month.month === m.month && month.year === m.year ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}