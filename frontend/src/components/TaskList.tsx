import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Task, TaskStatus } from '../models/types';
import { apiClient } from '../api/apiClient';
import { GlassTaskCard } from './glass/GlassTaskCard';

interface TaskListProps {
  tasks: Task[];
  onFocusStart?: (task: Task) => void;
  allTasks?: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onFocusStart, allTasks = [] }) => {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());



  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteTask(id),
    onSuccess: () => {
      toast.success('Task deleted!');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<Task> }) => apiClient.updateTask(id, updates as any),
    onSuccess: () => {
        toast.success('Task updated!');
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: TaskStatus }) => apiClient.updateTaskStatus(id, status),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const toggleSelect = (id: string) => {
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedIds(newSet);
  };

  const handleBulkComplete = async () => {
      for (const id of selectedIds) {
          await apiClient.markTaskComplete(id);
      }
      setSelectedIds(new Set());
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tasks completed!');
  };

  const handleBulkDelete = async () => {
      for (const id of selectedIds) {
          await apiClient.deleteTask(id);
      }
      setSelectedIds(new Set());
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tasks deleted!');
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 flex flex-col items-center">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-70">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Your slate is clean.</h3>
        <p className="text-sm opacity-70" style={{ color: 'var(--text-muted)' }}>Add your first task above to get moving.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 relative pb-20">
      <AnimatePresence mode="popLayout">
        {tasks.map((task, idx) => (
          <GlassTaskCard
            key={task.id}
            task={task}
            index={idx}
            selected={selectedIds.has(task.id)}
            onToggleSelect={toggleSelect}
            onDelete={(id) => deleteMutation.mutate(id)}
            onUpdate={(id, updates) => updateMutation.mutate({ id, updates })}
            onStatusChange={(id, status) => statusMutation.mutate({ id, status })}
            onFocusStart={() => onFocusStart?.(task)}
            allTasks={allTasks}
          />
        ))}
      </AnimatePresence>

      {/* Bulk Action Bar */}
      <AnimatePresence>
          {selectedIds.size > 0 && (
              <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-4 rounded-2xl flex items-center gap-6 z-50"
                style={{ background: 'var(--glass-bg-strong)', backdropFilter: 'blur(24px)', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-glass-lg)' }}
              >
                  <span className="font-bold text-sm">{selectedIds.size} selected</span>
                  <div className="flex gap-3">
                      <button onClick={handleBulkComplete} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: 'var(--accent-purple)', color: 'white' }}>Mark All Complete</button>
                      <button onClick={handleBulkDelete} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: '#ef444422', color: '#ef4444' }}>Delete Selected</button>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};
