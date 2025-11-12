import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import * as auth from "@/api/auth";
import { ROUTES } from "@/constants/routes";
import { User } from "@/types/type";
import { LoginFormData, RegisterFormData } from "@/validation";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const {
    data: user,
    isLoading: isLoadingUser,
    error,
  } = useQuery<User>({
    queryKey: ["user"],
    queryFn: auth.getCurrentUser,
    retry: false,
    refetchOnMount: false,
    retryOnMount: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token, // Only run query if token exists
  });

  useEffect(() => {
    if (error && (error as { status?: number })?.status === 401) {
      localStorage.removeItem("token");
      queryClient.clear();
      navigate(ROUTES.LOGIN);
    }
  }, [error, queryClient, navigate]);

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => auth.login(data),
    onSuccess: (response: { token: string; user: User }) => {
      localStorage.setItem("token", response.token);
      queryClient.setQueryData(["user"], response.user);
      // No need to invalidate - we just set the data
      navigate(ROUTES.PINCAP_HOME);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) => auth.register(data),
    onSuccess: () => {
      navigate(ROUTES.LOGIN);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: auth.logout,
    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.clear();
      navigate(ROUTES.HOME);
    },
  });

  const isAuthenticated = !!user;

  return {
    user,
    isLoadingUser,
    isAuthenticated,
    login: loginMutation.mutateAsync,
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    registerLoading: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutateAsync,
    logoutLoading: logoutMutation.isPending,
  };
};
