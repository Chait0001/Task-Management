import React from 'react';
import { motion } from 'framer-motion';
import { Task, TaskStatus } from '../../models/types';

interface GlassTaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  index?: number;
}

const priorityConfig: Record<string, {
  label: string;
  textColor: string;
  bgColor: string;
  dotColor: string;
  glowColor: string;
}> = {
  High: {
    label: 'Urgent',
    textColor: 'var(--badge-high-text)',
    bgColor: 'var(--badge-high-bg)',
    dotColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.08)',
  },
  Medium: {
    label: 'Medium',
    textColor: 'var(--badge-medium-text)',
    bgColor: 'var(--badge-medium-bg)',
    dotColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.08)',
  },
  Low: {
    label: 'Low',
    textColor: 'var(--badge-low-text)',
    bgColor: 'var(--badge-low-bg)',
    dotColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.08)',
  },
};

export const GlassTaskCard: React.FC<GlassTaskCardProps> = ({
  task,
  onComplete,
  onDelete,
  index = 0,
}) => {
  const done = task.status === TaskStatus.COMPLETED;
  const prio = priorityConfig[task.priority] ?? priorityConfig.Medium;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -3,
        scale: 1.008,
        transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
      }}
      className="group relative rounded-2xl p-5 cursor-default"
      style={{
        background: done ? 'var(--complete-bg)' : 'var(--glass-bg)',
        border: `1px solid ${done ? 'rgba(16, 185, 129, 0.2)' : 'var(--glass-border-subtle)'}`,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: done ? 'var(--shadow-glass)' : 'var(--shadow-glass-lg)',
        opacity: done ? 0.65 : 1,
        transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
      }}
    >
      {/* Top rim light */}
      <div
        className="absolute top-0 left-[8%] right-[8%] h-px rounded-full pointer-events-none"
        style={{
          background: done
            ? 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.3), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
        }}
      />

      {/* Left accent bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
        style={{
          background: done
            ? 'var(--complete-border)'
            : `linear-gradient(180deg, ${prio.dotColor}88, transparent)`,
          opacity: 0.9,
        }}
      />

      <div className="flex items-start gap-4">
        {/* Checkbox (glass circle with depth) */}
        <motion.button
          onClick={() => !done && onComplete(task.id)}
          whileHover={!done ? {
            scale: 1.15,
            boxShadow: `0 0 0 4px ${prio.glowColor}, var(--shadow-glass)`,
          } : undefined}
          whileTap={!done ? { scale: 0.88 } : undefined}
          className="mt-0.5 w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center cursor-pointer"
          style={{
            background: done ? 'var(--checkbox-checked)' : 'var(--glass-bg)',
            border: `2px solid ${done ? 'var(--checkbox-checked)' : 'var(--checkbox-border)'}`,
            backdropFilter: 'blur(12px)',
            boxShadow: done
              ? 'var(--shadow-glow-purple)'
              : 'var(--shadow-glass), inset 0 1px 0 rgba(255,255,255,0.2)',
            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
          aria-label={done ? 'Completed' : 'Mark as complete'}
        >
          {done && (
            <motion.svg
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </motion.svg>
          )}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h4
              className={`text-[15px] font-semibold leading-snug ${done ? 'line-through' : ''}`}
              style={{ color: done ? 'var(--text-muted)' : 'var(--text-primary)' }}
            >
              {task.title}
            </h4>

            {/* Priority badge (glass pill) */}
            <span
              className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0"
              style={{
                background: prio.bgColor,
                color: prio.textColor,
                backdropFilter: 'blur(8px)',
                border: `1px solid ${prio.dotColor}18`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1)`,
              }}
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
            <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
              {done ? (
                <>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Completed
                </>
              ) : (
                <>
                  <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: prio.dotColor }} />
                  Pending
                </>
              )}
            </span>

            {/* Delete button (glass pill with inset press) */}
            <motion.button
              onClick={() => onDelete(task.id)}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 2px 12px rgba(239, 68, 68, 0.12)',
              }}
              whileTap={{
                scale: 0.95,
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
              }}
              className="
                text-xs font-semibold opacity-0 group-hover:opacity-100
                transition-all duration-300
                cursor-pointer px-3 py-1.5 rounded-full
              "
              style={{
                color: 'var(--delete-text)',
                background: 'rgba(239, 68, 68, 0.06)',
                border: '1px solid rgba(239, 68, 68, 0.12)',
                backdropFilter: 'blur(8px)',
              }}
            >
              Delete
            </motion.button>
          </div>
        </div>

        {/* Arrow action button */}
        <motion.button
          whileHover={{
            scale: 1.12,
            x: 2,
            boxShadow: 'var(--shadow-glass-lg), 0 0 0 3px rgba(139, 92, 246, 0.08)',
          }}
          whileTap={{
            scale: 0.9,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.08)',
          }}
          onClick={() => !done && onComplete(task.id)}
          className="glass-icon-btn w-8 h-8 flex-shrink-0 mt-0.5"
          style={{ opacity: done ? 0.25 : 0.5 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};
