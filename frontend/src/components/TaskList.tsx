import React from 'react';
import { Task, TaskStatus } from '../models/types';
import { apiClient } from '../api/apiClient';

interface Props {
  tasks: Task[];
  onTaskUpdated: () => void;
}

const priorityStyles: Record<string, { label: string; bgVar: string; textVar: string }> = {
  High:   { label: 'Urgent',  bgVar: 'var(--badge-high-bg)',   textVar: 'var(--badge-high-text)' },
  Medium: { label: 'Medium',  bgVar: 'var(--badge-medium-bg)', textVar: 'var(--badge-medium-text)' },
  Low:    { label: 'Low',     bgVar: 'var(--badge-low-bg)',     textVar: 'var(--badge-low-text)' },
};

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
      <div className="text-center py-16">
        <div className="text-5xl mb-4 opacity-30">📋</div>
        <p className="text-base font-medium" style={{ color: 'var(--text-muted)' }}>
          No tasks found
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Create a new task to get started
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => {
        const done = task.status === TaskStatus.COMPLETED;
        const prio = priorityStyles[task.priority] ?? priorityStyles.Medium;

        return (
          <div
            key={task.id}
            className="group rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: done ? 'var(--complete-bg)' : 'var(--bg-card)',
              borderLeft: `4px solid ${done ? 'var(--complete-border)' : 'var(--border-accent)'}`,
              border: `1px solid var(--border-color)`,
              borderLeftWidth: '4px',
              borderLeftColor: done ? 'var(--complete-border)' : 'var(--border-accent)',
              boxShadow: 'var(--shadow)',
              opacity: done ? 0.75 : 1,
            }}
          >
            <div className="flex items-start gap-4">
              {/* ── Checkbox ── */}
              <button
                onClick={() => !done && handleComplete(task.id)}
                className="mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110"
                style={{
                  borderColor: done ? 'var(--checkbox-checked)' : 'var(--checkbox-border)',
                  background: done ? 'var(--checkbox-checked)' : 'transparent',
                }}
                aria-label={done ? 'Completed' : 'Mark as complete'}
              >
                {done && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>

              {/* ── Content ── */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h4
                    className={`text-base font-semibold leading-snug ${done ? 'line-through' : ''}`}
                    style={{ color: done ? 'var(--text-muted)' : 'var(--text-primary)' }}
                  >
                    {task.title}
                  </h4>
                  <span
                    className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex-shrink-0"
                    style={{ background: prio.bgVar, color: prio.textVar }}
                  >
                    {prio.label}
                  </span>
                </div>

                {task.description && (
                  <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {task.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    {done ? '✓ Completed' : '○ Pending'}
                  </span>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200 hover:underline cursor-pointer px-2 py-1 rounded-lg"
                    style={{ color: 'var(--delete-text)' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
