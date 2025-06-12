import React from 'react';
import { X, Filter } from 'lucide-react';
import { Priority } from '../types/task';

interface FilterPanelProps {
  filter: {
    completed?: boolean;
    priority?: Priority;
  };
  onFilterChange: (filter: { completed?: boolean; priority?: Priority }) => void;
  onClose: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filter, onFilterChange, onClose }) => {
  const handleCompletedFilter = (completed?: boolean) => {
    onFilterChange({ ...filter, completed });
  };

  const handlePriorityFilter = (priority?: Priority) => {
    onFilterChange({ ...filter, priority });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = filter.completed !== undefined || filter.priority !== undefined;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Filter Tasks</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Completion Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="completed"
                checked={filter.completed === undefined}
                onChange={() => handleCompletedFilter(undefined)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">All Tasks</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="completed"
                checked={filter.completed === false}
                onChange={() => handleCompletedFilter(false)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Pending</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="completed"
                checked={filter.completed === true}
                onChange={() => handleCompletedFilter(true)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Completed</span>
            </label>
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Priority</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="priority"
                checked={filter.priority === undefined}
                onChange={() => handlePriorityFilter(undefined)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">All Priorities</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="priority"
                checked={filter.priority === 'high'}
                onChange={() => handlePriorityFilter('high')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">High Priority</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="priority"
                checked={filter.priority === 'medium'}
                onChange={() => handlePriorityFilter('medium')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Medium Priority</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="priority"
                checked={filter.priority === 'low'}
                onChange={() => handlePriorityFilter('low')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Low Priority</span>
            </label>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};