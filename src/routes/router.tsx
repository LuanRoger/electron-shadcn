import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import { AboutRoute, HomeRoute } from "./routes";
import { RootRoute } from "./__root";

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

export const rootTree = RootRoute.addChildren([HomeRoute, AboutRoute]);

const history = createMemoryHistory({
    initialEntries: ["/"],
});
export const router = createRouter({ routeTree: rootTree, history: history });
