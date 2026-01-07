"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/utils/supabase";
import { useNavigate } from "@tanstack/react-router";

const createRoomFormSchema = z.object({
  roomName: z.string().min(1, { message: "방 이름을 입력해주세요." }),
});

export function CreateRoomForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof createRoomFormSchema>>({
    resolver: zodResolver(createRoomFormSchema),
    defaultValues: {
      roomName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createRoomFormSchema>) {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      navigate({ to: "/login" });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from("game_rooms").insert({
        owner_id: user.id,
        name: values.roomName,
        status: "waiting",
      }).select().single();

      if (error) {
        console.error("게임 방 생성 실패:", error.message);
        alert("게임 방 생성 실패: " + error.message);
        setLoading(false);
        return;
      }

      alert("게임 방이 성공적으로 생성되었습니다.");
      console.log("게임 방 생성 성공!");
      form.reset(); // 폼 초기화
      // navigate({ to: `/game-rooms/${data.id}` }); // 생성된 방으로 이동
    } catch (error) {
      console.error("예상치 못한 오류 발생:", error);
      alert("예상치 못한 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-80">
        <FormField
          control={form.control}
          name="roomName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>방 이름</FormLabel>
              <FormControl>
                <Input placeholder="예: 킬 레이스 방" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>방 생성</Button>
      </form>
    </Form>
  );
}

