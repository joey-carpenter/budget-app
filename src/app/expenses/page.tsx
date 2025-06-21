import { DataTable } from "./data-table"

export default async function Expenses() {
    return (
        <main className="flex flex-col p-4 px-6">
            <div className="text-6xl font-bold mb-2 font-mono">$2750</div>
            <div className="mb-6 text-2xl text-muted-foreground font-mono">John Doe</div>
            <DataTable />
        </main>
    )
}