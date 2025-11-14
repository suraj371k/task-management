"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
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

import { useSignup } from "@/hooks/auth/useAuth";
import { signupSchema } from "@/lib/validations/auth";

import {
  Loader2,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

type SignupFormProps = {
  onSwitchToLogin: () => void;
};

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const signupMutation = useSignup();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: z.infer<typeof signupSchema>) => {
    signupMutation.mutate(data, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success(
            response.message || "Account created successfully! Welcome!"
          );
          // Use setTimeout to ensure query cache is updated before navigation
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 100);
        } else {
          toast.error(response.message || "Signup failed. Please try again.");
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
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label className="font-medium text-gray-700">Full Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John Doe"
                      className="h-12 pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500/30"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label className="font-medium text-gray-700">Email Address</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <FormControl>
                    <Input
                      {...field}
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

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label className="font-medium text-gray-700">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="h-12 pl-10 pr-10 border-gray-300 focus:ring-2 focus:ring-blue-500/30"
                    />
                  </FormControl>

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full h-12 text-base font-medium rounded-md bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-white"
          >
            {signupMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center">
            By signing up, you agree to our{" "}
            <span className="text-blue-600 hover:underline cursor-pointer">
              Terms
            </span>{" "}
            and{" "}
            <span className="text-blue-600 hover:underline cursor-pointer">
              Privacy Policy
            </span>
            .
          </p>

          {/* Switch */}
          <p className="text-center text-sm text-gray-600 pt-2">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign in here
            </button>
          </p>
        </form>
      </Form>
  );
}
