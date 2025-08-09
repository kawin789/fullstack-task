import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CreateTaskData, Task } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, loading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateTaskData>();

  useEffect(() => {
    if (task) {
      setValue('title', task.title);
      setValue('description', task.description);
      setValue('status', task.status);
      setValue('dueDate', new Date(task.dueDate.toISOString().split('T')[0]) as any);
    }
  }, [task, setValue]);

  const handleFormSubmit = async (data: CreateTaskData) => {
    try {
      await onSubmit({
        ...data,
        dueDate: new Date(data.dueDate),
      });
      if (!task) {
        reset();
      }
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        label="Task Title"
        placeholder="Enter task title"
        {...register('title', {
          required: 'Task title is required',
          minLength: {
            value: 3,
            message: 'Title must be at least 3 characters',
          },
          maxLength: {
            value: 100,
            message: 'Title must be less than 100 characters',
          },
        })}
        error={errors.title?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          rows={4}
          placeholder="Enter task description (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 hover:border-gray-400 resize-none"
          {...register('description', {
            maxLength: {
              value: 500,
              message: 'Description must be less than 500 characters',
            },
          })}
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.description.message}
          </p>
        )}
      </div>

      <Select
        label="Status"
        options={statusOptions}
        {...register('status', { required: 'Status is required' })}
        error={errors.status?.message}
      />

      <Input
        label="Due Date"
        type="date"
        {...register('dueDate', {
          required: 'Due date is required',
          validate: (value) => {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selectedDate >= today || 'Due date must be in the future';
          },
        })}
        error={errors.dueDate?.message}
        helperText="Select when this task should be completed"
      />

      <div className="flex space-x-3 pt-4">
        <Button
          type="submit"
          className="flex-1"
          loading={loading}
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;