import { get } from "http";
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const budgetRouter = createTRPCRouter({
    getBudgets: protectedProcedure
        .query(async ({ ctx }) => {
            return ctx.db.budget.findMany({
                where: { ownerId: ctx.session.user.id },
                orderBy: { createdAt: "desc" },
            });
        }),

    getBudgetById: protectedProcedure
        .input(z.string().min(1, "Budget ID is required"))
        .query(async ({ ctx, input }) => {
            const budget = await ctx.db.budget.findUnique({
                where: { id: input },
            });

            if (!budget || budget.ownerId !== ctx.session.user.id) {
                throw new Error("Not authorized");
            }

            return budget;
        }),

    createBudget: protectedProcedure
        .input(z.object({
            name: z.string().min(1, "Name is required"),
            totalAmount: z.number().min(0, "Total amount must be positive"),
            description: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const budget = await ctx.db.budget.create({
                data: {
                    name: input.name,
                    totalAmount: input.totalAmount,
                    description: input.description ?? "",
                    owner: { connect: { id: ctx.session.user.id } },
                },
            });

            return budget;
        }),

    addToBudget: protectedProcedure
        .input(z.object({
            id: z.string().min(1, "Budget ID is required"),
            amount: z.number().min(0, "Amount must be positive"),
        }))
        .mutation(async ({ ctx, input }) => {
            const budget = await ctx.db.budget.findUnique({
                where: { id: input.id },
                include: { owner: true },
            });

            if (!budget || budget.owner.id !== ctx.session.user.id) {
                throw new Error("Not authorized");
            }

            return ctx.db.budget.update({
                where: { id: input.id },
                data: {
                    totalAmount: budget.totalAmount + input.amount,
                },
            });
        }),

    addContributor: protectedProcedure
        .input(z.object({
            budgetId: z.string().min(1, "Budget ID is required"),
            email: z.string().min(1, "Email is required").email("Invalid email"),
        }))
        .mutation(async ({ ctx, input }) => {
            const budgetManager = await ctx.db.budgetManager.create({
                data: {
                    budget: { connect: { id: input.budgetId } },
                    user: { connect: { email: input.email } },
                },
            });

            return budgetManager;
        }),

    updateBudget: protectedProcedure
        .input(z.object({
            id: z.string().min(1, "Budget ID is required"),
            name: z.string().min(1, "Name is required"),
            totalAmount: z.number().min(0, "Total amount must be positive"),
        }))
        .mutation(async ({ ctx, input }) => {
            const budget = await ctx.db.budget.findUnique({
                where: { id: input.id },
                include: { owner: true },
            });

            if (!budget || budget.owner.id !== ctx.session.user.id) {
                throw new Error("Not authorized");
            }

            return ctx.db.budget.update({
                where: { id: input.id },
                data: {
                    name: input.name,
                    totalAmount: input.totalAmount,
                },
            });
        }),

    deleteBudget: protectedProcedure
        .input(z.string().min(1, "Budget ID is required"))
        .mutation(async ({ ctx, input }) => {
            const budget = await ctx.db.budget.findUnique({
                where: { id: input },
                include: { owner: true },
            });

            if (!budget || budget.owner.id !== ctx.session.user.id) {
                return ctx.db.budgetManager.deleteMany({
                    where: {
                        budgetId: input,
                        userId: ctx.session.user.id,
                    },
                });
            }

            return ctx.db.budget.delete({
                where: { id: input },
            });
        }),

    
});
