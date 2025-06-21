import { columns } from "./columns"
import type { Charge } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Charge[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 500,
      tags: ["rats", "cages"],
    },
    {
      id: "728ed52f",
      amount: 75,
      tags: ["seashells", "glass"],
    },
    {
      id: "728ed52f",
      amount: 50,
      tags: ["ice cream", "cookies", "cake"],
    },
    {
      id: "728ed52f",
      amount: 200,
      tags: ["cats", "dogs"],
    },
    // ...
  ]
}

export default async function Expenses() {
    const data = await getData()

    return (
        <main className="flex flex-col p-4 px-6">
            <div className="text-4xl font-bold mb-6">John Doe</div>
            <DataTable columns={columns} data={data} />
        </main>
    )
}