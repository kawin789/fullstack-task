import React from 'react';
import { Filter, X } from 'lucide-react';
import { TaskFilters } from '../../types';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Input from '../ui/Input';

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  onClearFilters: () => void;
}

const TaskFiltersComponent: React.FC<TaskFiltersProps> = ({ filters, onFiltersChange, onClearFilters }) => {
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const hasActiveFilters = filters.status || filters.dueDateStart || filters.dueDateEnd;

  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (field: 'dueDateStart' | 'dueDateEnd', value: string) => {
    const date = value ? new Date(value) : undefined;
    onFiltersChange({
      ...filters,
      [field]: date,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-violet-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter Tasks</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Status"
          value={filters.status || ''}
          onChange={(e) => onFiltersChange({
            ...filters,
            status: e.target.value as any || undefined,
          })}
          options={statusOptions}
        />

        <Input
          label="Due Date From"
          type="date"
          value={formatDateForInput(filters.dueDateStart)}
          onChange={(e) => handleDateChange('dueDateStart', e.target.value)}
          helperText="Show tasks due on or after this date"
        />

        <Input
          label="Due Date To"
          type="date"
          value={formatDateForInput(filters.dueDateEnd)}
          onChange={(e) => handleDateChange('dueDateEnd', e.target.value)}
          helperText="Show tasks due on or before this date"
        />
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.status && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-violet-100 text-violet-700 border border-violet-200">
              Status: {statusOptions.find(opt => opt.value === filters.status)?.label}
              <button
                onClick={() => onFiltersChange({ ...filters, status: undefined })}
                className="ml-1 hover:text-violet-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.dueDateStart && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 border border-green-200">
              From: {formatDateForInput(filters.dueDateStart)}
              <button
                onClick={() => onFiltersChange({ ...filters, dueDateStart: undefined })}
                className="ml-1 hover:text-green-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.dueDateEnd && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 border border-green-200">
              To: {formatDateForInput(filters.dueDateEnd)}
              <button
                onClick={() => onFiltersChange({ ...filters, dueDateEnd: undefined })}
                className="ml-1 hover:text-green-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskFiltersComponent;