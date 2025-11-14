"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useLogin } from "@/hooks/useAuth";
import { Loader2, Mail, Lock } from "lucide-react";
import { loginSchema } from "@/lib/validations/auth";

type LoginFormProps = {
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword: () => void;
};

export function LoginForm({
  onSwitchToSignup,
  onSwitchToForgotPassword,
}: LoginFormProps) {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success(response.message || "Login successful! Welcome back.");
          // Use setTimeout to ensure query cache is updated before navigation
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 100);
        } else {
          toast.error(response.message || "Login failed. Please try again.");
        }
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred. Please try again.";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="email" className="font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <FormControl>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    className="h-12 pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500/30"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-medium text-gray-700">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={onSwitchToForgotPassword}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <FormControl>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="h-12 pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500/30"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full h-12 text-base font-medium rounded-md bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-white"
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        {/* Switch to Signup */}
        <p className="text-center text-sm text-gray-600 pt-2">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Sign up here
          </button>
        </p>
      </form>
    </Form>
  );
}
