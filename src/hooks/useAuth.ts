import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import * as auth from '@/api/auth';
import { ROUTES } from '@/constants/routes';
import { LoginFormData, RegisterFormData } from '@/validation';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: auth.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token, // Only run query if token exists
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => auth.login(data),
    onSuccess: (response: any) => {
      localStorage.setItem('token', response.token);
      queryClient.setQueryData(['user'], response.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
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
      localStorage.removeItem('token');
      queryClient.clear();
      navigate(ROUTES.HOME);
    },
  });

  const isAuthenticated = !!user;

  return {
    user,
    isLoadingUser,
    isAuthenticated,
    login: loginMutation.mutate,
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    registerLoading: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutate,
    logoutLoading: logoutMutation.isPending,
  };
};
