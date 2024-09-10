import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";

export const RootRoute = createRootRoute({
    component: Root,
});

function Root() {
    return (
        <BaseLayout>
            <div className="flex gap-2 p-2">
                <Link to="/" className="font-bold">
                    Home
                </Link>
            </div>
            <hr />
            <Outlet />
        </BaseLayout>
    );
}
