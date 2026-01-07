"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useEffect, useState } from "react";

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
import { UserProfile } from "@/types/user";
import { useNavigate } from "@tanstack/react-router";

const profileFormSchema = z.object({
  username: z.string().min(2, { message: "사용자 이름은 최소 2자 이상이어야 합니다." }),
  avatar_url: z.string().url({ message: "유효한 URL을 입력해주세요." }).optional().or(z.literal("")),
});

export function ProfileFormComponent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      avatar_url: "",
    },
  });

  useEffect(() => {
    async function getProfile() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate({ to: "/login" });
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select(`username, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("프로필 가져오기 실패:", error.message);
        return;
      }

      if (data) {
        form.reset({ username: data.username, avatar_url: data.avatar_url });
      }
      setLoading(false);
    }

    getProfile();
  }, [form, navigate]);

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      navigate({ to: "/login" });
      return;
    }

    try {
      const { error } = await supabase
        .from("users")
        .update({
          username: values.username,
          avatar_url: values.avatar_url || null,
        })
        .eq("id", user.id);

      if (error) {
        console.error("프로필 업데이트 실패:", error.message);
        alert("프로필 업데이트 실패: " + error.message);
        return;
      }

      alert("프로필이 성공적으로 업데이트되었습니다.");
      console.log("프로필 업데이트 성공!");
    } catch (error) {
      console.error("예상치 못한 오류 발생:", error);
      alert("예상치 못한 오류가 발생했습니다.");
    }
  }

  if (loading) {
    return <p>프로필 로딩 중...</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-80">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>사용자 이름</FormLabel>
              <FormControl>
                <Input placeholder="사용자 이름" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatar_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>아바타 URL</FormLabel>
              <FormControl>
                <Input placeholder="아바타 URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">프로필 업데이트</Button>
      </form>
    </Form>
  );
}

