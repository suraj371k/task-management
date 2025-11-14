import { authService } from "@/services/auth.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      if (data.success && data.user) {
        // Store the full AuthResponse to match what getProfile returns
        queryClient.setQueryData(["user"], data);
      }
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.signup,
    onSuccess: (data) => {
      if (data.success && data.user) {
        // Store the full AuthResponse to match what getProfile returns
        queryClient.setQueryData(["user"], data);
      }
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.clear();
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authService.forgotPassword,
  });
};

export const useResetPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: (data) => {
      if (data.success && data.user) {
        // Store the full AuthResponse to match what getProfile returns
        queryClient.setQueryData(["user"], data);
      }
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: authService.getProfile,
    retry: false,
    // Keep stale data while refetching in background
    placeholderData: (previousData) => previousData,
    // Use cached data initially, then refetch in background
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
};
