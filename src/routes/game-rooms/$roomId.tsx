import { createFileRoute } from "@tanstack/react-router";
import { RoomDetail } from "@/components/game/room-detail";

export const Route = createFileRoute("/game-rooms/$roomId")({
  component: () => {
    const { roomId } = Route.useParams();
    return (
      <div className="container mx-auto p-4">
        <RoomDetail roomId={roomId} />
      </div>
    );
  },
});

