import Link from "next/link";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"

import { api } from "~/trpc/server";
import CreateBudget from "./createBudget";
import { revalidatePath } from "next/cache";

export default async function Dashboard() {
    const budgets = await api.budget.getBudgets()

    async function refetch() {
        "use server";
        revalidatePath("/dashboard"); // adjust to your route
    }

    return (
        <main className="flex items-center p-4 flex-col">
            <CreateBudget refetch={refetch} />

            <div className="p-4 flex flex-col items-start w-full">
                <div className="text-3xl font-semibold w-full text-start">Managed Budgets</div>

                <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-8">
                    {/* <Researcher
                        name="John Doe"
                        budget={500}
                        description="Exploring applications of machine learning in climate modeling."
                    />
                    <Researcher
                        name="Jane Doe"
                        budget={3000}
                        description=" Investigating blockchain's role in secure data sharing."
                    />
                    <Researcher
                        name="Taylor Morgan"
                        budget={800}
                        description="Studying neural networks for real-time language translation."
                    />
                    <Researcher
                        name="Alex Carter"
                        budget={-100}
                        description="Researching seashells on the seashore."
                    /> */}

                    {budgets?.map((budget) => (
                        <Researcher
                            key={budget.id}
                            id={budget.id}
                            name={budget.name}
                            budget={budget.totalAmount}
                            description={budget.description ?? "Research budget details not provided."}
                        />
                    )) || "No budgets found."}
                </div>
            </div>
        </main>
    )
}

function Researcher({ id, name, budget, description }: {
    id: string;
    name: string;
    budget: number;
    description: string;
}) {
    return (
        <Link href={`/dashboard/${id}`}>
            <Card className="w-72 h-36 cursor-pointer hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="h-full">
                    <CardTitle className="flex items-center">
                        <span className="mr-auto">{name}</span>
                        <span className={budget < 0 ? "text-red-500" : ""}>${budget}</span>
                    </CardTitle>
                    <CardDescription className="w-full h-full flex items-center">{description}</CardDescription>
                </CardHeader>
            </Card>
        </Link>
    )
}