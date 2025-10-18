import { useQuery } from '@tanstack/react-query';
import * as health from '@/api/health';

export const useHealth = () => {
  const healthCheck = () => {
    return useQuery({
      queryKey: ['health'],
      queryFn: health.healthCheck,
      staleTime: 30 * 1000, // 30 seconds
      refetchInterval: 60 * 1000, // Refetch every minute
    });
  };

  return {
    healthCheck,
  };
};
