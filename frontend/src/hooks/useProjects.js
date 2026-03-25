import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProject, getProjects, getProject } from '../api/projects';

/**
 * 🔹 List + Create Projects
 */
export const useProjects = () => {
  const queryClient = useQueryClient();
  const [creatingKey, setCreatingKey] = useState(null);

  // 📦 Fetch all projects
  const query = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  // ➕ Create project
  const mutation = useMutation({
    mutationFn: createProject,

    onMutate: (variables) => {
      setCreatingKey(variables.templateKey);
    },

    onSuccess: (data) => {
      // ✅ 1. Update projects list
      queryClient.invalidateQueries({ queryKey: ['projects'] });

      // ✅ 2. Seed single project cache (IMPORTANT 🚀)
      if (data?.id) {
        queryClient.setQueryData(['project', data.id], data);
      }
    },

    onSettled: () => {
      setCreatingKey(null);
    },
  });

  return {
    ...query,
    createProject: mutation,
    creatingKey,
  };
};

/**
 * 🔹 Get single project (used in ProjectPage)
 */
export const useProject = (id) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id),
    enabled: !!id,

    // 💡 Optional but powerful:
    staleTime: 1000 * 60 * 5, // 5 mins (prevents refetch spam)
  });
};