import React from "react";
import DragWindowRegion from "@/components/DragWindowRegion";
import { SidebarLayout } from "@/components/template/SidebarNavigation";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <DragWindowRegion title="Expenses" /> */}
      <SidebarLayout>
        {children}
      </SidebarLayout>
    </>
  );
}
