import { DataTable } from "~/components/ui/data-table";
import { columns } from "./columns"
import { columnsTags } from "./columns";

import type { Expense } from "./columns";
import type { Tag } from "./columns";
import type { TagAmount } from "./columns";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"

import { ComboboxDemo } from "~/components/combobox";

import { ChevronsUpDown, TrendingUp } from 'lucide-react';

export default async function Expenses() {
    const sampleExpenses: Expense[] = [
        {
            id: "1",
            description: "Histology",
            amount: 152,
            createdAt: "2022-08-14",
            tags: [{ id: "facilities-core", name: "Facilities/Core", color: "#5995ED" }],
        },
        {
            id: "2",
            description: "Anti-BrdU antibody",
            amount: 441,
            createdAt: "2023-03-22",
            tags: [{ id: "material-supplies", name: "Material/Supplies", color: "#EB5160" }],
        },
        {
            id: "3",
            description: "RNA mini kit",
            amount: 523,
            createdAt: "2021-11-05",
            tags: [{ id: "material-supplies", name: "Material/Supplies", color: "#EB5160" }],
        },
        {
            id: "4",
            description: "Bio-X-Cell antibody CD8",
            amount: 441,
            createdAt: "2022-12-19",
            tags: [{ id: "material-supplies", name: "Material/Supplies", color: "#EB5160" }],
        },
        {
            id: "5",
            description: "microscope cover slips",
            amount: 120,
            createdAt: "2023-07-09",
            tags: [{ id: "material-supplies", name: "Material/Supplies", color: "#EB5160" }],
        },
        {
            id: "6",
            description: "Flow Cytometry",
            amount: 382,
            createdAt: "2021-09-27",
            tags: [{ id: "facilities-core", name: "Facilities/Core", color: "#5995ED" }],
        },
        {
            id: "7",
            description: "RNAse inhibitor",
            amount: 286,
            createdAt: "2022-05-16",
            tags: [{ id: "material-supplies", name: "Material/Supplies", color: "#EB5160" }],
        },
        {
            id: "8",
            description: "Kanamycin sulfate",
            amount: 86,
            createdAt: "2023-01-30",
            tags: [{ id: "material-supplies", name: "Material/Supplies", color: "#EB5160" }],
        },
        {
            id: "9",
            description: "protein standards",
            amount: 248,
            createdAt: "2022-10-03",
            tags: [{ id: "material-supplies", name: "Material/Supplies", color: "#EB5160" }],
        },
        {
            id: "10",
            description: "CD40 Rat antibody",
            amount: 470,
            createdAt: "2021-12-11",
            tags: [{ id: "material-supplies", name: "Material/Supplies", color: "#EB5160" }],
        },
        {
            id: "11",
            description: "microscopy",
            amount: 470,
            createdAt: "2022-03-28",
            tags: [{ id: "facilities-core", name: "Facilities/Core", color: "#5995ED" }],
        },
        {
            id: "12",
            description: "Imaging",
            amount: 1380,
            createdAt: "2023-05-21",
            tags: [{ id: "facilities-core", name: "Facilities/Core", color: "#5995ED" }],
        },
        {
            id: "13",
            description: "140 cages of mice",
            amount: 5040,
            createdAt: "2021-07-15",
            tags: [{ id: "mice-per-diem", name: "Mice Per Diem", color: "#FFAD05" }],
        }
    ]

    const tagAmounts: TagAmount[] = []

    sampleExpenses.forEach(expense => {
        expense.tags.forEach(tag => {
            const existingTag = tagAmounts.find(t => t.tag.name === tag.name || t.tag.id === tag.id);
            if (existingTag) {
                existingTag.amount += expense.amount;
            } else {
                tagAmounts.push({ tag: { id: tag.id, name: tag.name }, amount: expense.amount });
            }
        });
    });

    return (
        <main className="flex flex-col p-4 px-6">
            <ComboboxDemo />

            <div className="text-2xl text-muted-foreground font-mono px-4 py-1 mb-4">Oscar</div>

            <div className="flex items-center justify-start mb-4 space-x-4">
                <Card className="min-w-fit">
                    <CardHeader>
                        <CardDescription>Budget Total</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            $1,250.00
                        </CardTitle>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Info about budget <TrendingUp className="size-4" />
                        </div>
                    </CardFooter>
                </Card>

                <Card className="min-w-fit">
                    <CardHeader>
                        <CardDescription>Total Spent</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            $850.00
                        </CardTitle>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Info about spend <TrendingUp className="size-4" />
                        </div>
                    </CardFooter>
                </Card>

                {/* <Card className="w-full">
                    <CardHeader>
                        <CardDescription>Tags</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            $1,250.00
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <TrendingUp className="size-4" />
                                +12.5%
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Trending up this month <TrendingUp className="size-4" />
                        </div>
                    </CardFooter>
                </Card> */}
            </div>

            <div>
                <DataTable columns={columns} data={sampleExpenses} tagsFilter pagination />
            </div>

            <DataTable columns={columnsTags} data={tagAmounts} />

        </main>
    )
}