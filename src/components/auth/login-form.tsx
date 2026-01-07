"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "@tanstack/react-router";
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

const formSchema = z.object({
  email: z.string().email({ message: "유효한 이메일을 입력해주세요." }),
  password: z.string().min(6, { message: "비밀번호는 최소 6자 이상이어야 합니다." }),
});

export function LoginFormComponent() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        form.setError("email", { message: error.message });
        form.setError("password", { message: "" });
        console.error("로그인 실패:", error.message);
        return;
      }

      console.log("로그인 성공!");
      navigate({ to: "/" }); // 로그인 성공 시 홈으로 리디렉션
    } catch (error) {
      console.error("예상치 못한 오류 발생:", error);
      form.setError("email", { message: "예상치 못한 오류가 발생했습니다." });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-120">
        <label className="flex justify-center iteam-agin-center font-bold text-xl w-full" >BATTLEZONE</label>
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
        <Button type="submit" className="h-10 w-full font-bold bg-blue-500 text-white hover:bg-blue-600">로그인</Button>
        <div className="flex justify-between w-full">
          <Button asChild className="w-1/2 bg-gray-600 text-white hover:bg-gray-700">
            <Link to="/register">회원가입</Link>
          </Button>
          <Button asChild className="w-1/2 bg-gray-600 text-white hover:bg-gray-700">
            <Link to="/login">이메일/비밀번호 찾기</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}

