export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: Date;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  id: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export interface TaskFilters {
  status?: 'pending' | 'in-progress' | 'completed';
  dueDateStart?: Date;
  dueDateEnd?: Date;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalTasks: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}