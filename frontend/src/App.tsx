import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { ThemeToggle } from './components/ThemeToggle';
import { Task, TaskStatus } from './models/types';
import { apiClient } from './api/apiClient';
import { AmbientBackground } from './components/glass/AmbientBackground';
import { GlassCard } from './components/glass/GlassCard';
import { GlassTabs } from './components/glass/GlassTabs';
import { GlassSearchBar } from './components/glass/GlassSearchBar';
import { GlassIconButton } from './components/glass/GlassIconButton';
import { GlassFeatureCard } from './components/glass/GlassFeatureCard';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
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

  // Filter tasks by search query
  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const filterTabs = [
    { id: 'ALL', label: 'All Tasks' },
    { id: TaskStatus.PENDING, label: 'Pending' },
    { id: TaskStatus.COMPLETED, label: 'Completed' },
  ];

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
    pending: tasks.filter(t => t.status === TaskStatus.PENDING).length,
  };

  return (
    <div className="min-h-screen relative">
      {/* Ambient glow background with floating blobs */}
      <AmbientBackground />

      {/* ─── Header ─── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-20"
        style={{
          background: 'var(--header-bg)',
          borderBottom: '1px solid var(--glass-border-subtle)',
          boxShadow: 'var(--shadow-glass)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo + Date */}
          <div className="flex items-center gap-4">
            {/* Logo mark */}
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 L20 7 L20 17 L12 22 L4 17 L4 7 Z" />
                <path d="M12 8 L12 16" />
                <path d="M8 10 L16 10" />
              </svg>
            </motion.div>

            <div>
              <h1
                className="text-xl font-extrabold tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                TASKX
              </h1>
              <p
                className="text-xs font-medium mt-0.5"
                style={{ color: 'var(--text-muted)' }}
              >
                {today}
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Stats badges */}
            <div className="hidden md:flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border-subtle)',
                  color: 'var(--accent-purple)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {taskStats.total} Total
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  color: '#10b981',
                }}
              >
                {taskStats.completed} Done
              </motion.div>
            </div>

            {/* Notification button */}
            <GlassIconButton
              size="sm"
              ariaLabel="Notifications"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </GlassIconButton>

            {/* Settings button */}
            <GlassIconButton
              size="sm"
              ariaLabel="Settings"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </GlassIconButton>

            {/* Theme Toggle */}
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </div>
        </div>
      </motion.header>

      {/* ─── Main Content ─── */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">

          {/* ─── Left Panel ─── */}
          <div className="flex flex-col gap-6">
            {/* Create Task Card */}
            <GlassCard blur={28}>
              <TaskForm onTaskAdded={fetchTasks} />
            </GlassCard>

            {/* Workspace Input */}
            <GlassCard blur={24} className="!p-5">
              <div className="flex items-center gap-3">
                <GlassSearchBar
                  value=""
                  onChange={() => {}}
                  placeholder="Create workspace"
                  className="flex-1"
                />
                <GlassIconButton
                  size="sm"
                  ariaLabel="Search workspace"
                  glowColor="rgba(6, 182, 212, 0.15)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </GlassIconButton>
              </div>
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard blur={24} className="!p-5">
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-sm font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Workspace
                </span>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10b981' }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </motion.div>
              </div>
              <div
                className="w-full h-1 rounded-full overflow-hidden"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border-subtle)',
                }}
              >
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: taskStats.total > 0 ? `${(taskStats.completed / taskStats.total) * 100}%` : '0%' }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-cyan))',
                  }}
                />
              </div>
            </GlassCard>

            {/* Toast/Tabs demo */}
            <div className="flex justify-center">
              <GlassTabs
                tabs={[
                  { id: 'toast', label: 'Toast' },
                  { id: 'tabs', label: 'Tabs' },
                ]}
                activeTab="toast"
                onTabChange={() => {}}
              />
            </div>
          </div>

          {/* ─── Right Panel ─── */}
          <div className="flex flex-col gap-6">
            {/* Search + Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <GlassSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search projects..."
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <GlassIconButton
                  size="md"
                  ariaLabel="Add new"
                  glowColor="rgba(139, 92, 246, 0.15)"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </GlassIconButton>
              </div>
            </motion.div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-4 flex-wrap">
              <GlassTabs
                tabs={filterTabs}
                activeTab={filter}
                onTabChange={(id) => setFilter(id as any)}
              />
              <span
                className="text-xs font-medium ml-auto"
                style={{ color: 'var(--text-muted)' }}
              >
                {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Task list in glass panel */}
            <GlassCard blur={28} className="!p-6">
              <h2
                className="text-xl font-bold mb-6 flex items-center gap-3 tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                <span
                  className="inline-block w-1 h-6 rounded-full"
                  style={{
                    background: 'linear-gradient(180deg, var(--accent-purple), var(--accent-cyan))',
                  }}
                />
                Today's Focus
              </h2>
              <TaskList tasks={filteredTasks} onTaskUpdated={fetchTasks} />
            </GlassCard>

            {/* Bottom row: feature card + stat card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* File card */}
              <GlassCard blur={24} className="!p-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{
                      background: 'var(--badge-bg)',
                      color: 'var(--accent-purple)',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    files
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                    <line x1="6" y1="6" x2="6.01" y2="6" />
                    <line x1="6" y1="18" x2="6.01" y2="18" />
                  </svg>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  {/* Toggle track */}
                  <div
                    className="w-12 h-6 rounded-full relative cursor-pointer"
                    style={{
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                      boxShadow: 'var(--shadow-inner)',
                    }}
                  >
                    <div
                      className="absolute top-[2px] left-[2px] w-5 h-5 rounded-full"
                      style={{
                        background: 'var(--glass-bg-strong)',
                        border: '1px solid var(--glass-border)',
                        boxShadow: 'var(--shadow-glass)',
                      }}
                    />
                  </div>

                  {/* Plus button */}
                  <GlassIconButton size="sm" ariaLabel="Add file">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </GlassIconButton>
                </div>
              </GlassCard>

              {/* Invite member gradient card */}
              <GlassFeatureCard
                title="Invite member"
                subtitle="Upgrade plan"
                ctaLabel="Upgrade plan"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
