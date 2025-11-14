"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useResetPassword } from "@/hooks/useAuth";
import { Loader2, ArrowLeft, CheckCircle2, Key, Lock } from "lucide-react";
import { useState } from "react";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

type ResetPasswordFormProps = {
  onSwitchToLogin: () => void;
};

export function ResetPasswordForm({ onSwitchToLogin }: ResetPasswordFormProps) {
  const [resetSuccess, setResetSuccess] = useState(false);
  const resetPasswordMutation = useResetPassword();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
      newPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof resetPasswordSchema>) => {
    resetPasswordMutation.mutate(data, {
      onSuccess: () => {
        setResetSuccess(true);
      },
    });
  };

  if (resetSuccess) {
    return (
      <div className="space-y-5 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Password Reset Successful</h3>
        <p className="text-sm text-gray-600">
          Your password has been reset successfully. You can now login with your new password.
        </p>
        <Button
          className="w-full h-12 text-base font-medium rounded-md bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-white"
          onClick={onSwitchToLogin}
        >
          Continue to Login
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="flex items-center text-sm text-gray-600 hover:text-gray-800 font-medium -mt-2 mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </button>

        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="token" className="font-medium text-gray-700">
                Reset Token
              </Label>
              <div className="relative mt-1">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <FormControl>
                  <Input
                    {...field}
                    id="token"
                    placeholder="Enter reset token from email"
                    className="h-12 pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500/30"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="newPassword" className="font-medium text-gray-700">
                New Password
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <FormControl>
                  <Input
                    {...field}
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    className="h-12 pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500/30"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full h-12 text-base font-medium rounded-md bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-white" 
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting password...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </Form>
  );
}