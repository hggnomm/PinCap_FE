import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as users from '../api/users';

export const useUser = () => {
  const queryClient = useQueryClient();

  const getMyProfile = () => {
    return useQuery({
      queryKey: ['user', 'profile'],
      queryFn: users.getMyProfile,
      staleTime: 5 * 60 * 1000,
    });
  };

  const updateMyProfile = useMutation({
    mutationFn: (data: any) => users.updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });

  const getRelationships = (relationship: 'followers' | 'followees') => {
    return useQuery({
      queryKey: ['user', 'relationships', relationship],
      queryFn: () => users.getRelationships(relationship),
      staleTime: 5 * 60 * 1000,
    });
  };

  const followOrBlockUser = useMutation({
    mutationFn: (data: { followeeId: string; status: 'FOLLOWING' | 'BLOCK' }) =>
      users.followOrBlockUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'relationships'] });
    },
  });

  const unfollowOrUnblockUser = useMutation({
    mutationFn: (data: { followeeId: string; status: 'FOLLOWING' | 'BLOCK' }) =>
      users.unfollowOrUnblockUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'relationships'] });
    },
  });

  const getUserProfile = (id: string) => {
    return useQuery({
      queryKey: ['user', 'profile', id],
      queryFn: () => users.getUserProfile(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  const getUserRelationships = (userId: string, relationship: 'followers' | 'followees') => {
    return useQuery({
      queryKey: ['user', 'relationships', userId, relationship],
      queryFn: () => users.getUserRelationships(userId, relationship),
      enabled: !!userId,
      staleTime: 5 * 60 * 1000,
    });
  };

  const searchUsers = (target: string) => {
    return useQuery({
      queryKey: ['users', 'search', target],
      queryFn: () => users.searchUsers(target),
      enabled: !!target,
      staleTime: 5 * 60 * 1000,
    });
  };

  const findUsers = (target: string) => {
    return useQuery({
      queryKey: ['users', 'find', target],
      queryFn: () => users.findUsers(target),
      enabled: !!target,
      staleTime: 5 * 60 * 1000,
    });
  };

  const getReportReasons = () => {
    return useQuery({
      queryKey: ['report-reasons'],
      queryFn: users.getReportReasons,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  const reportUser = useMutation({
    mutationFn: (data: { user_id: string; reason_report_id?: string; other_reasons?: string }) =>
      users.reportUser(data),
  });

  return {
    getMyProfile,
    updateMyProfile: updateMyProfile.mutate,
    updateMyProfileLoading: updateMyProfile.isPending,
    updateMyProfileError: updateMyProfile.error,
    
    getRelationships,
    followOrBlockUser: followOrBlockUser.mutate,
    followOrBlockLoading: followOrBlockUser.isPending,
    followOrBlockError: followOrBlockUser.error,
    
    unfollowOrUnblockUser: unfollowOrUnblockUser.mutate,
    unfollowOrUnblockLoading: unfollowOrUnblockUser.isPending,
    unfollowOrUnblockError: unfollowOrUnblockUser.error,
    
    getUserProfile,
    getUserRelationships,
    searchUsers,
    findUsers,
    getReportReasons,
    reportUser: reportUser.mutate,
    reportUserLoading: reportUser.isPending,
    reportUserError: reportUser.error,
  };
};
