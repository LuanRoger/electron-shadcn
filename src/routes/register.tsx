import { createFileRoute } from "@tanstack/react-router";
import { RegisterFormComponent } from "@/components/auth/register-form";
import NavigationMenu from "@/components/navigation-menu";

export const Route = createFileRoute("/register")({
  component: () => (
    <>
      <div className="flex h-screen items-center justify-center">
        <RegisterFormComponent />
      </div>
    </>
  ),
});

