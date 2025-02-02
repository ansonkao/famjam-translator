import { createTRPCRouter } from "~/server/api/trpc";
import { postRouter } from "./post";
import { translationRouter } from "./translation";

export const appRouter = createTRPCRouter({
  post: postRouter,
  translation: translationRouter,
});

export type AppRouter = typeof appRouter;
