import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI, projectsAPI, tasksAPI } from '../services/api';

// Cache time constants
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const STALE_TIME = 2 * 60 * 1000; // 2 minutes

// ============== Auth Queries ==============
export const useGetMe = (options = {}) => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authAPI.getMe().then(res => res.data),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    ...options
  });
};

// ============== Projects Queries ==============
export const useGetProjects = (options = {}) => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsAPI.getAll().then(res => res.data),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    ...options
  });
};

export const useGetProjectById = (id, options = {}) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsAPI.getById(id).then(res => res.data),
    enabled: !!id,
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    ...options
  });
};

// ============== Projects Mutations ==============
export const useCreateProject = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => projectsAPI.create(data).then(res => res.data),
    onSuccess: () => {
      // Invalidate projects list cache
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    ...options
  });
};

export const useUpdateProject = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => projectsAPI.update(id, data).then(res => res.data),
    onSuccess: (data) => {
      // Update specific project cache
      queryClient.setQueryData(['projects', data.project._id], { project: data.project });
      // Invalidate projects list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    ...options
  });
};

export const useDeleteProject = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => projectsAPI.delete(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['projects', id] });
      // Invalidate projects list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    ...options
  });
};

export const useAddMember = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, data }) => projectsAPI.addMember(projectId, data).then(res => res.data),
    onSuccess: (data) => {
      // Update project cache
      queryClient.setQueryData(['projects', data.project._id], { project: data.project });
    },
    ...options
  });
};

export const useRemoveMember = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, data }) => projectsAPI.removeMember(projectId, data),
    onSuccess: (_, { projectId }) => {
      // Invalidate specific project
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
    },
    ...options
  });
};

// ============== Tasks Queries ==============
export const useGetTasks = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => tasksAPI.getAll(params).then(res => res.data),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    ...options
  });
};

export const useGetTaskById = (id, options = {}) => {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => tasksAPI.getById(id).then(res => res.data),
    enabled: !!id,
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    ...options
  });
};

export const useGetDashboard = (options = {}) => {
  return useQuery({
    queryKey: ['tasks', 'dashboard'],
    queryFn: () => tasksAPI.getDashboard().then(res => res.data),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    ...options
  });
};

// ============== Tasks Mutations ==============
export const useCreateTask = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => tasksAPI.create(data).then(res => res.data),
    onSuccess: () => {
      // Invalidate tasks list and dashboard
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'dashboard'] });
    },
    ...options
  });
};

export const useUpdateTask = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => tasksAPI.update(id, data).then(res => res.data),
    onSuccess: (data) => {
      // Update specific task cache
      queryClient.setQueryData(['tasks', data.task._id], { task: data.task });
      // Invalidate tasks list and dashboard
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'dashboard'] });
    },
    ...options
  });
};

export const useDeleteTask = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => tasksAPI.delete(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['tasks', id] });
      // Invalidate tasks list and dashboard
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'dashboard'] });
    },
    ...options
  });
};
