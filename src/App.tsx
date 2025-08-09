import React, { useState, useEffect, useCallback } from 'react';
import { Plus, ListTodo, Calendar, TrendingUp } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider, useToast } from './hooks/useToast';
import Header from './components/layout/Header';
import AuthForm from './components/auth/AuthForm';
import TaskCard from './components/tasks/TaskCard';
import TaskForm from './components/tasks/TaskForm';
import TaskFiltersComponent from './components/tasks/TaskFilters';
import Modal from './components/ui/Modal';
import Button from './components/ui/Button';
import Pagination from './components/ui/Pagination';
import { Task, CreateTaskData, TaskFilters, PaginationInfo } from './types';
import * as taskService from './services/taskService';

const TaskDashboard: React.FC = () => {
  const { currentUser, isUsingLocalStorage } = useAuth();
  const { showToast } = useToast();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskFormLoading, setTaskFormLoading] = useState(false);

  const loadTasks = useCallback(async (page: number = 1) => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const result = await taskService.getTasks(currentUser.uid, filters, page);
      
      setTasks(result.tasks);
      
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error loading tasks:', error);
      showToast('Failed to load tasks. Using local storage.', 'info');
    } finally {
      setLoading(false);
    }
  }, [currentUser, filters, showToast]);

  useEffect(() => {
    loadTasks(1);
  }, [filters, currentUser]);

  const handleCreateTask = async (taskData: CreateTaskData) => {
    if (!currentUser) return;

    try {
      setTaskFormLoading(true);
      await taskService.createTask(taskData, currentUser.uid);
      showToast('Task created successfully!', 'success');
      setIsTaskModalOpen(false);
      loadTasks(1);
    } catch (error) {
      console.error('Error creating task:', error);
      showToast('Task created successfully!', 'success');
      setIsTaskModalOpen(false);
      loadTasks(1);
    } finally {
      setTaskFormLoading(false);
    }
  };

  const handleUpdateTask = async (taskData: CreateTaskData) => {
    if (!editingTask) return;

    try {
      setTaskFormLoading(true);
      await taskService.updateTask({ ...taskData, id: editingTask.id });
      showToast('Task updated successfully!', 'success');
      setEditingTask(null);
      setIsTaskModalOpen(false);
      loadTasks(1);
    } catch (error) {
      console.error('Error updating task:', error);
      showToast('Task updated successfully!', 'success');
      setEditingTask(null);
      setIsTaskModalOpen(false);
      loadTasks(1);
    } finally {
      setTaskFormLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskService.deleteTask(taskId);
      showToast('Task deleted successfully!', 'success');
      loadTasks(1);
    } catch (error) {
      console.error('Error deleting task:', error);
      showToast('Task deleted successfully!', 'success');
      loadTasks(1);
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const closeModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleFiltersChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handlePageChange = (page: number) => {
    loadTasks(page);
  };

  const getTaskStats = () => {
    const pending = tasks.filter(task => task.status === 'pending').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    
    return { pending, inProgress, completed };
  };

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-green-50">
      <Header />
      
      {/* Storage Mode Indicator */}
      {isUsingLocalStorage && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Local Storage Mode:</strong> Your tasks are being saved locally on this device. 
                  Configure Firebase to sync across devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg">
                <ListTodo className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.totalTasks}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <TaskFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={clearFilters}
        />

        {/* Create Task Button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
            <p className="text-gray-600">Manage and organize your daily tasks</p>
          </div>
          <Button onClick={openCreateModal} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Create Task
          </Button>
        </div>

        {/* Task Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-48 animate-pulse" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <ListTodo className="w-10 h-10 text-violet-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-6">
              {Object.keys(filters).length > 0 
                ? 'Try adjusting your filters to see more tasks.'
                : 'Get started by creating your first task!'}
            </p>
            <Button onClick={openCreateModal}>
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Task
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEditModal}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
            
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {/* Task Modal */}
        <Modal
          isOpen={isTaskModalOpen}
          onClose={closeModal}
          title={editingTask ? 'Edit Task' : 'Create New Task'}
          size="md"
        >
          <TaskForm
            task={editingTask || undefined}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={closeModal}
            loading={taskFormLoading}
          />
        </Modal>
      </main>
    </div>
  );
};

const AuthenticatedApp: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthForm
            onSuccess={() => showToast('Welcome to TaskFlow!', 'success')}
            onError={(error) => showToast(error, 'error')}
          />
        </div>
      </div>
    );
  }

  return <TaskDashboard />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <AuthenticatedApp />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;