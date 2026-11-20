import { cn } from "cn";
import type { ComponentProps } from "react";
import { openExternalLink } from "@/actions/shell";

type ExternalLinkProps = ComponentProps<"button"> & { href?: string };

export default function ExternalLink({
  children,
  className,
  href,
  ...props
}: ExternalLinkProps) {
  function open() {
    if (!href) {
      return;
    }

    openExternalLink(href);
  }

  return (
    <button
      className={cn("cursor-pointer underline", className)}
      {...props}
      onClick={open}
    >
      {children}
    </button>
  );
}
