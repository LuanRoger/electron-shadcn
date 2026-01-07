import { createFileRoute } from "@tanstack/react-router";
import { SubmitResultFormComponent } from "@/components/game/submit-result-form";

export const Route = createFileRoute("/submit-game-result")({
  component: () => (
    <div className="flex h-screen items-center justify-center">
      <SubmitResultFormComponent />
    </div>
  ),
});

