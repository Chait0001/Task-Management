import React, { useState } from 'react';
import { TaskPriority } from '../models/types';
import { apiClient } from '../api/apiClient';

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
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
          style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)' }}
        >
          +
        </div>
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Create New Task
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Title */}
        <div>
          <label
            className="block text-[11px] font-semibold mb-1.5 uppercase tracking-widest"
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
            className="block text-[11px] font-semibold mb-1.5 uppercase tracking-widest"
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
            className="block text-[11px] font-semibold mb-1.5 uppercase tracking-widest"
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
        <button
          type="submit"
          style={{ background: 'var(--btn-bg)', color: 'var(--btn-text)' }}
          className="mt-1 w-full font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 hover:brightness-110 active:scale-[0.98] shadow-lg cursor-pointer"
        >
          + Add New Task
        </button>
      </form>
    </>
  );
};
