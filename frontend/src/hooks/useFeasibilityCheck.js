import { useQuery } from '@tanstack/react-query';
import { checkProjectFeasibility } from '../api/projects';

export const useFeasibilityCheck = (projectId) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['feasibility', projectId],
    queryFn: () => checkProjectFeasibility(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    feasibility: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
