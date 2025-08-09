import { Task, CreateTaskData, UpdateTaskData, TaskFilters, PaginationInfo } from '../types';

const TASKS_KEY = 'taskflow_tasks';
const USER_KEY = 'taskflow_user';
const TASKS_PER_PAGE = 6;

// Generate a simple UUID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get current user from localStorage
const getCurrentUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Get all tasks from localStorage
const getAllTasks = (): Task[] => {
  const tasks = localStorage.getItem(TASKS_KEY);
  if (!tasks) return [];
  
  try {
    const parsedTasks = JSON.parse(tasks);
    return parsedTasks.map((task: any) => ({
      ...task,
      dueDate: new Date(task.dueDate),
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    }));
  } catch {
    return [];
  }
};

// Save tasks to localStorage
const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

// Filter tasks based on criteria
const filterTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
  return tasks.filter(task => {
    if (filters.status && task.status !== filters.status) {
      return false;
    }
    
    if (filters.dueDateStart && task.dueDate < filters.dueDateStart) {
      return false;
    }
    
    if (filters.dueDateEnd && task.dueDate > filters.dueDateEnd) {
      return false;
    }
    
    return true;
  });
};

export const createTask = async (taskData: CreateTaskData, userId: string): Promise<string> => {
  const tasks = getAllTasks();
  const now = new Date();
  
  const newTask: Task = {
    id: generateId(),
    ...taskData,
    userId,
    createdAt: now,
    updatedAt: now,
  };
  
  tasks.push(newTask);
  saveTasks(tasks);
  
  return newTask.id;
};

export const getTasks = async (
  userId: string,
  filters: TaskFilters = {},
  page: number = 1
): Promise<{ tasks: Task[]; pagination: PaginationInfo }> => {
  const allTasks = getAllTasks();
  const userTasks = allTasks.filter(task => task.userId === userId);
  const filteredTasks = filterTasks(userTasks, filters);
  
  // Sort by creation date (newest first)
  filteredTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  const totalTasks = filteredTasks.length;
  const totalPages = Math.ceil(totalTasks / TASKS_PER_PAGE);
  const startIndex = (page - 1) * TASKS_PER_PAGE;
  const endIndex = startIndex + TASKS_PER_PAGE;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);
  
  const pagination: PaginationInfo = {
    currentPage: page,
    totalPages,
    totalTasks,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
  
  return { tasks: paginatedTasks, pagination };
};

export const updateTask = async (taskData: UpdateTaskData): Promise<void> => {
  const tasks = getAllTasks();
  const taskIndex = tasks.findIndex(task => task.id === taskData.id);
  
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }
  
  const { id, ...updateData } = taskData;
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updateData,
    updatedAt: new Date(),
  };
  
  saveTasks(tasks);
};

export const deleteTask = async (taskId: string): Promise<void> => {
  const tasks = getAllTasks();
  const filteredTasks = tasks.filter(task => task.id !== taskId);
  saveTasks(filteredTasks);
};

// Auth functions for localStorage
export const loginUser = async (email: string, password: string) => {
  // Simple validation - in a real app, you'd want proper authentication
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  const user = {
    uid: generateId(),
    email,
    displayName: email.split('@')[0],
  };
  
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
};

export const signupUser = async (email: string, password: string) => {
  // Simple validation
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  const user = {
    uid: generateId(),
    email,
    displayName: email.split('@')[0],
  };
  
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
};

export const logoutUser = async () => {
  localStorage.removeItem(USER_KEY);
};

export const getCurrentUserFromStorage = () => {
  return getCurrentUser();
};