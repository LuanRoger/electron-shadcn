import { createFileRoute } from "@tanstack/react-router";
import { LoginFormComponent } from "@/components/auth/login-form";
import NavigationMenu from "@/components/navigation-menu";

export const Route = createFileRoute("/login")({
  component: () => (
    <>
      <div className="flex h-screen items-center justify-center">
        <LoginFormComponent />
      </div>
    </>
  ),
});

