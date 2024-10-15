import React from "react";
import DragWindowRegion from "@/components/DragWindowRegion";
import NavigationMenu from "@/components/NavigationMenu";

export default function BaseLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <DragWindowRegion title="electron-shadcn" />
            <NavigationMenu />
            <hr />
            <main>{children}</main>
        </>
    );
}
