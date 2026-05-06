import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/trpc";
import { authRouter } from "./routers/auth";
import { characterRouter } from "./routers/character";
import { fortuneRouter } from "./routers/fortune";
import { subscriptionRouter } from "./routers/subscription";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  character: characterRouter,
  fortune: fortuneRouter,
  subscription: subscriptionRouter,
});

export type AppRouter = typeof appRouter;
