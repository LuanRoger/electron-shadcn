import type { ComponentProps } from "react";
import { openExternalLink } from "@/actions/shell";
import { cn } from "@/utils/tailwind";

export default function ExternalLink({
  children,
  className,
  href,
  ...props
}: ComponentProps<"a">) {
  function open() {
    if (!href) {
      return;
    }

    openExternalLink(href);
  }

  return (
    <a
      className={cn("cursor-pointer underline", className)}
      {...props}
      onClick={open}
    >
      {children}
    </a>
  );
}
