"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { GameRoom } from "@/types/game";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

export function RoomList() {
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRooms() {
      const { data, error } = await supabase.from("game_rooms").select(`*`);

      if (error) {
        console.error("게임 방 목록 가져오기 실패:", error.message);
        return;
      }

      if (data) {
        setRooms(data as GameRoom[]);
      }
      setLoading(false);
    }

    fetchRooms();

    const channel = supabase.channel("game_rooms").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "game_rooms",
      },
      (payload) => {
        console.log("Realtime payload:", payload);
        if (payload.eventType === "INSERT") {
          setRooms((prevRooms) => [...prevRooms, payload.new as GameRoom]);
        } else if (payload.eventType === "UPDATE") {
          setRooms((prevRooms) =>
            prevRooms.map((room) =>
              room.id === (payload.new as GameRoom).id
                ? (payload.new as GameRoom)
                : room
            )
          );
        } else if (payload.eventType === "DELETE") {
          setRooms((prevRooms) =>
            prevRooms.filter((room) => room.id !== (payload.old as GameRoom).id)
          );
        }
      }
    );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleJoinRoom = async (roomId: string) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      navigate({ to: "/login" });
      return;
    }

    // 이미 참여했는지 확인하거나, 참여자 테이블에 추가하는 로직
    try {
      const { error } = await supabase.from("participants").insert({
        room_id: roomId,
        user_id: user.id,
      });

      if (error && error.code !== '23505') { // 23505는 Unique Constraint Violation (이미 참여)
        throw error;
      }

      alert("방에 참여했습니다!");
      navigate({ to: `/game-rooms/${roomId}` }); // 방 상세 페이지로 이동
    } catch (error: any) {
      console.error("방 참여 실패:", error.message);
      alert("방 참여 실패: " + error.message);
    }
  };

  if (loading) {
    return <p>게임 방 목록 로딩 중...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">현재 개설된 게임 방</h2>
      {rooms.length === 0 ? (
        <p>개설된 게임 방이 없습니다. 새로운 방을 만들어보세요!</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <li key={room.id} className="border p-4 rounded-md shadow-sm">
              <h3 className="text-lg font-bold">{room.name}</h3>
              <p>상태: {room.status}</p>
              <p>방장: {room.owner_id}</p> {/* 실제로는 사용자 이름으로 변환 필요 */}
              <Button onClick={() => handleJoinRoom(room.id)} className="mt-2">
                참여하기
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

