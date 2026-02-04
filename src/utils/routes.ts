import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const router = createRouter({
  defaultPendingMinMs: 0,
  routeTree,
  history: createMemoryHistory({
    initialEntries: ["/"],
  }),
});
