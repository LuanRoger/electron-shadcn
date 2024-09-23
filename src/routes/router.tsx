import { createRouter } from "@tanstack/react-router";
import { HomeRoute } from "./routes";
import { RootRoute } from "./__root";

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

export const routeTree = RootRoute.addChildren([HomeRoute]);

export const router = createRouter({ routeTree });