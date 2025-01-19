import { Link } from "@tanstack/react-router";
import React from "react";

export default function NavigationMenu() {
  return (
    <nav className="font-mono text-muted-foreground">
      <ul className="flex gap-2 p-2 text-sm">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </nav>
  );
}
