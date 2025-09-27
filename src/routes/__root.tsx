import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import { Outlet, createRootRoute } from "@tanstack/react-router";
/* import { TanStackRouterDevtools } from '@tanstack/react-router-devtools' */

function Root() {
  return (
    <BaseLayout>
      <Outlet />
      {/* Uncomment the following line to enable the router devtools */}
      {/* <TanStackRouterDevtools /> */}
    </BaseLayout>
  );
}

export const Route = createRootRoute({
  component: Root,
});
