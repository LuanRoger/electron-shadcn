"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Link, useNavigate } from "@tanstack/react-router";

const formSchema = z.object({
  email: z.string().email({ message: "유효한 이메일을 입력해주세요." }),
  password: z.string().min(6, { message: "비밀번호는 최소 6자 이상이어야 합니다." }),
  confirmPassword: z.string().min(6, { message: "비밀번호 확인은 최소 6자 이상이어야 합니다." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirmPassword"],
});

export function RegisterFormComponent() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        form.setError("email", { message: error.message });
        console.error("회원가입 실패:", error.message);
        return;
      }

      console.log("회원가입 성공! 이메일 확인이 필요합니다.");
      alert("회원가입 성공! 이메일 확인이 필요합니다.");
      navigate({ to: "/login" }); // 회원가입 성공 시 로그인 페이지로 리디렉션
    } catch (error) {
      console.error("예상치 못한 오류 발생:", error);
      form.setError("email", { message: "예상치 못한 오류가 발생했습니다." });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-120">
      <label className="flex justify-center iteam-agin-center w-full text-xl font-bold" >BATTLEZONE</label>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input placeholder="이메일" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input type="password" placeholder="비밀번호" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호 확인</FormLabel>
              <FormControl>
                <Input type="password" placeholder="비밀번호 확인" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="h-10 w-full font-bold bg-blue-500 text-white hover:bg-blue-600">회원가입</Button>
        <Button asChild className="w-full font-bold bg-gray-600 text-white hover:bg-gray-700">
          <Link to="/login" >로그인</Link>
        </Button>
      </form>
    </Form>
  );
}

