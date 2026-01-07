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

const gameResultFormSchema = z.object({
  map: z.string().min(1, { message: "맵 이름을 입력해주세요." }),
  kills: z.number().min(0, { message: "킬 수는 0 이상이어야 합니다." }),
  rank: z.number().min(1, { message: "순위는 1 이상이어야 합니다." }),
});

export function SubmitResultFormComponent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof gameResultFormSchema>>({
    resolver: zodResolver(gameResultFormSchema),
    defaultValues: {
      map: "",
      kills: 0,
      rank: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof gameResultFormSchema>) {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      navigate({ to: "/login" });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("game_results").insert({
        user_id: user.id,
        map: values.map,
        kills: values.kills,
        rank: values.rank,
      });

      if (error) {
        console.error("게임 결과 제출 실패:", error.message);
        alert("게임 결과 제출 실패: " + error.message);
        setLoading(false);
        return;
      }

      alert("게임 결과가 성공적으로 제출되었습니다.");
      console.log("게임 결과 제출 성공!");
      form.reset(); // 폼 초기화
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
          name="map"
          render={({ field }) => (
            <FormItem>
              <FormLabel>맵</FormLabel>
              <FormControl>
                <Input placeholder="예: Erangel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="kills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>킬 수</FormLabel>
              <FormControl>
                <Input type="number" placeholder="킬 수" {...field} onChange={event => field.onChange(+event.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rank"
          render={({ field }) => (
            <FormItem>
              <FormLabel>순위</FormLabel>
              <FormControl>
                <Input type="number" placeholder="순위" {...field} onChange={event => field.onChange(+event.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>게임 결과 제출</Button>
      </form>
    </Form>
  );
}

