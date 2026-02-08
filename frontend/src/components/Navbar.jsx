export default function Navbar({ view, setView, filter, setFilter, searchQuery, setSearchQuery, onNew, onTemplates, language, onToggleLanguage, t }) {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-40 border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 max-w-7xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{t('appName')}</h1>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="pl-10 pr-10 py-2.5 border-2 border-gray-200 rounded-xl w-64 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all"
              />
              <svg
                className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* View Switcher */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setView('notebook')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  view === 'notebook' 
                    ? 'bg-white text-blue-600 shadow-md' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                📝 {t('notebook')}
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  view === 'calendar' 
                    ? 'bg-white text-blue-600 shadow-md' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                📅 {t('calendar')}
              </button>
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm cursor-pointer"
            >
              <option value="all">{t('allTasks')}</option>
              <option value="active">{t('active')}</option>
              <option value="done">{t('completed')}</option>
            </select>

            {/* Templates Button */}
            <button
              onClick={onTemplates}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 font-medium shadow-lg transition-all transform hover:scale-105"
            >
              📋 {t('templates')}
            </button>

            {/* Language Toggle Button */}
            <button
              onClick={onToggleLanguage}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 font-medium shadow-lg transition-all transform hover:scale-105"
            >
              {language === 'en' ? '🌐 Eng' : '🌐 中文'}
            </button>

            {/* New Task Button */}
            <button
              onClick={onNew}
              className="px-5 py-2.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl hover:from-green-500 hover:to-emerald-600 font-medium shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('newTask')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
