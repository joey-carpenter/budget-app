'use client'

import { DataTable } from "~/app/dashboard/[budget]/data-table";
import { columns } from "./columns"
import { columnsTags } from "./columns";

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
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"

import { ComboboxDemo } from "~/app/dashboard/[budget]/combobox";
import { TrendingUp } from 'lucide-react';

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";


export default function Expenses() {
    const budgetId = useParams().budget as string;

    const { data: budget } = api.budget.getBudgetById.useQuery(budgetId, {
        refetchOnWindowFocus: false,
    });

    const { data: expenses } = api.expense.getExpenses.useQuery(budgetId, {
        refetchOnWindowFocus: false,
    });

    const addExpense = api.expense.addExpense.useMutation();

    const addToBudget = api.budget.addToBudget.useMutation();

    const removeBudget = api.budget.deleteBudget.useMutation({
        onSuccess: () => {
            window.location.href = "/dashboard";
        },
    });

    const tagAmounts: TagAmount[] = []

    expenses?.forEach(expense => {
        expense.tags.forEach(tag => {
            const existingTag = tagAmounts.find(t => t.name === tag.name || t.id === tag.id);
            if (existingTag) {
                existingTag.amount += expense.amount;
            } else {
                tagAmounts.push({ id: tag.id, name: tag.name, amount: expense.amount });
            }
        });
    });

    const months = [...new Set(
        expenses?.map(obj => {
            const date = new Date(obj.createdAt);
            const month = date.getMonth(); // 0-11
            const year = date.getFullYear();
            return JSON.stringify({
                label: `${date.toLocaleString('en-US', { month: 'long' })} \`${year.toString().slice(-2)}`,
                month,
                year
            });
        })
    )]
        .map(str => JSON.parse(str))
        .sort((a, b) => b.year - a.year || b.month - a.month)

    months.push({
        label: "All",
        month: 0,
        year: 0
    });

    const [month, setMonth] = useState({ month: months[0].month, year: months[0].year });

    const [addBudgetAmount, setAddBudgetAmount] = useState(0)

    const [contributorEmail, setContributorEmail] = useState("")

    const addContributor = api.budget.addContributor.useMutation();

    return (
        <main className="flex flex-col p-4 px-6">
            <ComboboxDemo month={month} setMonth={setMonth} months={months} />

            <div className="text-2xl text-muted-foreground font-mono px-4 py-1 mb-4">Oscar</div>

            <div className="flex items-center justify-start space-x-4">
                <Card className="w-48 h-38">
                    <CardHeader>
                        <CardDescription>Budget Total</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {budget?.totalAmount.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            })}
                        </CardTitle>
                    </CardHeader>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="mx-2" variant="outline" size="sm">
                                Add
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add to Budget</DialogTitle>
                                <DialogDescription>
                                    Add an amount to your budget.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="amount-1">Amount</Label>
                                    <Input id="amount-1" name="amount" value={addBudgetAmount === 0 ? "" : addBudgetAmount} onChange={(e) => setAddBudgetAmount(Number(e.target.value))} type="number" />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" onClick={() => addToBudget.mutate({ id: budgetId, amount: addBudgetAmount })}>Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Card>

                <Card className="w-48 h-38">
                    <CardHeader>
                        <CardDescription>Total Spent</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {expenses?.filter(expense => (expense.createdAt.getMonth() === month.month && expense.createdAt.getFullYear() === month.year) || month.year === 0).reduce((acc, expense) => acc + expense.amount, 0).toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            })}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <div>
                <DataTable columns={columns} data={expenses?.filter(expense => (expense.createdAt.getMonth() === month.month && expense.createdAt.getFullYear() === month.year) || month.year === 0) || []} addExpense={addExpense} budgetId={budgetId} tagsFilter pagination />
            </div>

            <DataTable columns={columnsTags} data={tagAmounts} />

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-fit">Share</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Contributor</DialogTitle>
                        <DialogDescription>
                            Add a contributor to your budget.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="email-1">Email</Label>
                            <Input id="email-1" name="email" value={contributorEmail} onChange={(e) => setContributorEmail(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" onClick={() => addContributor.mutate({ budgetId, email: contributorEmail })}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Button variant="destructive" className="mt-4 w-fit" onClick={() => removeBudget.mutate( budgetId )}>
                Delete Budget
            </Button>

        </main>
    )
}