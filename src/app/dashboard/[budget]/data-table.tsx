"use client"

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
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  tagsFilter = false,
  smallTable = false,
  pagination = false
}: DataTableProps<TData, TValue> & {
  tagsFilter?: boolean,
  smallTable?: boolean,
  pagination?: boolean
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

  return (
    <div className={`${smallTable ? "w-fit" : "w-full"} my-4`}>
      {tagsFilter &&
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
      }
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
          {/* <TableFooter>
            <TableRow>
              <TableCell className="font-bold">TOTAL</TableCell>
              <TableCell colSpan={columns.length - 1} className="text-right font-semibold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(
                  table
                    .getFilteredRowModel()
                    .rows.reduce((sum, row) => {
                      const amount = row.getValue("amount") as number
                      return sum + (amount || 0)
                    }, 0)
                )}
              </TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
      </div>
      {pagination && table.getFilteredRowModel().rows.length > 10 &&
        <div className="flex items-center justify-end space-x-2 py-4">
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
      }
    </div>
  )
}