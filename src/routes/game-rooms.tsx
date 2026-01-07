import { createFileRoute } from "@tanstack/react-router";
import { RoomList } from "@/components/game/room-list";
import { CreateRoomForm } from "@/components/game/create-room-form";

export const Route = createFileRoute("/game-rooms")({
  component: () => (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">게임 방</h1>
      <CreateRoomForm />
      <div className="mt-8">
        <RoomList />
      </div>
    </div>
  ),
});

