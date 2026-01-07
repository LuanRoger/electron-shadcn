"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { GameRoom, Participant } from "@/types/game";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { UserProfile } from "@/types/user";

interface RoomDetailProps {
  roomId: string;
}

export function RoomDetail({ roomId }: RoomDetailProps) {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [participants, setParticipants] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRoomDetails() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user?.id || null);

      if (!user) {
        alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
        navigate({ to: "/login" });
        return;
      }

      const { data: roomData, error: roomError } = await supabase
        .from("game_rooms")
        .select(`*`)
        .eq("id", roomId)
        .single();

      if (roomError) {
        console.error("방 정보 가져오기 실패:", roomError.message);
        setLoading(false);
        return;
      }
      setRoom(roomData as GameRoom);

      const { data: participantData, error: participantError } = await supabase
        .from("participants")
        .select(`user_id, users(username, avatar_url)`)
        .eq("room_id", roomId);

      if (participantError) {
        console.error("참여자 목록 가져오기 실패:", participantError.message);
        setLoading(false);
        return;
      }

      setParticipants(participantData.map((p: any) => p.users));
      setLoading(false);
    }

    fetchRoomDetails();

    // Realtime subscriptions
    const roomChannel = supabase.channel(`room:${roomId}`).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "game_rooms",
        filter: `id=eq.${roomId}`,
      },
      (payload) => {
        if (payload.eventType === "UPDATE") {
          setRoom(payload.new as GameRoom);
        }
      }
    );

    const participantChannel = supabase.channel(`participants:${roomId}`).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "participants",
        filter: `room_id=eq.${roomId}`,
      },
      async (payload) => {
        if (payload.eventType === "INSERT") {
          const { data: newUser } = await supabase.from("users").select("username, avatar_url").eq("id", (payload.new as Participant).user_id).single();
          if (newUser) {
            setParticipants((prev) => [...prev, newUser as UserProfile]);
          }
        } else if (payload.eventType === "DELETE") {
          setParticipants((prev) =>
            prev.filter((p) => p.id !== (payload.old as Participant).user_id)
          );
        }
      }
    );

    roomChannel.subscribe();
    participantChannel.subscribe();

    return () => {
      supabase.removeChannel(roomChannel);
      supabase.removeChannel(participantChannel);
    };
  }, [roomId, navigate]);

  const handleLeaveRoom = async () => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from("participants")
        .delete()
        .eq("room_id", roomId)
        .eq("user_id", currentUser);

      if (error) {
        throw error;
      }

      alert("방에서 나갔습니다.");
      navigate({ to: "/game-rooms" });
    } catch (error: any) {
      console.error("방 나가기 실패:", error.message);
      alert("방 나가기 실패: " + error.message);
    }
  };

  const handleUpdateRoomStatus = async (status: GameRoom["status"]) => {
    if (!currentUser || room?.owner_id !== currentUser) return;

    try {
      const { error } = await supabase
        .from("game_rooms")
        .update({ status })
        .eq("id", roomId);

      if (error) {
        throw error;
      }
      alert(`방 상태를 ${status}로 변경했습니다.`);
    } catch (error: any) {
      console.error("방 상태 업데이트 실패:", error.message);
      alert("방 상태 업데이트 실패: " + error.message);
    }
  };

  if (loading) {
    return <p>방 정보 로딩 중...</p>;
  }

  if (!room) {
    return <p>방을 찾을 수 없습니다.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">게임 방: {room.name}</h1>
      <p className="text-lg">상태: {room.status}</p>
      <p className="text-lg">방장: {room.owner_id}</p> {/* 실제로는 사용자 이름으로 변환 필요 */}

      <h2 className="text-2xl font-semibold">참여자</h2>
      {participants.length === 0 ? (
        <p>아직 참여자가 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {participants.map((participant) => (
            <li key={participant.id} className="flex items-center space-x-2">
              {participant.avatar_url && (
                <img
                  src={participant.avatar_url}
                  alt="아바타"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span>{participant.username || participant.id}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex space-x-4 mt-6">
        <Button onClick={handleLeaveRoom} variant="destructive">
          방 나가기
        </Button>
        {currentUser === room.owner_id && (
          <>
            <Button onClick={() => handleUpdateRoomStatus("in_game")}>
              게임 시작
            </Button>
            <Button onClick={() => handleUpdateRoomStatus("finished")}>
              게임 종료
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

