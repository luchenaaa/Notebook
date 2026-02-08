import { format } from 'date-fns';

export default function TaskCard({ task, onToggleDone, onEdit, onDelete, t }) {
  const doneStyle = task.done ? 'opacity-70' : '';
  
  const priorityConfig = {
    high: { 
      gradient: 'from-red-500 to-pink-500', 
      bg: 'bg-red-50', 
      text: 'text-red-700',
      icon: '🔴',
      label: t('high')
    },
    medium: { 
      gradient: 'from-yellow-400 to-orange-400', 
      bg: 'bg-yellow-50', 
      text: 'text-yellow-700',
      icon: '🟡',
      label: t('medium')
    },
    low: { 
      gradient: 'from-green-400 to-emerald-400', 
      bg: 'bg-green-50', 
      text: 'text-green-700',
      icon: '🟢',
      label: t('low')
    }
  };
  
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <div className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${doneStyle} animate-fade-in`}>
      {/* Priority Banner */}
      <div className={`h-2 bg-gradient-to-r ${priority.gradient}`}></div>
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {/* Priority Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-3 py-1 rounded-full ${priority.bg} ${priority.text} font-semibold flex items-center gap-1`}>
                <span>{priority.icon}</span>
                {priority.label}
              </span>
              {task.done && (
                <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                  ✓ {t('done')}
                </span>
              )}
            </div>
            
            {/* Title */}
            <h3
              className={`text-xl font-bold mb-2 leading-tight ${task.done ? 'line-through' : ''}`}
              style={{
                color: task.textColor,
                fontWeight: task.fontWeight === 'bold' ? 'bold' : 'normal'
              }}
            >
              {task.title}
            </h3>
          </div>
          
          {/* Checkbox */}
          <label className="relative inline-flex items-center cursor-pointer ml-3">
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => onToggleDone(task.id)}
              className="sr-only peer"
            />
            <div className="w-11 h-11 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-xl peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-lg after:h-10 after:w-10 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-400 peer-checked:to-emerald-500 flex items-center justify-center">
              {task.done && (
                <svg className="w-6 h-6 text-white absolute" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </label>
        </div>

        {/* Content */}
        {task.content && (
          <p
            className={`text-sm mb-4 line-clamp-3 leading-relaxed ${task.done ? 'line-through' : ''}`}
            style={{
              color: task.textColor,
              fontWeight: task.fontWeight === 'bold' ? 'bold' : 'normal',
              opacity: task.done ? 0.6 : 1
            }}
          >
            {task.content}
          </p>
        )}

        {/* Images */}
        {task.images.length > 0 && (
          <div className="flex gap-2 mb-4">
            {task.images.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={`http://localhost:3001/${img}`}
                  alt=""
                  className="w-24 h-24 object-cover rounded-xl shadow-md group-hover:shadow-xl transition-shadow"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all"></div>
              </div>
            ))}
          </div>
        )}

        {/* Due Date */}
        {task.dueAt && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-700 font-semibold">
              {t('due')}: {format(new Date(task.dueAt), 'MMM d, yyyy h:mm a')}
            </span>
          </div>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {task.tags.map(tag => (
              <span key={tag} className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 justify-center pt-4 border-t border-gray-100">
          <button
            onClick={() => onEdit(task)}
            style={{ backgroundColor: '#0b05ff' }}
            className="flex-1 px-4 py-2.5 text-white rounded-xl hover:opacity-90 text-sm font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {t('edit')}
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="flex-1 px-4 py-2.5 bg-red-300 text-white rounded-xl hover:bg-red-400 text-sm font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {t('delete')}
          </button>
        </div>
      </div>
    </div>
  );
}
