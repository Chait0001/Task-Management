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
    
    // Clear forms and notify parent
    setTitle('');
    setDescription('');
    setPriority(TaskPriority.MEDIUM);
    onTaskAdded();
  };

  return (
    <>
      <h3 className="text-xl font-semibold mb-6">Create New Task</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <input 
            type="text" 
            placeholder="Task Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            className="w-full bg-slate-900/60 border border-white/10 rounded-lg text-slate-100 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
        <div>
          <textarea 
            placeholder="Description..." 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="w-full min-h-[100px] bg-slate-900/60 border border-white/10 rounded-lg text-slate-100 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-y"
          />
        </div>
        <div>
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full bg-slate-900/60 border border-white/10 rounded-lg text-slate-100 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          >
            <option value={TaskPriority.LOW}>Low Priority</option>
            <option value={TaskPriority.MEDIUM}>Medium Priority</option>
            <option value={TaskPriority.HIGH}>High Priority</option>
          </select>
        </div>
        <button type="submit" className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]">
          Add Task
        </button>
      </form>
    </>
  );
};
