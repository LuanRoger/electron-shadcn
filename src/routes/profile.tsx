import { createFileRoute } from "@tanstack/react-router";
import { ProfileFormComponent } from "@/components/auth/profile-form";

export const Route = createFileRoute("/profile")({
  component: () => (
    <div className="flex h-screen items-center justify-center">
      <ProfileFormComponent />
    </div>
  ),
});

