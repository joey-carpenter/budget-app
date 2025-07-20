"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "~/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

import { type RouterOutputs } from "~/trpc/react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Expense = RouterOutputs["expense"]["getExpenses"][number]

export const columns: ColumnDef<Expense>[] = [
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "tags",
        header: "Tags",
        cell: ({ row }) => (
            <div className="flex flex-wrap gap-2">
                {row.original.tags.map((tag) => (
                    <span
                        key={tag.id}
                        className="px-2 py-1 rounded-lg text-sm text-black"
                        style={{ backgroundColor: "#f0f0f0" }}
                    >
                        {tag.name}
                    </span>
                ))}
            </div>
        ),
        filterFn: (row, columnId, filterValue) => {
            const rowValue = row.getValue(columnId) as string[]
            return rowValue.map((tag) => tag.toLowerCase().includes(filterValue.toLowerCase())).some(Boolean)
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt)
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        },
    },
    {
        accessorKey: "amount",
        header: () => (
            <div>
                <span className="flex items-center justify-end">Amount</span>
            </div>
        ),
        cell: ({ row }) => {
            const amount = row.original.amount
            const formattedAmount = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)

            return <div>
                <span className="flex items-center justify-end font-semibold">{formattedAmount}</span>
            </div>
        },
    },
    // {
    //     id: "actions",
    //     cell: ({ row }) => {
    //         const expense = row.original

    //         return (
    //             <div className="flex items-center justify-end">
    //                 <DropdownMenu>
    //                     <DropdownMenuTrigger asChild>
    //                         <Button variant="ghost" className="h-8 w-8 p-0">
    //                             <span className="sr-only">Open menu</span>
    //                             <MoreHorizontal className="h-4 w-4" />
    //                         </Button>
    //                     </DropdownMenuTrigger>
    //                     <DropdownMenuContent align="end">
    //                         <DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
    //                         <DropdownMenuItem
    //                             onClick={() => navigator.clipboard.writeText(expense.id)}
    //                         >
    //                             Copy expense ID
    //                         </DropdownMenuItem>
    //                         <DropdownMenuSeparator />
    //                         <DropdownMenuItem>View customer</DropdownMenuItem>
    //                         <DropdownMenuItem>View payment details</DropdownMenuItem>
    //                     </DropdownMenuContent>
    //                 </DropdownMenu>
    //             </div>
    //         )
    //     },
    // },
]

export type TagAmount = {
    id: string
    name: string
    amount: number
}

export const columnsTags: ColumnDef<TagAmount>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    <span>{row.original.name}</span>
                    {/* {tag.color && (
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: tag.color }}
                        />
                    )} */}
                </div>
            )
        },
    },
    {
        accessorKey: "amount",
        header: () => (
            <div>
                <span className="flex items-center justify-end">Amount</span>
            </div>
        ),
        cell: ({ row }) => {
            const amount = row.original.amount
            const formattedAmount = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)

            return <div>
                <span className="flex items-center justify-end font-semibold">{formattedAmount}</span>
            </div>
        },
    },
]