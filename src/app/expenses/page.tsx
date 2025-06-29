import { DataTable } from "~/components/ui/data-table";
import { columns } from "./columns"

import type { Expense } from "./columns";

export default async function Expenses() {
    const sampleExpenses: Expense[] = [
        {
            id: "1",
            description: "Groceries",
            amount: 100,
            createdAt: "2023-01-01",
            tags: ["food", "shopping"],
        },
        {
            id: "2",
            description: "Rent",
            amount: 1200,
            createdAt: "2023-01-01",
            tags: ["housing", "bills"],
        },
        {
            id: "3",
            description: "Utilities",
            amount: 300,
            createdAt: "2023-01-01",
            tags: ["bills"],
        },
        {
            id: "4",
            description: "Internet",
            amount: 60,
            createdAt: "2023-01-01",
            tags: ["bills", "internet", "housing"],
        },
        {
            id: "5",
            description: "Transportation",
            amount: 150,
            createdAt: "2023-01-01",
            tags: ["transportation", "fuel"],
        },
    ]

    return (
        <main className="flex flex-col p-4 px-6">
            <div className="text-6xl font-bold mb-2 font-mono">$2750</div>
            <div className="mb-6 text-2xl text-muted-foreground font-mono">John Doe</div>
            
            <DataTable columns={columns} data={sampleExpenses} />

        </main>
    )
}