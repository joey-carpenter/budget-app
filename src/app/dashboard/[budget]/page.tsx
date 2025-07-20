import { DataTable } from "~/app/dashboard/[budget]/data-table";
import { columns } from "./columns"
import { columnsTags } from "./columns";

import type { Expense } from "./columns";
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
import { api } from "~/trpc/server";

export default async function Expenses({
    params,
}: {
    params: Promise<{ budget: string }>
}) {
    const budgetId = (await params).budget

    const budget = await api.budget.getBudgetById(budgetId);  

    const expenses = await api.expense.getExpenses(budgetId);

    console.log(expenses);

    const tagAmounts: TagAmount[] = []

    expenses.forEach(expense => {
        expense.tags.forEach(tag => {
            const existingTag = tagAmounts.find(t => t.name === tag.name || t.id === tag.id);
            if (existingTag) {
                existingTag.amount += expense.amount;
            } else {
                tagAmounts.push({ id: tag.id, name: tag.name, amount: expense.amount });
            }
        });
    });

    return (
        <main className="flex flex-col p-4 px-6">
            <ComboboxDemo />

            <div className="text-2xl text-muted-foreground font-mono px-4 py-1 mb-4">Oscar</div>

            <div className="flex items-center justify-start space-x-4">
                <Card className="w-48 h-38">
                    <CardHeader>
                        <CardDescription>Budget Total</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {budget.totalAmount.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            })}
                        </CardTitle>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Info about budget <TrendingUp className="size-4" />
                        </div>
                    </CardFooter>
                </Card>

                <Card className="w-48 h-38">
                    <CardHeader>
                        <CardDescription>Total Spent</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {expenses.reduce((acc, expense) => acc + expense.amount, 0).toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            })}
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
                <DataTable columns={columns} data={expenses} tagsFilter pagination />
            </div>

            <DataTable columns={columnsTags} data={tagAmounts} />

        </main>
    )
}