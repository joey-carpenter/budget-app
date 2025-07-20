import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    deleteUser: protectedProcedure
        .input(z.string().min(1, "User ID is required"))
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.user.findUnique({
                where: { id: input },
            });

            if (!user || user.id !== ctx.session.user.id) {
                throw new Error("Not authorized");
            }

            return ctx.db.user.delete({
                where: { id: input },
            });
        }),

    updateUser: protectedProcedure
        .input(z.object({
            id: z.string().min(1, "User ID is required"),
            name: z.string().min(1, "Name is required"),
            email: z.string().email("Invalid email address"),
        }))
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.user.findUnique({
                where: { id: input.id },
            });

            if (!user || user.id !== ctx.session.user.id) {
                throw new Error("Not authorized");
            }

            return ctx.db.user.update({
                where: { id: input.id },
                data: {
                    name: input.name,
                    email: input.email,
                },
            });
        }),

    
});
