import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"

export default function Dashboard() {
    return (
        <main className="flex justify-center p-4">
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <Researcher
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
                />
            </div>
        </main>
    )
}

function Researcher({ name, budget, description }: {
    name: string;
    budget: number;
    description: string;
}) {
    return (
        <Card className="w-72 h-36 cursor-pointer hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="h-full">
                <CardTitle className="flex justify-between">
                    <span>{name}</span>
                    <span className={budget < 0 ? "text-red-500" : ""}>${budget}</span>
                </CardTitle>
                <CardDescription className="w-full h-full flex items-center">{description}</CardDescription>
            </CardHeader>
        </Card>
    )
}