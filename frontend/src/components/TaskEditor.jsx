import { useState, useEffect } from 'react';
import { createTask, updateTask } from '../api';
import { SaveTemplateButton } from './TemplateManager';

export default function TaskEditor({ task, onClose, onSaved, t }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [fontWeight, setFontWeight] = useState('normal');
  const [dueAt, setDueAt] = useState('');
  const [tags, setTags] = useState('');
  const [priority, setPriority] = useState('medium');
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setContent(task.content);
      setTextColor(task.textColor);
      setFontWeight(task.fontWeight);
      setDueAt(task.dueAt ? task.dueAt.slice(0, 16) : '');
      setTags(task.tags.join(', '));
      setPriority(task.priority || 'medium');
      setExistingImages(task.images);
      setImages([]);
      setRemovedImages([]);
    } else {
      // Reset all fields for new task
      setTitle('');
      setContent('');
      setTextColor('#000000');
      setFontWeight('normal');
      setDueAt('');
      setTags('');
      setPriority('medium');
      setExistingImages([]);
      setImages([]);
      setRemovedImages([]);
    }
  }, [task]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('textColor', textColor);
    formData.append('fontWeight', fontWeight);
    if (dueAt) formData.append('dueAt', new Date(dueAt).toISOString());
    formData.append('tags', tags);
    formData.append('priority', priority);

    images.forEach(img => formData.append('images', img));

    const isNew = !task;
    
    if (task) {
      if (removedImages.length > 0) {
        formData.append('removeImages', JSON.stringify(removedImages));
      }
      await updateTask(task.id, formData);
    } else {
      await createTask(formData);
    }
    onSaved(isNew);
  }

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    if (existingImages.length + images.length + files.length > 3) {
      return;
    }
    setImages([...images, ...files]);
  }

  function removeExisting(img) {
    setExistingImages(existingImages.filter(i => i !== img));
    setRemovedImages([...removedImages, img]);
  }

  function removeNew(idx) {
    setImages(images.filter((_, i) => i !== idx));
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white backdrop-blur-xl p-6 rounded-t-3xl border-b border-gray-200 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {task ? `✏️ ${t('editTask')}` : `✨ ${t('createTask')}`}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white/10 rounded-xl"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('titleRequired')}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              placeholder={t('title')}
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('description')}</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all h-32 resize-none"
              placeholder={t('description')}
            />
          </div>

          {/* Text Color & Font Weight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">{t('textColor')}</label>
              <div className="grid grid-cols-5 gap-3">
                {[
                  { color: '#000000', name: t('black') },
                  { color: '#EF4444', name: t('red') },
                  { color: '#ff5705', name: t('orange') },
                  { color: '#EAB308', name: t('yellow') },
                  { color: '#22C55E', name: t('green') },
                  { color: '#0b05ff', name: t('blue') },
                  { color: '#9e05ff', name: t('purple') },
                  { color: '#EC4899', name: t('pink') },
                  { color: '#6B7280', name: t('gray') },
                  { color: '#14B8A6', name: t('teal') }
                ].map(({ color, name }) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setTextColor(color)}
                    className={`w-12 h-12 rounded-xl border-3 transition-all transform hover:scale-110 shadow-md ${
                      textColor === color ? 'border-gray-900 scale-110 ring-4 ring-purple-200' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={name}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('fontWeight')}</label>
              <select
                value={fontWeight}
                onChange={(e) => setFontWeight(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all cursor-pointer"
              >
                <option value="normal">{t('normal')}</option>
                <option value="bold">{t('bold')}</option>
              </select>
            </div>
          </div>

          {/* Due Date & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('dueDate')}</label>
              <input
                type="datetime-local"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('priority')}</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all cursor-pointer"
              >
                <option value="low">🟢 {t('low')}</option>
                <option value="medium">🟡 {t('medium')}</option>
                <option value="high">🔴 {t('high')}</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('tags')}</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              placeholder={t('tagsPlaceholder')}
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('images')}</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-purple-400 transition-all">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                disabled={existingImages.length + images.length >= 3}
              />
              <label 
                htmlFor="image-upload" 
                className={`flex flex-col items-center justify-center cursor-pointer ${
                  existingImages.length + images.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm text-gray-600">{t('clickToUpload')}</span>
                <span className="text-xs text-gray-400 mt-1">
                  {existingImages.length + images.length}/3 {t('images').toLowerCase()}
                </span>
              </label>
            </div>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-600 mb-2 font-medium">{t('currentImages')}</p>
                <div className="flex gap-3">
                  {existingImages.map((img, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={`http://localhost:3001/${img}`}
                        alt=""
                        className="w-24 h-24 object-cover rounded-xl shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeExisting(img)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg hover:bg-red-600 transition-all transform hover:scale-110"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            {images.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-600 mb-2 font-medium">{t('newImages')}</p>
                <div className="flex gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative group">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-xs text-center p-2 shadow-md">
                        {img.name.slice(0, 15)}...
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNew(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg hover:bg-red-600 transition-all transform hover:scale-110"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end items-center pt-6 border-t border-gray-200">
            {title && (
              <SaveTemplateButton
                currentTask={{ title, content, textColor, fontWeight, tags: tags.split(',').map(t => t.trim()).filter(t => t), priority }}
                onSaved={() => {}}
                t={t}
              />
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 font-medium shadow-lg transition-all transform hover:scale-105"
            >
              {task ? t('updateTask') : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
