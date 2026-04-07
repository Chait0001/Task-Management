import { useEffect, useState } from 'react';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { Task, TaskStatus } from './models/types';
import { apiClient } from './api/apiClient';
import { DottedGlowBackground } from './components/ui/dotted-glow-background';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskStatus | 'ALL'>('ALL');

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

  return (
    <div className="max-w-6xl mx-auto py-12 px-5 relative z-10">
      <DottedGlowBackground 
        className="pointer-events-none fixed inset-0 -z-10"
        color="rgba(148, 163, 184, 0.2)"
        glowColor="rgba(56, 189, 248, 0.6)"
        opacity={1}
        radius={1.5}
        gap={15}
        speedMin={0.4}
        speedMax={1.5}
      />
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Task Management</h1>
        <p className="text-slate-400 text-lg">Built with strictly encapsulated OOP architecture</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-10">
        <div className="bg-slate-800/70 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-8">
          <TaskForm onTaskAdded={fetchTasks} />
        </div>
        
        <div className="bg-slate-800/70 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <label className="font-medium text-slate-400">Filter Tasks:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="w-[150px] !mb-0 !py-2">
              <option value="ALL">All Tasks</option>
              <option value={TaskStatus.PENDING}>Pending</option>
              <option value={TaskStatus.COMPLETED}>Completed</option>
            </select>
          </div>
          
          <TaskList tasks={tasks} onTaskUpdated={fetchTasks} />
        </div>
      </div>
    </div>
  );
}

export default App;
