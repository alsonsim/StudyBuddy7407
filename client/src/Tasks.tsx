import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from './AuthContext';

import {
  BarChart3,
  Calendar,
  Users,
  Bell,
  Plus,
  Clock,
  Settings,
  HelpCircle,
  User,
  LogOut,
  Search,
  Flame,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  ListTodo,
  Zap,
  Edit,
  Trash2,
  Star,
  Filter,
  X,
  CalendarDays,
  Tag,
  Archive
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  category: string;
  createdAt: string;
  userId: string;
}

export default function Tasks() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [avatarURL, setAvatarURL] = useState<string | null>(null);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Form state for new/edit task
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    category: 'General'
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setName(userData.name || user.displayName || 'User');
            setAvatarURL(userData.avatarURL || user.photoURL);
          } else {
            setName(user.displayName || 'User');
            setAvatarURL(user.photoURL);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          setName(user.displayName || 'User');
          setAvatarURL(user.photoURL);
        }
      }
    };

    loadUserData();
  }, [user]);

  // Load tasks from localStorage
  useEffect(() => {
    if (!user) return;

    const savedTasks = localStorage.getItem(`tasks_${user.uid}`);
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Sort by created date, newest first
        parsedTasks.sort((a: Task, b: Task) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error parsing saved tasks:', error);
        setTasks([]);
      }
    }
  }, [user]);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (user && tasks.length >= 0) {
      localStorage.setItem(`tasks_${user.uid}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  const generateTaskId = () => {
    return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const handleAddTask = () => {
    if (!user || !taskForm.title.trim()) return;

    const newTask: Task = {
      id: generateTaskId(),
      ...taskForm,
      completed: false,
      createdAt: new Date().toISOString(),
      userId: user.uid
    };

    setTasks(prev => [newTask, ...prev]);
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      category: 'General'
    });
    setIsAddTaskOpen(false);
  };

  const handleEditTask = () => {
    if (!editingTask || !taskForm.title.trim()) return;

    setTasks(prev => prev.map(task =>
      task.id === editingTask.id
        ? {
            ...task,
            title: taskForm.title,
            description: taskForm.description,
            priority: taskForm.priority,
            dueDate: taskForm.dueDate,
            category: taskForm.category
          }
        : task
    ));

    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      category: 'General'
    });
  };

  const handleToggleComplete = (task: Task) => {
    setTasks(prev => prev.map(t =>
      t.id === task.id ? { ...t, completed: !t.completed } : t
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const startEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      category: task.category
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' && task.completed) || 
      (filter === 'pending' && !task.completed);
    
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;
  const highPriorityCount = tasks.filter(t => t.priority === 'high' && !t.completed).length;

  return (
    <div className="min-h-screen flex font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-[15px]">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-blue-400 opacity-20 animate-bounce">
          <ListTodo size={32} />
        </div>
        <div className="absolute top-40 right-20 text-green-400 opacity-15 animate-pulse">
          <CheckCircle size={24} />
        </div>
        <div className="absolute bottom-32 left-1/4 text-purple-400 opacity-10 animate-bounce" style={{animationDelay: '1s'}}>
          <Star size={28} />
        </div>
        <div className="absolute top-1/2 right-1/3 text-indigo-300 opacity-10 animate-pulse" style={{animationDelay: '2s'}}>
          <Calendar size={20} />
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl p-6 shadow-2xl border-r border-white/20 flex flex-col">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">StudyBuddy</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2"></div>
        </div>

        {/* Menu */}
        <div className="space-y-3 mb-10">
          <p className="text-sm font-semibold text-gray-500 uppercase">Menu</p>
          <nav className="space-y-2 font-medium">
            <SidebarLink icon={<BarChart3 />} label="Dashboard" onClick={() => navigate('/dashboard')} />
            <SidebarLink icon={<ListTodo />} label="Tasks" active />
            <SidebarLink icon={<Users />} label="Start Searching" />
            <SidebarLink icon={<Calendar />} label="Calendar" onClick={() => navigate('/calendar') }/>
            <SidebarLink icon={<BarChart3 />} label="Leaderboard" />
          </nav>
        </div>

        {/* General */}
        <div className="mt-8 space-y-2">
          <p className="text-sm font-semibold text-gray-500 uppercase">General</p>
          <nav className="space-y-2 font-medium">
            <SidebarLink icon={<Settings />} label="Settings" onClick={() => navigate('/settings')} />
            <SidebarLink icon={<HelpCircle />} label="Help" />
            <SidebarLink icon={<User />} label="Profile" />
            <button
              onClick={() => setIsLogoutOpen(true)}
              className="group cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-700 w-full text-left hover:shadow-md transform hover:-translate-y-0.5"
            >
              <span className="text-lg text-indigo-600 group-hover:text-red-700"><LogOut /></span>
              <span className="text-base">Log Out</span>
            </button>
          </nav>
        </div>

        {/* Clock */}
        <div className="mt-auto p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-200/30">
          <p className="text-xs text-gray-500 mb-1">Current Time</p>
          <p className="text-lg font-bold text-indigo-600">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="relative w-1/3">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border-0 placeholder-gray-400 text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-6">
            <Bell className="text-gray-500 hover:text-indigo-600 cursor-pointer" size={24} />
            <div className="flex items-center gap-4 bg-white/80 rounded-2xl p-3 shadow-md">
              <img
                src={avatarURL || '/default-avatar.png'}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover ring-3 ring-indigo-200"
              />
              <div className="text-left">
                <p className="text-base font-semibold text-gray-900">{name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl relative">
          <h1 className="text-3xl font-bold mb-2">Task Management 📝</h1>
          <p className="text-lg opacity-90 mb-6">Stay organized and get things done!</p>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsAddTaskOpen(true)}
              className="cursor-pointer bg-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/30 flex items-center gap-2"
            >
              <Plus size={16} /> Add New Task
            </button>
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl hover:bg-gray-50 font-semibold">
              View Analytics
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Tasks" value={String(tasks.length)} subtitle="all time" color="indigo" icon={<ListTodo />} />
          <StatCard title="Completed" value={String(completedCount)} subtitle="tasks done" color="green" icon={<CheckCircle />} />
          <StatCard title="Pending" value={String(pendingCount)} subtitle="to complete" color="purple" icon={<Clock />} />
          <StatCard title="High Priority" value={String(highPriorityCount)} subtitle="Urgent tasks" color="red" icon={<AlertTriangle />} />
        </section>

        {/* Filter Bar */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === 'all' 
                    ? 'bg-indigo-500 text-white' 
                    : 'cursor-pointer bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Tasks ({tasks.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === 'pending' 
                    ? 'bg-orange-500 text-white' 
                    : 'cursor-pointer bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === 'completed' 
                    ? 'bg-green-500 text-white' 
                    : 'cursor-pointer bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Completed ({completedCount})
              </button>
            </div>
            <button
              onClick={() => setIsAddTaskOpen(true)}
              className="cursor-pointer bg-indigo-500 text-white px-6 py-2 rounded-xl hover:bg-indigo-600 flex items-center gap-2 font-medium"
            >
              <Plus size={16} /> New Task
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 shadow-lg border border-white/20 text-center">
              <ListTodo className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm ? 'No tasks found' : filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first task to get started!'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setIsAddTaskOpen(true)}
                  className="cursor-pointer bg-indigo-500 text-white px-6 py-3 rounded-xl hover:bg-indigo-600 flex items-center gap-2 font-medium mx-auto"
                >
                  <Plus size={16} /> Add Your First Task
                </button>
              )}
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={startEditTask}
                onDelete={handleDeleteTask}
                getPriorityColor={getPriorityColor}
              />
            ))
          )}
        </div>
      </main>

      {/* Add/Edit Task Modal */}
      {(isAddTaskOpen || editingTask) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => {
            setIsAddTaskOpen(false);
            setEditingTask(null);
            setTaskForm({
              title: '',
              description: '',
              priority: 'medium',
              dueDate: '',
              category: 'General'
            });
          }}></div>
          <div className="relative z-10 bg-white rounded-3xl p-8 shadow-2xl border border-gray-200 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              <button
                onClick={() => {
                  setIsAddTaskOpen(false);
                  setEditingTask(null);
                  setTaskForm({
                    title: '',
                    description: '',
                    priority: 'medium',
                    dueDate: '',
                    category: 'General'
                  });
                }}
                className="cursor-pointer text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  placeholder="Enter task title..."
                  className="text-gray-700 w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  placeholder="Add task description..."
                  rows={3}
                  className="text-gray-700 w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({...taskForm, priority: e.target.value as 'low' | 'medium' | 'high'})}
                    className="cursor-pointer text-gray-700 w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                    className="text-gray-700 w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={taskForm.category}
                    onChange={(e) => setTaskForm({...taskForm, category: e.target.value})}
                    className="cursor-pointer text-gray-700 w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="General">General</option>
                    <option value="Study">Study</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Health">Health</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  setIsAddTaskOpen(false);
                  setEditingTask(null);
                  setTaskForm({
                    title: '',
                    description: '',
                    priority: 'medium',
                    dueDate: '',
                    category: 'General'
                  });
                }}
                className="cursor-pointer flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingTask ? handleEditTask : handleAddTask}
                disabled={!taskForm.title.trim()}
                className="cursor-pointer flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingTask ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {isLogoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsLogoutOpen(false)}></div>
          <div className="relative z-10 bg-white rounded-3xl p-8 shadow-2xl border border-gray-200 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to go?</h3>
            <p className="text-gray-600 mb-8">You'll be signed out. Your tasks are saved!</p>
            <div className="flex gap-4">
              <button onClick={() => setIsLogoutOpen(false)} className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50">Stay</button>
              <button onClick={handleLogout} className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700">Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SidebarLink({ icon, label, active = false, onClick }: { icon: JSX.Element; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 transform w-full text-left ${
        active
          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-105'
          : 'cursor-pointer hover:bg-indigo-50 text-gray-700 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <span className={`text-lg ${active ? 'text-white' : 'text-indigo-600'}`}>{icon}</span>
      <span className="text-base font-medium">{label}</span>
    </button>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  color,
  icon
}: {
  title: string;
  value: string;
  subtitle: string;
  color: 'indigo' | 'green' | 'purple' | 'red';
  icon: JSX.Element;
}) {
  const colorMap = {
    indigo: 'from-indigo-500 to-blue-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-pink-600',
    red: 'from-red-500 to-pink-600',
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorMap[color]} text-white shadow-lg group-hover:scale-110 transition-transform`}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-gray-500 text-xs">{subtitle}</p>
    </div>
  );
}

function TaskCard({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  getPriorityColor 
}: { 
  task: Task; 
  onToggleComplete: (task: Task) => void; 
  onEdit: (task: Task) => void; 
  onDelete: (taskId: string) => void;
  getPriorityColor: (priority: string) => string;
}) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const dueToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();

  return (
    <div className={`bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1 ${
      task.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <button
            onClick={() => onToggleComplete(task)}
            className={`cursor-pointer mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              task.completed 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-300 hover:border-indigo-500'
            }`}
          >
            {task.completed && <CheckCircle size={14} />}
          </button>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {task.category}
              </span>
            </div>
            
            {task.description && (
              <p className={`text-sm mb-3 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <CalendarDays size={12} />
                <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
              {task.dueDate && (
                <div className={`flex items-center gap-1 ${
                  isOverdue ? 'text-red-600 font-medium' : 
                  dueToday ? 'text-orange-600 font-medium' : ''
                }`}>
                  <Clock size={12} />
                  <span>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                    {isOverdue && ' (Overdue!)'}
                    {dueToday && ' (Today)'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="cursor-pointer p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title="Edit task"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="cursor-pointer p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {/* Progress indicators */}
      {(isOverdue || dueToday) && !task.completed && (
        <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${
          isOverdue ? 'bg-red-50 text-red-800' : 'bg-orange-50 text-orange-800'
        }`}>
          <AlertTriangle size={14} />
          <span className="text-sm font-medium">
            {isOverdue ? 'This task is overdue!' : 'Due today - don\'t forget!'}
          </span>
        </div>
      )}
      
      {task.completed && (
        <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-xl flex items-center gap-2">
          <CheckCircle size={14} />
          <span className="text-sm font-medium">Task completed! Great job! 🎉</span>
        </div>
      )}
    </div>
  );
}