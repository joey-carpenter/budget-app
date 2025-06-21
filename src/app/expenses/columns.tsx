"use client"

import type { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Charge = {
    id: string
    amount: number
    tags: string[]
}

export const columns: ColumnDef<Charge>[] = [
    {
        accessorKey: "amount",
        header: () => <div className="">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)

            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "tags",
        header: () => <div className="">Tags</div>,
        cell: ({ row }) => {
            const tags = row.getValue("tags") as string[]

            return tags.map((tag) => (
                <span
                    key={tag}
                    className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 mr-2"
                >
                    {tag}
                </span>
            ))
        },
    },
]