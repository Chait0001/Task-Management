import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Task, TaskStatus, TaskPriority } from '../../models/types';
import { GlassButton } from './GlassButton';
import { apiClient } from '../../api/apiClient';

interface GlassTaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Task>) => void;
  onStatusChange?: (id: string, status: TaskStatus) => void;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  index?: number;
  onFocusStart?: () => void;
  allTasks?: Task[];
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
  onDelete,
  onUpdate,
  onStatusChange,
  selected = false,
  onToggleSelect,
  index = 0,
  onFocusStart,
  allTasks = []
}) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [selectedDep, setSelectedDep] = useState<string>('');

  const { data: pomodoros = 0 } = useQuery({
      queryKey: ['pomodoros', task.id],
      queryFn: () => apiClient.getTaskPomodoros(task.id)
  });

  const done = task.status === TaskStatus.COMPLETED;
  const prio = priorityConfig[task.priority] ?? priorityConfig.Medium;
  const deadlineDate = new Date(task.deadline);
  const isOverdue = deadlineDate < new Date() && !done;
  const daysLeft = Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  
  // Check if any of the blockedBy tasks are not completed
  // Wait, task.blockedBy just has ObjectIds. If we want to strictly lock, we should check if they are incomplete.
  // The backend might just send the array of IDs. If length > 0, we can assume it's blocked by *something*.
  // But truly it's unblocked if all dependencies are COMPLETED.
  // For simplicity, we can fetch dependencies status or assume it's blocked if `blockedBy` has entries.
  // Actually, we have `allTasks`. We can check if any `blockedBy` task in `allTasks` is NOT COMPLETED.
  const isBlocked = task.blockedBy && task.blockedBy.some(blockerId => {
      const blocker = allTasks.find(t => t.id === blockerId);
      return blocker && blocker.status !== TaskStatus.COMPLETED;
  });

  const handleSave = () => {
      if (onUpdate) {
          onUpdate(task.id, { title: editTitle, description: editDesc, priority: editPriority });
      }
      setIsEditing(false);
  };

  const handleStatusCycle = () => {
      if (isBlocked) {
          toast.error("Task is blocked by dependencies!");
          return;
      }
      if (!onStatusChange) return;
      if (task.status === TaskStatus.PENDING) onStatusChange(task.id, TaskStatus.IN_PROGRESS);
      else if (task.status === TaskStatus.IN_PROGRESS) onStatusChange(task.id, TaskStatus.COMPLETED);
      else if (task.status === TaskStatus.COMPLETED) onStatusChange(task.id, TaskStatus.PENDING);
      else if (task.status === TaskStatus.OVERDUE) onStatusChange(task.id, TaskStatus.IN_PROGRESS);
  };

  const handleAddDependency = async () => {
      if (!selectedDep) return;
      try {
          await apiClient.addDependency(task.id, selectedDep);
          toast.success("Dependency linked.");
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
          setSelectedDep('');
      } catch (e: any) {
          toast.error(e.response?.data?.error || "Failed to add dependency.");
      }
  };

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
      className={`group relative rounded-2xl p-5 ${selected ? 'ring-2 ring-emerald-500' : ''}`}
      style={{
        background: done ? 'var(--complete-bg)' : 'var(--glass-bg)',
        border: `1px solid ${done ? 'rgba(16, 185, 129, 0.2)' : 'var(--glass-border-subtle)'}`,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: done ? 'var(--shadow-glass)' : 'var(--shadow-glass-lg)',
        opacity: done ? 0.65 : (isBlocked ? 0.5 : 1),
        transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s, opacity 0.3s',
      }}
    >
      <div
        className="absolute top-0 left-[8%] right-[8%] h-px rounded-full pointer-events-none"
        style={{
          background: done
            ? 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.3), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
        }}
      />

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
        {onToggleSelect && (
            <input 
                type="checkbox" 
                checked={selected}
                onChange={() => onToggleSelect(task.id)}
                className="mt-1 w-5 h-5 rounded cursor-pointer"
                disabled={isBlocked}
            />
        )}

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div key="editing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
                <input 
                  type="text" 
                  value={editTitle} 
                  onChange={e => setEditTitle(e.target.value)} 
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                />
                <textarea 
                  value={editDesc} 
                  onChange={e => setEditDesc(e.target.value)} 
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none min-h-[60px]"
                  style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                />
                <select 
                  value={editPriority} 
                  onChange={e => setEditPriority(e.target.value as TaskPriority)} 
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                >
                  <option value={TaskPriority.LOW}>Low</option>
                  <option value={TaskPriority.MEDIUM}>Medium</option>
                  <option value={TaskPriority.HIGH}>High</option>
                </select>
                
                <div className="flex gap-2 items-center">
                    <select 
                        value={selectedDep}
                        onChange={e => setSelectedDep(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                        style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                    >
                        <option value="">-- Link Dependency --</option>
                        {allTasks.filter(t => t.id !== task.id).map(t => (
                            <option key={t.id} value={t.id}>{t.title}</option>
                        ))}
                    </select>
                    <GlassButton size="sm" onClick={handleAddDependency}>Link</GlassButton>
                </div>

                <div className="flex gap-2 mt-2">
                  <GlassButton size="sm" onClick={handleSave} variant="primary">Save</GlassButton>
                  <GlassButton size="sm" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</GlassButton>
                </div>
              </motion.div>
            ) : (
              <motion.div key="viewing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h4
                    className={`text-[15px] font-semibold leading-snug flex items-center gap-2 ${done ? 'line-through' : ''}`}
                    style={{ color: done ? 'var(--text-muted)' : 'var(--text-primary)' }}
                  >
                    {isBlocked && <span title="Blocked by dependency">🔒</span>}
                    {task.title}
                  </h4>

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
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {isOverdue && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444' }}>
                          ⚠️ Overdue
                      </span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: 'var(--glass-bg)', color: 'var(--text-muted)', border: '1px solid var(--glass-border-subtle)' }}>
                      Due in {daysLeft} days
                  </span>
                  {pomodoros > 0 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1" style={{ background: '#f59e0b22', color: '#f59e0b', border: '1px solid #f59e0b44' }}>
                          🍅 ×{pomodoros}
                      </span>
                  )}
                  {task.tags?.map(t => (
                      <span key={t._id} className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: `${t.color}22`, color: t.color, border: `1px solid ${t.color}44` }}>
                          {t.name}
                      </span>
                  ))}
                  {task.blockedBy && task.blockedBy.length > 0 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: '#64748b22', color: '#64748b', border: '1px solid #64748b44' }}>
                          🔗 {task.blockedBy.length} Dep{task.blockedBy.length !== 1 ? 's' : ''}
                      </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                      <button 
                          onClick={handleStatusCycle}
                          disabled={isBlocked && !done}
                          className={`text-xs font-medium flex items-center gap-1.5 px-2 py-1 rounded-full transition-colors ${isBlocked && !done ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5 cursor-pointer'}`} 
                          style={{ color: 'var(--text-muted)', border: '1px solid var(--glass-border-subtle)' }}
                      >
                          {task.status === TaskStatus.PENDING && <><span className="inline-block w-2 h-2 rounded-full bg-amber-500" /> Pending</>}
                          {task.status === TaskStatus.IN_PROGRESS && <><span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> In Progress</>}
                          {task.status === TaskStatus.COMPLETED && <><span className="inline-block w-2 h-2 rounded-full bg-emerald-500" /> Completed</>}
                          {task.status === TaskStatus.OVERDUE && <><span className="inline-block w-2 h-2 rounded-full bg-red-500" /> Overdue</>}
                      </button>

                      {!done && (
                          <button
                              onClick={onFocusStart}
                              disabled={isBlocked}
                              className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${isBlocked ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105'}`}
                              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)' }}
                          >
                              🎯 Focus
                          </button>
                      )}
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setIsEditing(true)} className="text-xs px-2 py-1 rounded" style={{ color: 'var(--text-primary)', background: 'var(--glass-bg)' }}>Edit</button>
                    <button onClick={() => onDelete(task.id)} className="text-xs px-2 py-1 rounded" style={{ color: '#ef4444', background: '#ef444422' }}>Delete</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
