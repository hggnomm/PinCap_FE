import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as users from '@/api/users';

export const useUser = () => {
  const queryClient = useQueryClient();

  const updateMyProfile = useMutation({
    mutationFn: (data: any) => users.updateMyProfile(data),
    onSuccess: (updatedData) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['replies'] });
      
      queryClient.invalidateQueries({ queryKey: ['medias'] });
      
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['album'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      
      if (updatedData) {
        queryClient.setQueryData(['user'], updatedData);
      }
    },
    retry: false,
  });

  const getRelationships = (relationship: 'followers' | 'followees') => {
    return useQuery({
      queryKey: ['relationships', relationship],
      queryFn: () => users.getRelationships(relationship),
      staleTime: 5 * 60 * 1000,
    });
  };

  const followOrBlockUser = useMutation({
    mutationFn: (data: { followeeId: string; status: 'FOLLOWING' | 'BLOCK' }) =>
      users.followOrBlockUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relationships'] });
      queryClient.invalidateQueries({ 
        queryKey: ['user'],
        refetchType: 'none' // Mark as stale but don't refetch immediately
      });
    },
    retry: false,
  });

  const unfollowOrUnblockUser = useMutation({
    mutationFn: (data: { followeeId: string; status: 'FOLLOWING' | 'BLOCK' }) =>
      users.unfollowOrUnblockUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relationships'] });
      queryClient.invalidateQueries({ 
        queryKey: ['user'],
        refetchType: 'none' // Mark as stale but don't refetch immediately
      });
    },
    retry: false,
  });

  const getUserProfile = (id: string) => {
    return useQuery({
      queryKey: ['profile', id],
      queryFn: () => users.getUserProfile(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  const getUserRelationships = (userId: string, relationship: 'followers' | 'followees') => {
    return useQuery({
      queryKey: ['relationships', userId, relationship],
      queryFn: () => users.getUserRelationships(userId, relationship),
      enabled: !!userId,
      staleTime: 5 * 60 * 1000,
    });
  };

  // const searchUsers = (target: string) => {
  //   return useQuery({
  //     queryKey: ['users', 'search', target],
  //     queryFn: () => users.searchUsers(target),
  //     enabled: !!target,
  //     staleTime: 5 * 60 * 1000,
  //   });
  // };

  const findUsers = (target: string, albumId?: string | null) => {
    return useQuery({
      queryKey: ['users', 'find', target, albumId],
      queryFn: () => users.findUsers(target, albumId),
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
    retry: false,
  });

  return {
    updateMyProfile: updateMyProfile.mutateAsync,
    updateMyProfileLoading: updateMyProfile.isPending,
    updateMyProfileError: updateMyProfile.error,
    
    getRelationships,
    followOrBlockUser: followOrBlockUser.mutateAsync,
    followOrBlockLoading: followOrBlockUser.isPending,
    followOrBlockError: followOrBlockUser.error,
    
    unfollowOrUnblockUser: unfollowOrUnblockUser.mutateAsync,
    unfollowOrUnblockLoading: unfollowOrUnblockUser.isPending,
    unfollowOrUnblockError: unfollowOrUnblockUser.error,
    
    getUserProfile,
    getUserRelationships,
    // searchUsers,
    findUsers,
    getReportReasons,
    reportUser: reportUser.mutateAsync,
    reportUserLoading: reportUser.isPending,
    reportUserError: reportUser.error,
  };
};
