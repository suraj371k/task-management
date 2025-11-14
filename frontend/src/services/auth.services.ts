import { backendUrl } from "@/lib/backendUrl";
import {
  authResponseSchema,
  type AuthResponse,
  type ForgotPasswordInput,
  type LoginInput,
  type ResetPasswordInput,
  type SignupInput,
} from "@/lib/validations/auth";

export const authService = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await backendUrl.post(`/api/user/login`, data);
    return authResponseSchema.parse(response.data);
  },

  signup: async (data: SignupInput): Promise<AuthResponse> => {
    const response = await backendUrl.post("/api/user/signup", data);
    return authResponseSchema.parse(response.data);
  },

  forgotPassword: async (data: ForgotPasswordInput): Promise<AuthResponse> => {
    const response = await backendUrl.post("/api/user/forgot-password", data);
    return authResponseSchema.parse(response.data);
  },

  resetPassword: async (data: ResetPasswordInput): Promise<AuthResponse> => {
    const response = await backendUrl.post("/api/user/reset-password", data);
    return authResponseSchema.parse(response.data);
  },

  logout: async (): Promise<AuthResponse> => {
    const response = await backendUrl.post("/api/user/logout");
    return authResponseSchema.parse(response.data);
  },
  getProfile: async (): Promise<AuthResponse> => {
    try {
      const response = await backendUrl.get("/api/user/profile");
      const transformedData = {
        success: response.data.success,
        message: response.data.message,
        token: response.data.token,
        user: response.data.user
          ? {
              id: response.data.user._id?.toString() || response.data.user.id?.toString() || "",
              email: response.data.user.email || "",
              name: response.data.user.name || "",
            }
          : undefined,
      };
      return authResponseSchema.parse(transformedData);
    } catch (error: any) {
      console.error("Profile data transformation error:", error);
      throw error;
    }
  },
};
