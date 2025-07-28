"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { signupSchema } from "@/schemas/signupSchema";
import { ModeToggle } from "@/components/darkmode";
import { cn } from "@/lib/utils";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Value will set after 300ms using debounce
  const debounced = useDebounceCallback(setUsername, 300);

  const router = useRouter();

  //Implementation of Zod
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          let message = response.data.message;
          console.log(message);
          setUsernameMessage(message);
          setIsCheckingUsername(false);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsername();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      await axios.post<ApiResponse>("/api/signup", data);
      toast.success("Signup Success");
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error signing up:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast.error("Error signing up " + errorMessage);
      setIsSubmitting(false);
    }
  };
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <ModeToggle />
        <div className="flex flex-col items-center justify-center space-y-8">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  Welcome to{" "}
                  <span className="font-serif font-bold italic">MyFinance</span>
                </h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter the following credentials to start your journey
                </p>
              </div>
          <div className="w-full max-w-xs">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john_doe"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debounced(e.target.value);
                          }}
                        />
                      </FormControl>
                      {isCheckingUsername && (
                        <Loader className="animate-spin" />
                      )}
                      <p
                        className={`text-sm ${usernameMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}
                      >
                        {usernameMessage}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe@gmail.com" {...field} />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="default"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" /> Please
                        Wait
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
            <div className="text-center mt-4">
              <p>
                Already have an account?{" "}
                <Link href="/login" className="text-blue-500 hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="https://i.pinimg.com/736x/0d/01/35/0d01359d662ef7a80e003c86ae4e0689.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default SignUpPage;
