import React from 'react';
import { format } from 'date-fns';
import { Calendar, Edit, Trash2, Clock, CheckCircle2, Circle, PlayCircle } from 'lucide-react';
import { Task } from '../../types';
import Button from '../ui/Button';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <PlayCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
    };

    const labels = {
      pending: 'Pending',
      'in-progress': 'In Progress',
      completed: 'Completed',
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${badges[task.status]}`}>
        {getStatusIcon()}
        <span className="ml-1">{labels[task.status]}</span>
      </span>
    );
  };

  const isOverdue = task.status !== 'completed' && new Date() > task.dueDate;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-violet-200 group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
          {getStatusBadge()}
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600' : ''}`}>
            <Calendar className="w-4 h-4" />
            <span>Due: {format(task.dueDate, 'MMM d, yyyy')}</span>
            {isOverdue && (
              <span className="text-xs font-medium bg-red-100 text-red-600 px-2 py-1 rounded-full">
                Overdue
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Created: {format(task.createdAt, 'MMM d')}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="flex-1 hover:bg-violet-50 hover:text-violet-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="flex-1 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;