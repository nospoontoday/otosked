import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProject, getProjects } from '../api/projects';

export const useProjects = () => {
  const queryClient = useQueryClient();
  const [creatingKey, setCreatingKey] = useState(null);

  const query = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  const mutation = useMutation({
    mutationFn: createProject,
    onMutate: (variables) => {
      setCreatingKey(variables.templateKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onSettled: () => {
      setCreatingKey(null);
    },
  });

  return { ...query, createProject: mutation, creatingKey };
};