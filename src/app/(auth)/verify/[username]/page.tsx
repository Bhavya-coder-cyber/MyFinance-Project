"use client"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"; 
import { ModeToggle } from "@/components/darkmode";


const VerifyAccountPage = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast.success(response.data.message);
      router.replace("/login");
    } catch (error) {
        console.error("Error verifying code:", error);
        const axiosError = error as AxiosError<ApiResponse>;
        let errorMessage = axiosError.response?.data.message;
        toast.error("Error verifying code" + errorMessage);
    }
  }
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <img
          src="https://i.pinimg.com/736x/63/51/4b/63514b5c214d75eed34eb6fa85a8fa77.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <ModeToggle />
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                  Verify your account
                </h1>
                <p className="text-muted-foreground text-balance mb-4">
                  Enter the verification code sent to your email
                </p>
              </div>
          <div className="w-full max-w-xs">
            <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS_AND_CHARS} {...field}
                    >
                      <InputOTPGroup className="flex justify-center w-full h-20">
                        <InputOTPSlot index={0} className="h-12 border-gray-400" />
                        <InputOTPSlot index={1} className="h-12 border-gray-400" />
                        <InputOTPSlot index={2} className="h-12 border-gray-400" />
                        <InputOTPSlot index={3} className="h-12 border-gray-400" />
                        <InputOTPSlot index={4} className="h-12 border-gray-400" />
                        <InputOTPSlot index={5} className="h-12 border-gray-400" />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button type="submit" variant="default">
                Verify
              </Button>
            </div>
          </form>
        </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyAccountPage
