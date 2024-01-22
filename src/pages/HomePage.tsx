import React from "react";
import ToggleTheme from "../components/ToggleTheme";

export default function HomePage() {
  return (
    <>
      <div className="flex flex-col gap-2 h-screen justify-center items-center">
        <h1 className="text-4xl font-bold">Home Page</h1>
        <ToggleTheme/>
      </div>
    </>
  );
}
