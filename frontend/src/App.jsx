import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TaskCard from './components/TaskCard';
import TaskEditor from './components/TaskEditor';
import CalendarView from './components/CalendarView';
import ToastContainer from './components/ToastContainer';
import TemplateManager from './components/TemplateManager';
import { getTasks, toggleDone, deleteTask } from './api';
import { useToast } from './hooks/useToast';

export default function App() {
  const [view, setView] = useState('notebook');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const { toasts, removeToast, success, error } = useToast();

  useEffect(() => {
    loadTasks();
  }, [filter]);

  async function loadTasks() {
    try {
      const data = await getTasks(filter);
      setTasks(data);
    } catch (err) {
      error('Failed to load tasks');
    }
  }

  async function handleToggleDone(id) {
    try {
      await toggleDone(id);
      success('Task updated');
      loadTasks();
    } catch (err) {
      error('Failed to update task');
    }
  }

  async function handleDelete(id) {
    if (confirm('Delete this task?')) {
      try {
        await deleteTask(id);
        success('Task deleted');
        loadTasks();
      } catch (err) {
        error('Failed to delete task');
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
    success(isNew ? 'Task created' : 'Task updated');
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
  });

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
      />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {view === 'notebook' ? (
          <>
            {filteredTasks.length === 0 && searchQuery && (
              <div className="text-center py-20 animate-fade-in">
                <div className="bg-white rounded-2xl p-12 inline-block shadow-lg">
                  <svg className="w-20 h-20 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-xl text-gray-600 font-medium">No tasks found for "{searchQuery}"</p>
                  <p className="text-gray-500 mt-2">Try a different search term</p>
                </div>
              </div>
            )}
            {filteredTasks.length === 0 && !searchQuery && (
              <div className="text-center py-20 animate-fade-in">
                <div className="bg-white rounded-2xl p-12 inline-block shadow-lg">
                  <svg className="w-20 h-20 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-xl text-gray-600 font-medium">No tasks yet</p>
                  <p className="text-gray-500 mt-2">Click "New Task" to get started</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleDone={handleToggleDone}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        ) : (
          <CalendarView tasks={filteredTasks} onEdit={handleEdit} />
        )}
      </main>

      {showEditor && (
        <TaskEditor
          task={editingTask}
          onClose={() => setShowEditor(false)}
          onSaved={handleSaved}
        />
      )}

      {showTemplates && (
        <TemplateManager
          onUseTemplate={handleUseTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
}
