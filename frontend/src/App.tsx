import { useEffect, useState } from 'react';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { ThemeToggle } from './components/ThemeToggle';
import { Task, TaskStatus } from './models/types';
import { apiClient } from './api/apiClient';
import { DottedGlowBackground } from './components/ui/dotted-glow-background';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sync dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const fetchTasks = async () => {
    try {
      const statusParam = filter === 'ALL' ? undefined : filter as TaskStatus;
      const data = await apiClient.getAllTasks(statusParam);
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen relative">
      {/* Dotted glow background — adapts to theme */}
      <DottedGlowBackground
        className="pointer-events-none fixed inset-0 -z-10"
        color={isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(124, 58, 237, 0.12)'}
        glowColor={isDark ? 'rgba(167, 139, 250, 0.5)' : 'rgba(139, 92, 246, 0.35)'}
        opacity={1}
        radius={1.5}
        gap={15}
        speedMin={0.4}
        speedMax={1.5}
      />

      {/* ─── Header ─── */}
      <header
        className="sticky top-0 z-20 transition-all duration-300"
        style={{
          background: 'var(--header-bg)',
          borderBottom: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              TASKX
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{today}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Filter */}
            <div className="hidden sm:flex items-center gap-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Filter
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="!w-auto !py-2 !px-3 !text-sm !rounded-lg"
              >
                <option value="ALL">All Tasks</option>
                <option value={TaskStatus.PENDING}>Pending</option>
                <option value={TaskStatus.COMPLETED}>Completed</option>
              </select>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </div>
        </div>
      </header>

      {/* ─── Mobile Filter (shown below header on small screens) ─── */}
      <div className="sm:hidden max-w-7xl mx-auto px-6 pt-4">
        <div className="flex items-center gap-2.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Filter
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="!flex-1 !py-2 !px-3 !text-sm !rounded-lg"
          >
            <option value="ALL">All Tasks</option>
            <option value={TaskStatus.PENDING}>Pending</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
          </select>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
          {/* Left Panel — Create Task */}
          <div className="glass-panel rounded-2xl p-7 h-fit">
            <TaskForm onTaskAdded={fetchTasks} />
          </div>

          {/* Right Panel — Task List */}
          <div className="glass-panel rounded-2xl p-7">
            <h2
              className="text-xl font-semibold mb-6 flex items-center gap-2"
              style={{ color: 'var(--text-primary)' }}
            >
              <span className="inline-block w-1 h-6 rounded-full" style={{ background: 'var(--border-accent)' }} />
              Today's Focus
            </h2>
            <TaskList tasks={tasks} onTaskUpdated={fetchTasks} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
