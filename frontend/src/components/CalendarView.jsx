import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek } from 'date-fns';

export default function CalendarView({ tasks, onEdit }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  function getTasksForDay(day) {
    return tasks.filter(task => 
      task.dueAt && isSameDay(new Date(task.dueAt), day)
    );
  }

  function prevMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  }

  const selectedDayTasks = selectedDate ? getTasksForDay(selectedDate) : [];

  const priorityConfig = {
    high: { gradient: 'from-red-500 to-pink-500', bg: 'bg-red-50' },
    medium: { gradient: 'from-yellow-400 to-orange-400', bg: 'bg-yellow-50' },
    low: { gradient: 'from-green-400 to-emerald-400', bg: 'bg-green-50' }
  };

  return (
    <div className="animate-fade-in">
      {/* Calendar Header */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={prevMonth} 
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 font-medium shadow-md transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
          
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <button 
            onClick={nextMonth} 
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 font-medium shadow-md transition-all transform hover:scale-105 flex items-center gap-2"
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Calendar Grid - Takes 2/3 width */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
              <div key={day} className="text-center font-bold text-gray-700 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg text-sm">
                <div className="hidden lg:block">{day}</div>
                <div className="lg:hidden">{day.slice(0, 3)}</div>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map(day => {
              const tasksForDay = getTasksForDay(day);
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    min-h-20 p-2 rounded-lg cursor-pointer transition-all transform hover:scale-105 hover:shadow-lg
                    ${isToday ? 'bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-500 shadow-md' : 'bg-gray-50 border-2 border-gray-200'}
                    ${isSelected ? 'ring-2 ring-blue-400 shadow-xl' : ''}
                    ${!isCurrentMonth ? 'opacity-40' : ''}
                    hover:border-blue-400
                  `}
                >
                  {/* Day Number */}
                  <div className={`text-sm font-bold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                    {format(day, 'd')}
                  </div>

                  {/* Task Count Badge */}
                  {tasksForDay.length > 0 && (
                    <div className="mb-1">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full">
                        {tasksForDay.length}
                      </span>
                    </div>
                  )}

                  {/* Task Preview - Only show 1 */}
                  {tasksForDay.length > 0 && (
                    <div className="space-y-1">
                      {tasksForDay.slice(0, 1).map(task => {
                        const priority = priorityConfig[task.priority] || priorityConfig.medium;
                        return (
                          <div
                            key={task.id}
                            className={`text-xs p-1 rounded truncate ${priority.bg} border-l-2`}
                            style={{ borderLeftColor: task.textColor }}
                            title={task.title}
                          >
                            <div className="font-semibold truncate text-xs">{task.title}</div>
                          </div>
                        );
                      })}
                      {tasksForDay.length > 1 && (
                        <div className="text-xs text-gray-500 font-medium">
                          +{tasksForDay.length - 1}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Tasks Panel - Takes 1/3 width, fixed on right */}
        {selectedDate && selectedDayTasks.length > 0 && (
          <div className="w-96 bg-white rounded-2xl shadow-xl p-4 animate-fade-in max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 border-b">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                📅 {format(selectedDate, 'MMM d, yyyy')}
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-2">
              {selectedDayTasks.map(task => {
                const priority = priorityConfig[task.priority] || priorityConfig.medium;
                return (
                  <div
                    key={task.id}
                    className="p-3 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md cursor-pointer transition-all"
                    onClick={() => onEdit(task)}
                  >
                    {/* Priority Banner */}
                    <div className={`h-1 w-full bg-gradient-to-r ${priority.gradient} rounded-full mb-2`}></div>
                    
                    <div className="flex items-start justify-between mb-1">
                      <span
                        className="text-sm font-bold flex-1"
                        style={{
                          color: task.textColor,
                          fontWeight: task.fontWeight === 'bold' ? 'bold' : 'normal'
                        }}
                      >
                        {task.title}
                      </span>
                      {task.done && (
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          ✓
                        </span>
                      )}
                    </div>
                    
                    {task.content && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.content}</p>
                    )}
                    
                    {/* Task Meta */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {format(new Date(task.dueAt), 'h:mm a')}
                      </span>
                      {task.tags.length > 0 && (
                        <div className="flex gap-1">
                          {task.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
