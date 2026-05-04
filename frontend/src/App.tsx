import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from './hooks/useDebounce';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { ThemeToggle } from './components/ThemeToggle';
import { Task, TaskStatus, TaskPriority } from './models/types';
import { apiClient } from './api/apiClient';
import { AmbientBackground } from './components/glass/AmbientBackground';
import { GlassCard } from './components/glass/GlassCard';
import { GlassTabs } from './components/glass/GlassTabs';
import { AuthPage } from './components/AuthPage';
import { HeroSection } from './components/HeroSection';
import { useFocusMode } from './hooks/useFocusMode';
import { FocusModeOverlay } from './components/FocusModeOverlay';

function App() {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showHero, setShowHero] = useState(true);
  const [filter, setFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [sortMode, setSortMode] = useState<'priority' | 'deadline' | 'created'>('created');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Focus Mode state
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [focusSessionId, setFocusSessionId] = useState<string | null>(null);

  const focus = useFocusMode(25, async () => {
      if (focusSessionId && focusTask) {
          try {
              await apiClient.completeFocusSession(focusSessionId);
              toast.success(`Completed focus session for: ${focusTask.title}`);
              queryClient.invalidateQueries({ queryKey: ['pomodoros', focusTask.id] });
              queryClient.invalidateQueries({ queryKey: ['productivity'] });
          } catch (e) {
              toast.error('Failed to complete focus session');
          }
      }
      setFocusTask(null);
      setFocusSessionId(null);
  });

  const handleFocusStart = async (task: Task) => {
      try {
          const session = await apiClient.startFocusSession(task.id, 25);
          setFocusSessionId(session._id);
          setFocusTask(task);
          focus.start();
      } catch (err) {
          toast.error('Failed to start focus session');
      }
  };

  const handleFocusAbandon = async () => {
      if (focusSessionId) {
          try {
              await apiClient.abandonFocusSession(focusSessionId);
              toast('Focus session abandoned.', { icon: '🛑' });
          } catch (err) {}
      }
      focus.abandon();
      setFocusTask(null);
      setFocusSessionId(null);
  };

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', filter],
    queryFn: () => apiClient.getAllTasks(filter === 'ALL' ? undefined : filter as TaskStatus)
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: apiClient.getStats
  });

  const { data: projects = [] } = useQuery({
      queryKey: ['projects'],
      queryFn: apiClient.getProjects
  });

  const { data: productivityScore = 0 } = useQuery({
      queryKey: ['productivity'],
      queryFn: apiClient.getProductivityScore
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
              e.preventDefault();
              const searchEl = document.getElementById('global-search') as HTMLInputElement;
              if (searchEl) searchEl.focus();
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getPriorityWeight = (p: TaskPriority) => {
      if (p === TaskPriority.HIGH) return 3;
      if (p === TaskPriority.MEDIUM) return 2;
      return 1;
  };

  const filteredTasks = tasks
    .filter(t => t.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || t.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
    .sort((a, b) => {
        if (sortMode === 'priority') {
            return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
        } else if (sortMode === 'deadline') {
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        return 0;
    });

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const filterTabs = [
    { id: 'ALL', label: 'All Tasks' },
    { id: TaskStatus.PENDING, label: 'Pending' },
    { id: TaskStatus.IN_PROGRESS, label: 'In Progress' },
    { id: TaskStatus.COMPLETED, label: 'Completed' },
    { id: TaskStatus.OVERDUE, label: 'Overdue' },
  ];

  if (!isAuthenticated && showHero) {
    return <HeroSection onGetStarted={() => setShowHero(false)} />;
  }

  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen relative">
      <AmbientBackground />
      
      <FocusModeOverlay 
          taskTitle={focusTask?.title || ''}
          isActive={focus.isActive}
          isPaused={focus.isPaused}
          timeFormatted={focus.timeFormatted}
          progress={focus.progress}
          onPause={focus.pause}
          onResume={focus.resume}
          onAbandon={handleFocusAbandon}
      />

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-20"
        style={{ background: 'var(--header-bg)', borderBottom: '1px solid var(--glass-border-subtle)', boxShadow: 'var(--shadow-glass)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--color-primary-hover))', boxShadow: '0 4px 16px rgba(217, 119, 6, 0.3)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 L20 7 L20 17 L12 22 L4 17 L4 7 Z" />
                <path d="M12 8 L12 16" />
                <path d="M8 10 L16 10" />
              </svg>
            </motion.div>
            <div>
              <h1 className="text-2xl tracking-tight" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>TASKX</h1>
              <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>{today}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
          
          <div className="flex flex-col gap-6">
            <GlassCard blur={28}>
              <TaskForm />
            </GlassCard>

            <GlassCard blur={24} className="!p-5">
              <label className="text-sm font-bold block mb-2" style={{ color: 'var(--text-primary)' }}>Select Project</label>
              <select className="w-full px-4 py-2 rounded-lg outline-none" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}>
                  <option value="">-- Choose Project --</option>
                  {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </GlassCard>

            <GlassCard blur={24} className="!p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Quick Stats</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 rounded-lg flex flex-col items-center justify-center text-center col-span-2" style={{ background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.1), rgba(180, 83, 9, 0.05))', border: '1px solid var(--glass-border-subtle)', color: 'var(--accent-purple)' }}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-1">Productivity Score</p>
                      <p className="text-3xl font-black">{productivityScore}</p>
                  </div>
              </div>
              {stats ? (
                  <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border-subtle)' }}>
                          <p className="text-xs opacity-70">Total Tasks</p>
                          <p className="text-xl font-bold">{stats.total}</p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                          <p className="text-xs opacity-70">Completed</p>
                          <p className="text-xl font-bold">{stats.completed}</p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
                          <p className="text-xs opacity-70">In Progress</p>
                          <p className="text-xl font-bold">{stats.inProgress}</p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
                          <p className="text-xs opacity-70">Overdue</p>
                          <p className="text-xl font-bold">{stats.overdue}</p>
                      </div>
                  </div>
              ) : (
                  <p className="text-sm opacity-50">Loading stats...</p>
              )}
            </GlassCard>
          </div>

          <div className="flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex-1 relative">
                  <input
                      id="global-search"
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search tasks (Cmd+K)"
                      className="w-full pl-10 pr-4 py-3 rounded-xl outline-none"
                      style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                  />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </div>
              <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Sort by:</span>
                  <select 
                      value={sortMode}
                      onChange={(e) => setSortMode(e.target.value as any)}
                      className="px-3 py-2 rounded-lg outline-none text-sm"
                      style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                  >
                      <option value="created">Created</option>
                      <option value="priority">Priority</option>
                      <option value="deadline">Deadline</option>
                  </select>
              </div>
            </motion.div>

            <div className="flex items-center gap-4 flex-wrap">
              <GlassTabs tabs={filterTabs} activeTab={filter} onTabChange={(id) => setFilter(id as TaskStatus | 'ALL')} />
              <span className="text-xs font-medium ml-auto" style={{ color: 'var(--text-muted)' }}>{filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}</span>
            </div>

            <GlassCard blur={28} className="!p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                <span className="inline-block w-1 h-6 rounded-full bg-amber-500" />
                Today's Focus
              </h2>
              {/* @ts-ignore */}
              <TaskList tasks={filteredTasks} onFocusStart={handleFocusStart} allTasks={tasks} />
            </GlassCard>
            
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
