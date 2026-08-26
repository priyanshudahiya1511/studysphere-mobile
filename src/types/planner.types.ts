export interface Task {
  _id: string;
  owner: string;
  title: string;
  description: string;
  dueDate: string | null;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface GetTasksResponse {
  count: number;
  tasks: Task[];
}

export interface TaskResponse {
  message: string;
  task: Task;
}
