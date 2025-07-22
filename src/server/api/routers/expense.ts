import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

// Define the router for expense-related API endpoints
export const expenseRouter = createTRPCRouter({
    // Get all expenses for a specific budget (requires authentication)
    getExpenses: protectedProcedure
        .input(z.string().min(1, "Budget ID is required"))
        .query(async ({ ctx, input }) => {
            return ctx.db.expense.findMany({
                where: { budgetId: input },
                orderBy: { createdAt: "desc" },
                include: {
                    tags: true
                }
            });
        }),

    // Remove an expense by ID (requires authentication and ownership)
    removeExpense: protectedProcedure
        .input(z.string().min(1, "Expense ID is required"))
        .mutation(async ({ ctx, input }) => {
            // Ensure the expense belongs to the user's budget
            const expense = await ctx.db.expense.findUnique({
                where: { id: input },
                include: { budget: true },
            });

            if (!expense || expense.budget.ownerId !== ctx.session.user.id) {
                throw new Error("Not authorized");
            }

            return ctx.db.expense.delete({
                where: { id: input },
            });
        }),

    // Add a new expense to a budget (requires authentication and ownership)
    addExpense: protectedProcedure
        .input(z.object({
            description: z.string().min(1, "Description is required"),
            amount: z.number().min(0, "Amount must be a positive number"),
            budgetId: z.string().min(1, "Budget ID is required"),
            tags: z.array(z.string()).optional(), // Optional array of tag strings
        }))
        .mutation(async ({ ctx, input }) => {
            // Create a new expense and associate it with the specified budget
            const expense = await ctx.db.expense.create({
                data: {
                    description: input.description,
                    amount: input.amount,
                    budget: {
                        connect: { id: input.budgetId },
                    },
                    tags: {
                        create: input.tags?.map(tag => ({
                            name: tag,
                        })),
                    },
                },
            });

            // Fetch the budget to ensure it exists and belongs to the user
            const budget = await ctx.db.budget.findUnique({
                where: { id: input.budgetId },
            });

            // Authorization check: only the owner can add expenses
            if (!budget || budget.ownerId !== ctx.session.user.id) {
                throw new Error("Not authorized");
            }
            
            // Update the budget's total amount after adding the expense
            await ctx.db.budget.update({
                where: { id: input.budgetId },
                data: {
                    totalAmount: budget.totalAmount - input.amount,
                },
            });

            return expense;
        }),

    // Update an existing expense (requires authentication and ownership)
    updateExpense: protectedProcedure
        .input(z.object({
            id: z.string().min(1, "Expense ID is required"),
            description: z.string().optional(),
            amount: z.number().min(0).optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            // Ensure the expense belongs to the user's budget
            const expense = await ctx.db.expense.findUnique({
                where: { id: input.id },
                include: { budget: true },
            });

            // Authorization check: only the owner can update expenses
            if (!expense || expense.budget.ownerId !== ctx.session.user.id) {
                throw new Error("Not authorized");
            }

            // Update the expense with new values, keeping old ones if not provided
            return ctx.db.expense.update({
                where: { id: input.id },
                data: {
                    description: input.description ?? expense.description,
                    amount: input.amount ?? expense.amount,
                },
            });
        }),

    
});
