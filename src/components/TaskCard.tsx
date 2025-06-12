import React from 'react';
import { CheckCircle2, Circle, Edit3, Trash2, Clock, AlertCircle, ArrowUp } from 'lucide-react';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <ArrowUp className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'low':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-amber-500 bg-amber-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 border-l-4 ${getPriorityColor(task.priority)} p-4 hover:shadow-md transition-all duration-200 group`}>
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className="flex-shrink-0 mt-1 transition-colors hover:scale-110 transform duration-200"
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 hover:text-emerald-500" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {getPriorityIcon(task.priority)}
            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'} truncate`}>
              {task.title}
            </h3>
          </div>
          
          {task.description && (
            <p className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'} mb-2`}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
              {task.updatedAt !== task.createdAt && (
                <>
                  <span>•</span>
                  <span>Updated {new Date(task.updatedAt).toLocaleDateString()}</span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit task"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};