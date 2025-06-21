"use client"

import { useQuery } from "@tanstack/react-query"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import type { ColumnDef } from "@tanstack/react-table"
import { get } from "http"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"

async function getData(): Promise<Charge[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            description: "For feeding rats in cages",
            tags: ["rats", "cages"],
            date: new Date("2023-10-01"),
            amount: 500,
        },
        {
            id: "728ed52f",
            description: "For selling seashells by the seashore",
            tags: ["seashells", "glass"],
            date: new Date("2023-10-02"),
            amount: 75,
        },
        {
            id: "728ed52f",
            description: "Ice Cream and Cookies",
            tags: ["ice cream", "cookies", "cake"],
            date: new Date("2023-10-03"),
            amount: 50,
        },
        {
            id: "728ed52f",
            description: "tons of cat and dog food",
            tags: ["cats", "dogs"],
            date: new Date("2023-10-04"),
            amount: 200,
        },
        // ...
    ]
}

type Charge = {
    id: string
    description: string
    tags: string[]
    date: Date
    amount: number
}

const columns: ColumnDef<Charge>[] = [
    {
        accessorKey: "description",
        header: () => <div className="">Description</div>,
        cell: ({ row }) => {
            return <div className="font-medium">{row.getValue("description")}</div>
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
    {
        accessorKey: "date",
        header: () => <div className="">Date</div>,
        cell: ({ row }) => {
            const date = new Date(row.getValue("date"))
            return (
                <div className="text-sm text-gray-500">
                    {date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </div>
            )
        },
    },
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
]

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

import React from "react"

export function DataTable() {
    const [data, setData] = React.useState<Charge[]>([])
    React.useEffect(() => {
        getData().then(setData)
    }, [])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
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
    )
}