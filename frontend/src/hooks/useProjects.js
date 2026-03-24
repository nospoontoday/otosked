import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProject, getProjects } from '../api/projects';

export const useProjects = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return { ...query, createProject: mutation };
};