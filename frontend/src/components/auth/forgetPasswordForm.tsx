"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForgotPassword } from "@/hooks/auth/useAuth";
import { Loader2, ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { useState } from "react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordFormProps = {
  onSwitchToLogin: () => void;
  onSwitchToResetPassword: () => void;
};

export function ForgotPasswordForm({ onSwitchToLogin }: ForgotPasswordFormProps) {
  const [emailSent, setEmailSent] = useState(false);
  const forgotPasswordMutation = useForgotPassword();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: () => {
        setEmailSent(true);
      },
    });
  };

  if (emailSent) {
    return (
      <div className="space-y-5 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Check your email</h3>
        <p className="text-sm text-gray-600">
          If the email exists, we've sent a password reset link to{" "}
          <span className="font-medium text-gray-800">{form.getValues("email")}</span>
        </p>
        <Button
          className="w-full h-12 text-base font-medium rounded-md bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-white"
          onClick={onSwitchToLogin}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
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

        <Button 
          type="submit" 
          className="w-full h-12 text-base font-medium rounded-md bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-white" 
          disabled={forgotPasswordMutation.isPending}
        >
          {forgotPasswordMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending reset link...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>
    </Form>
  );
}