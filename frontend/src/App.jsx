import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TaskCard from './components/TaskCard';
import TaskEditor from './components/TaskEditor';
import CalendarView from './components/CalendarView';
import ToastContainer from './components/ToastContainer';
import TemplateManager from './components/TemplateManager';
import { getTasks, toggleDone, deleteTask } from './api';
import { useToast } from './hooks/useToast';
import { useLanguage } from './hooks/useLanguage';

export default function App() {
  const [view, setView] = useState('notebook');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState(null);
  const { toasts, removeToast, success, error } = useToast();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    loadTasks();
  }, [filter]);

  async function loadTasks() {
    try {
      const data = await getTasks(filter);
      setTasks(data);
    } catch (err) {
      error(t('failedToLoad'));
    }
  }

  async function handleToggleDone(id) {
    try {
      await toggleDone(id);
      success(t('taskUpdated'));
      loadTasks();
    } catch (err) {
      error(t('failedToUpdate'));
    }
  }

  async function handleDelete(id) {
    if (confirm(t('deleteConfirm'))) {
      try {
        await deleteTask(id);
        success(t('taskDeleted'));
        loadTasks();
      } catch (err) {
        error(t('failedToDelete'));
      }
    }
  }

  function handleEdit(task) {
    setEditingTask(task);
    setShowEditor(true);
  }

  function handleNew() {
    setEditingTask(null);
    setShowEditor(true);
  }

  function handleUseTemplate(template) {
    setEditingTask({
      title: template.title,
      content: template.content,
      textColor: template.textColor,
      fontWeight: template.fontWeight,
      tags: template.tags || [],
      priority: template.priority || 'medium',
      images: [],
      dueAt: null
    });
    setShowTemplates(false);
    setShowEditor(true);
  }

  function handleSaved(isNew) {
    setShowEditor(false);
    setEditingTask(null);
    success(isNew ? t('taskCreated') : t('taskUpdated'));
    loadTasks();
  }

  // Filter tasks by search query
  const filteredTasks = tasks.filter(task => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.content.toLowerCase().includes(query) ||
      task.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }).filter(task => {
    // Filter by priority if selected
    if (!priorityFilter) return true;
    return task.priority === priorityFilter;
  });

  function togglePriorityFilter(priority) {
    if (priorityFilter === priority) {
      setPriorityFilter(null); // Close filter
    } else {
      setPriorityFilter(priority); // Open filter
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Navbar
        view={view}
        setView={setView}
        filter={filter}
        setFilter={setFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNew={handleNew}
        onTemplates={() => setShowTemplates(true)}
        language={language}
        onToggleLanguage={toggleLanguage}
        t={t}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {view === 'notebook' ? (
          <>
            {/* Priority Filter Buttons */}
            <div className="flex gap-3 mb-6 justify-center">
              <button
                onClick={() => togglePriorityFilter('high')}
                className={`px-6 py-3 rounded-xl font-medium shadow-md transition-all transform hover:scale-105 flex items-center gap-2 ${
                  priorityFilter === 'high'
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-400'
                }`}
              >
                🔴 {t('high')}
              </button>
              <button
                onClick={() => togglePriorityFilter('medium')}
                className={`px-6 py-3 rounded-xl font-medium shadow-md transition-all transform hover:scale-105 flex items-center gap-2 ${
                  priorityFilter === 'medium'
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-yellow-400'
                }`}
              >
                🟡 {t('medium')}
              </button>
              <button
                onClick={() => togglePriorityFilter('low')}
                className={`px-6 py-3 rounded-xl font-medium shadow-md transition-all transform hover:scale-105 flex items-center gap-2 ${
                  priorityFilter === 'low'
                    ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-400'
                }`}
              >
                🟢 {t('low')}
              </button>
            </div>

            {filteredTasks.length === 0 && searchQuery && (
              <div className="text-center py-20 animate-fade-in">
                <div className="bg-white rounded-2xl p-12 inline-block shadow-lg">
                  <svg className="w-20 h-20 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-xl text-gray-600 font-medium">{t('noTasksFound')} "{searchQuery}"</p>
                  <p className="text-gray-500 mt-2">{t('tryDifferentSearch')}</p>
                </div>
              </div>
            )}
            {filteredTasks.length === 0 && !searchQuery && (
              <div className="text-center py-20 animate-fade-in">
                <div className="bg-white rounded-2xl p-12 inline-block shadow-lg">
                  <svg className="w-20 h-20 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-xl text-gray-600 font-medium">{t('noTasksYet')}</p>
                  <p className="text-gray-500 mt-2">{t('clickNewTask')}</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleDone={handleToggleDone}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  t={t}
                />
              ))}
            </div>
          </>
        ) : (
          <CalendarView tasks={filteredTasks} onEdit={handleEdit} t={t} language={language} />
        )}
      </main>

      {showEditor && (
        <TaskEditor
          task={editingTask}
          onClose={() => setShowEditor(false)}
          onSaved={handleSaved}
          t={t}
        />
      )}

      {showTemplates && (
        <TemplateManager
          onUseTemplate={handleUseTemplate}
          onClose={() => setShowTemplates(false)}
          t={t}
        />
      )}
    </div>
  );
}
