"use client"

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
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"
import { useState } from "react"
import { Plus } from "lucide-react"
import { api } from "~/trpc/react"

export default function CreateBudget({ refetch }: { refetch?: () => void }) {
    const [name, setName] = useState("")
    const [totalAmount, setTotalAmount] = useState(0)
    const [description, setDescription] = useState("")

    const createBudget = api.budget.createBudget.useMutation({
        onMutate: () => {
            refetch?.()
        }
    })

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="mb-4">
                    <Plus className="mr-2" />
                    New Budget
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
                        <Label htmlFor="name-1">Name</Label>
                        <Input id="name-1" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="total-1">Total</Label>
                        <Input id="total-1" name="total" type="number" value={totalAmount === 0 ? "" : totalAmount} onChange={(e) => setTotalAmount(Number(e.target.value))} />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="description-1">Description (optional)</Label>
                        <Input id="description-1" name="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="submit" onClick={() => createBudget.mutate({ name, totalAmount, description })}>Save changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
