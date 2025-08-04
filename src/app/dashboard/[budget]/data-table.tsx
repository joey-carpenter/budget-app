import * as React from "react";

import type {
    ColumnDef,
    ColumnFiltersState,
} from "@tanstack/react-table";

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter
} from "~/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "~/components/ui/dialog"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "~/components/ui/command"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "~/lib/utils";
import { useState } from "react";
import { api } from "~/trpc/react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    budgetId: string,
}

const tags = [
    "Animal per diem",
    "Animal Purchase",
    "Facilities",
    "Material/Supplies",
    "Other"
]

export function DataTable<TData, TValue>({
    columns,
    data,
    budgetId,
    refetch,
}: DataTableProps<TData, TValue> & {
    refetch?: () => void;
}) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
    })

    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState<number>(0)

    const addExpense = api.expense.addExpense.useMutation({
        onMutate: () => {
            refetch?.()
        }
    });

    return (
        <div className="w-full my-4">
            <div className="flex items-center pb-4">
                <Input
                    placeholder="Filter tags..."
                    value={(table.getColumn("tags")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("tags")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}

                    </TableBody>
                </Table>
            </div>
            <Dialog>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <DialogTrigger className="mr-auto" asChild>
                        <Button variant="outline">Add Expense</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>New Expense</DialogTitle>
                            <DialogDescription>
                                Add a new expense to your budget.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="description-1">Description</Label>
                                <Input id="description-1" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="amount-1">Amount</Label>
                                <Input id="amount-1" name="amount" type="number" value={amount === 0 ? "" : amount} onChange={(e) => setAmount(Number(e.target.value))} />
                            </div>
                            <div className="grid gap-3">
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            // biome-ignore lint/a11y/useSemanticElements: <explanation>
                                            role="combobox"
                                            aria-expanded={open}
                                            className="w-[200px] justify-between"
                                        >
                                            {value
                                                ? tags.find((t) => t === value)
                                                : "Select tag..."}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search framework..." className="h-9" />
                                            <CommandList>
                                                <CommandEmpty>No framework found.</CommandEmpty>
                                                <CommandGroup>
                                                    {tags.map((tag) => (
                                                        <CommandItem
                                                            key={tag}
                                                            value={tag}
                                                            onSelect={(currentValue) => {
                                                                setValue(currentValue === value ? "" : currentValue)
                                                                setOpen(false)
                                                            }}
                                                        >
                                                            {tag}
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto",
                                                                    value === tag ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button type="submit" onClick={() => addExpense.mutate({ description, amount, budgetId, tags: [value] })}>Save changes</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </Dialog>

        </div>
    )
}