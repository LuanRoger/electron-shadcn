import React from "react";
import DragWindowRegion from "@/components/DragWindowRegion";

export default function BaseLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <DragWindowRegion title="electron-shadcn" />
            <main>{children}</main>
        </>
    );
}
