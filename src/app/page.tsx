import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { TranslationBox } from "./_components/TranslationBox";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="container mx-auto flex flex-1 flex-col px-4 py-16">
          <div className="mt-auto flex flex-col items-center gap-12">
            <h1 className="text-xl font-extrabold tracking-tight sm:text-[4rem]">
              English to <span className="text-blue-500">Chinese</span>
            </h1>
            <TranslationBox />

            {session?.user && <LatestPost />}
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
