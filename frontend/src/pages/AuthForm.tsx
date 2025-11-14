"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { LoginForm } from "../components/auth/LoginForm";
import { ForgotPasswordForm } from "../components/auth/forgetPasswordForm";
import { ResetPasswordForm } from "../components/auth/ResetForm";
import { SignupForm } from "@/components/auth/SignupForm";

type AuthView = "login" | "signup" | "forgot-password" | "reset-password";

export function AuthForm() {
  const [currentView, setCurrentView] = useState<AuthView>("login");

  const getCardContent = () => {
    switch (currentView) {
      case "login":
        return (
          <LoginForm
            onSwitchToSignup={() => setCurrentView("signup")}
            onSwitchToForgotPassword={() => setCurrentView("forgot-password")}
          />
        );
      case "signup":
        return <SignupForm onSwitchToLogin={() => setCurrentView("login")} />;
      case "forgot-password":
        return (
          <ForgotPasswordForm
            onSwitchToLogin={() => setCurrentView("login")}
            onSwitchToResetPassword={() => setCurrentView("reset-password")}
          />
        );
      case "reset-password":
        return (
          <ResetPasswordForm onSwitchToLogin={() => setCurrentView("login")} />
        );
    }
  };

  const getCardTitle = () => {
    switch (currentView) {
      case "login":
        return "Welcome back";
      case "signup":
        return "Create your account";
      case "forgot-password":
        return "Forgot your password?";
      case "reset-password":
        return "Create new password";
    }
  };

  const getCardDescription = () => {
    switch (currentView) {
      case "login":
        return "Enter your credentials to access your account.";
      case "signup":
        return "Join us by creating a new account.";
      case "forgot-password":
        return "We'll email you a link to reset your password.";
      case "reset-password":
        return "Set a strong new password.";
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-300">
          <CardHeader className="text-center space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              {getCardTitle()}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {getCardDescription()}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8">{getCardContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
}
