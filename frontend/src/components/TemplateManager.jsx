import { useState, useEffect } from 'react';

export default function TemplateManager({ onUseTemplate, onClose, t }) {
  const [templates, setTemplates] = useState([]);
  const [showSave, setShowSave] = useState(false);
  const [templateName, setTemplateName] = useState('');

  useEffect(() => {
    loadTemplates();
  }, []);

  function loadTemplates() {
    const saved = localStorage.getItem('taskTemplates');
    setTemplates(saved ? JSON.parse(saved) : []);
  }

  function saveTemplate(template) {
    const newTemplates = [...templates, { ...template, id: Date.now(), name: templateName }];
    localStorage.setItem('taskTemplates', JSON.stringify(newTemplates));
    setTemplates(newTemplates);
    setTemplateName('');
    setShowSave(false);
  }

  function deleteTemplate(id) {
    const filtered = templates.filter(t => t.id !== id);
    localStorage.setItem('taskTemplates', JSON.stringify(filtered));
    setTemplates(filtered);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{t('taskTemplates')}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
              ×
            </button>
          </div>

          {templates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>{t('noTemplates')}</p>
              <p className="text-sm mt-2">{t('createTaskSave')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {templates.map(template => (
                <div key={template.id} className="border rounded p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{template.title}</p>
                      {template.tags?.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {template.tags.map(tag => (
                            <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onUseTemplate(template)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        {t('use')}
                      </button>
                      <button
                        onClick={() => deleteTemplate(template.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        {t('delete')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SaveTemplateButton({ currentTask, onSaved, t }) {
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState('');

  function handleSave() {
    if (!name.trim()) return;
    
    const templates = JSON.parse(localStorage.getItem('taskTemplates') || '[]');
    const template = {
      id: Date.now(),
      name: name.trim(),
      title: currentTask.title,
      content: currentTask.content,
      textColor: currentTask.textColor,
      fontWeight: currentTask.fontWeight,
      tags: currentTask.tags,
      priority: currentTask.priority
    };
    
    templates.push(template);
    localStorage.setItem('taskTemplates', JSON.stringify(templates));
    
    setName('');
    setShowInput(false);
    onSaved?.();
  }

  if (!showInput) {
    return (
      <button
        type="button"
        onClick={() => setShowInput(true)}
        className="text-sm text-blue-600 hover:underline"
      >
        💾 {t('saveAsTemplate')}
      </button>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('templateName')}
        className="px-3 py-1 border rounded text-sm flex-1"
        autoFocus
      />
      <button
        type="button"
        onClick={handleSave}
        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
      >
        {t('save')}
      </button>
      <button
        type="button"
        onClick={() => setShowInput(false)}
        className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
      >
        {t('cancel')}
      </button>
    </div>
  );
}
