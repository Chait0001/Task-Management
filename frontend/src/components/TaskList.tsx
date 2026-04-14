import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Task } from '../models/types';
import { apiClient } from '../api/apiClient';
import { GlassTaskCard } from './glass/GlassTaskCard';

interface Props {
  tasks: Task[];
  onTaskUpdated: () => void;
}

export const TaskList: React.FC<Props> = ({ tasks, onTaskUpdated }) => {
  const handleComplete = async (id: string) => {
    await apiClient.markTaskComplete(id);
    onTaskUpdated();
  };

  const handleDelete = async (id: string) => {
    await apiClient.deleteTask(id);
    onTaskUpdated();
  };

  /* Empty state */
  if (tasks.length === 0) {
    return (
      <div className="text-center py-20">
        <div
          className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border-subtle)',
            backdropFilter: 'blur(16px)',
            boxShadow: 'var(--shadow-glass)',
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--text-muted)', opacity: 0.5 }}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
        </div>
        <p className="text-base font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
          No tasks found
        </p>
        <p className="text-sm" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
          Create a new task to get started
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task, idx) => (
          <GlassTaskCard
            key={task.id}
            task={task}
            onComplete={handleComplete}
            onDelete={handleDelete}
            index={idx}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
