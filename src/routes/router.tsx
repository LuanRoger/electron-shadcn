import {
    Link,
    Outlet,
    RouterProvider,
    createRootRoute,
    createRouter,
} from "@tanstack/react-router";
import BaseLayout from "@/layouts/BaseLayout";
import React from "react";
import { HomeRoute } from "./routes";

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

export const RootRoute = createRootRoute({
    component: () => (
        <BaseLayout>
            <div className="flex gap-2 p-2">
                <Link to="/" className="font-bold">
                    Home
                </Link>
            </div>
            <hr />
            <Outlet />
        </BaseLayout>
    ),
});

export default function AppRouter() {
    return <RouterProvider router={router} />;
}

export const routeTree = RootRoute.addChildren([HomeRoute]);

export const router = createRouter({ routeTree });
