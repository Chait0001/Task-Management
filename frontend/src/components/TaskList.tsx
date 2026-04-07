import React from 'react';
import { Task, TaskStatus } from '../models/types';
import { apiClient } from '../api/apiClient';

interface Props {
  tasks: Task[];
  onTaskUpdated: () => void;
}

export const TaskList: React.FC<Props> = ({ tasks, onTaskUpdated }) => {
  const handleMarkComplete = async (id: string) => {
    await apiClient.markTaskComplete(id);
    onTaskUpdated();
  };

  return (
    <div>
      {tasks.length === 0 ? <p className="text-slate-400">No tasks found in this view.</p> : (
        <div className="flex flex-col gap-5">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`bg-white/5 border border-white/10 rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-2xl ${task.status === TaskStatus.COMPLETED ? 'border-emerald-500 bg-emerald-500/10' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-semibold m-0">{task.title}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 ${task.priority === 'High' ? 'bg-red-500/20 text-red-300' : task.priority === 'Medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'}`}>
                    {task.priority}
                </span>
              </div>
              <p className="text-slate-400 mb-6">{task.description || "No description provided."}</p>
              
              <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <span className="text-sm font-medium text-slate-400">Status: <strong className={task.status === TaskStatus.COMPLETED ? 'text-emerald-500' : 'text-slate-100'}>{task.status}</strong></span>
                <div className="flex gap-3">
                  {task.status !== TaskStatus.COMPLETED && (
                    <button className="bg-transparent border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors" onClick={() => handleMarkComplete(task.id)}>
                      Mark Complete
                    </button>
                  )}
                  <button 
                    className="bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    onClick={async () => { await apiClient.deleteTask(task.id); onTaskUpdated(); }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
