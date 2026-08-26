import { GetTasksResponse, TaskResponse } from '../types/planner.types';
import api from './api';

export const getTasksService = async (): Promise<GetTasksResponse> => {
  const response = await api.get('/api/v1/planner/gettasks');
  return response.data;
};

export const createTaskService = async (
  title: string,
  description?: string,
  dueDate?: string | null,
): Promise<TaskResponse> => {
  const response = await api.post('/api/v1/planner/createtask', {
    title,
    description,
    dueDate,
  });
  return response.data;
};

export const updateTaskService = async (
  id: string,
  updates: {
    title?: string;
    description?: string;
    dueDate?: string | null;
    status?: 'pending' | 'completed';
  },
): Promise<TaskResponse> => {
  const response = await api.put(`/api/v1/planner/updatetask/${id}`, updates);
  return response.data;
};

export const deleteTaskService = async (id: string) => {
  const response = await api.delete(`/api/v1/planner/deletetask/${id}`);
  return response.data;
};
