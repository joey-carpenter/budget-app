import Link from "next/link";

import { Button } from "~/components/ui/button";
import { auth } from "~/server/auth";
import { HydrateClient, api } from "~/trpc/server";

export default async function Home() {
    const hello = await api.post.hello({ text: "from tRPC" });
    const session = await auth();

    if (session?.user) {
        void api.post.getLatest.prefetch();
    }

    return (
        <HydrateClient>
            <main className="flex min-h-screen flex-col items-center justify-center">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-2xl">
                            Sign in with Google
                        </p>

                        <div className="flex flex-col items-center justify-center gap-4">
                            <p className="text-center text-2xl text-white">
                                {session && <span>Logged in as {session.user?.name}</span>}
                            </p>
                            <Link
                                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                            >
                                <Button variant="outline">
                                    {session ? "Sign out" : "Sign in"}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </HydrateClient>
    );
}