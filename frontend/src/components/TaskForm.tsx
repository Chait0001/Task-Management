import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TaskPriority } from '../models/types';
import { apiClient } from '../api/apiClient';
import { GlassButton } from './glass/GlassButton';

interface Props {
  onTaskAdded: () => void;
}

export const TaskForm: React.FC<Props> = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    await apiClient.createTask(title, description, priority);

    setTitle('');
    setDescription('');
    setPriority(TaskPriority.MEDIUM);
    onTaskAdded();
  };

  return (
    <>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-7">
        <motion.div
          whileHover={{ scale: 1.08, rotate: 90 }}
          whileTap={{ scale: 0.92 }}
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold cursor-default"
          style={{
            background: 'var(--badge-bg)',
            color: 'var(--accent-purple)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--glass-border-subtle)',
            boxShadow: 'var(--shadow-glass)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </motion.div>
        <h3
          className="text-lg font-bold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Create New Task
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Title */}
        <div>
          <label
            className="block text-[10px] font-bold mb-2 uppercase tracking-[0.15em]"
            style={{ color: 'var(--text-muted)' }}
          >
            Title
          </label>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label
            className="block text-[10px] font-bold mb-2 uppercase tracking-[0.15em]"
            style={{ color: 'var(--text-muted)' }}
          >
            Description
          </label>
          <textarea
            placeholder="Add some details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px] resize-y"
          />
        </div>

        {/* Priority */}
        <div>
          <label
            className="block text-[10px] font-bold mb-2 uppercase tracking-[0.15em]"
            style={{ color: 'var(--text-muted)' }}
          >
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            <option value={TaskPriority.LOW}>🟢 Low Priority</option>
            <option value={TaskPriority.MEDIUM}>🟡 Medium Priority</option>
            <option value={TaskPriority.HIGH}>🔴 High Priority</option>
          </select>
        </div>

        {/* Submit */}
        <GlassButton
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          }
        >
          Add New Task
        </GlassButton>
      </form>
    </>
  );
};
