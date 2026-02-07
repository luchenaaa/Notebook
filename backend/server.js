import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

const DATA_DIR = path.join(__dirname, '../data');
const IMAGES_DIR = path.join(DATA_DIR, 'images');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

// Ensure directories exist
await fs.mkdir(IMAGES_DIR, { recursive: true });

// Initialize tasks.json if not exists
try {
  await fs.access(TASKS_FILE);
} catch {
  await fs.writeFile(TASKS_FILE, '[]');
}

app.use(cors());
app.use(express.json());
app.use('/images', express.static(IMAGES_DIR));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, IMAGES_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 3 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'));
  }
});

async function readTasks() {
  const data = await fs.readFile(TASKS_FILE, 'utf-8');
  return JSON.parse(data);
}

async function writeTasks(tasks) {
  const temp = `${TASKS_FILE}.tmp`;
  await fs.writeFile(temp, JSON.stringify(tasks, null, 2));
  await fs.rename(temp, TASKS_FILE);
}

app.get('/api/tasks', async (req, res) => {
  try {
    let tasks = await readTasks();
    const { filter, tag } = req.query;
    
    if (filter === 'active') tasks = tasks.filter(t => !t.done);
    if (filter === 'done') tasks = tasks.filter(t => t.done);
    if (tag) tasks = tasks.filter(t => t.tags?.includes(tag));
    
    tasks.sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      
      // Sort by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const aPriority = priorityOrder[a.priority] ?? 1;
      const bPriority = priorityOrder[b.priority] ?? 1;
      if (aPriority !== bPriority) return aPriority - bPriority;
      
      // Then by date
      const aDate = a.dueAt ? new Date(a.dueAt).getTime() : Infinity;
      const bDate = b.dueAt ? new Date(b.dueAt).getTime() : Infinity;
      return aDate - bDate;
    });
    
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tasks/:id', async (req, res) => {
  try {
    const tasks = await readTasks();
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks', upload.array('images', 3), async (req, res) => {
  try {
    const { title, content, textColor, fontWeight, dueAt, tags } = req.body;
    
    if (!title) return res.status(400).json({ error: 'Title required' });
    
    const task = {
      id: uuidv4(),
      title,
      content: content || '',
      textColor: textColor || '#000000',
      fontWeight: fontWeight || 'normal',
      images: req.files?.map(f => `images/${f.filename}`) || [],
      tags: tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [],
      dueAt: dueAt || null,
      priority: req.body.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      done: false
    };
    
    const tasks = await readTasks();
    tasks.push(task);
    await writeTasks(tasks);
    
    res.json({ ok: true, task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/tasks/:id', upload.array('images', 3), async (req, res) => {
  try {
    const tasks = await readTasks();
    const idx = tasks.findIndex(t => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Task not found' });
    
    const { title, content, textColor, fontWeight, dueAt, tags, removeImages } = req.body;
    const task = tasks[idx];
    
    // Remove old images if specified
    if (removeImages) {
      const toRemove = JSON.parse(removeImages);
      for (const img of toRemove) {
        const imgPath = path.join(__dirname, '..', img);
        await fs.unlink(imgPath).catch(() => {});
      }
      task.images = task.images.filter(img => !toRemove.includes(img));
    }
    
    // Add new images
    if (req.files?.length) {
      const newImages = req.files.map(f => `images/${f.filename}`);
      task.images = [...task.images, ...newImages].slice(0, 3);
    }
    
    task.title = title || task.title;
    task.content = content !== undefined ? content : task.content;
    task.textColor = textColor || task.textColor;
    task.fontWeight = fontWeight || task.fontWeight;
    task.dueAt = dueAt !== undefined ? dueAt : task.dueAt;
    task.priority = req.body.priority || task.priority;
    task.tags = tags !== undefined ? tags.split(',').map(t => t.trim()).filter(t => t) : task.tags;
    task.updatedAt = new Date().toISOString();
    
    await writeTasks(tasks);
    res.json({ ok: true, task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/tasks/:id/done', async (req, res) => {
  try {
    const tasks = await readTasks();
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    task.done = !task.done;
    task.updatedAt = new Date().toISOString();
    await writeTasks(tasks);
    
    res.json({ ok: true, task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const tasks = await readTasks();
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    // Delete images
    for (const img of task.images) {
      const imgPath = path.join(__dirname, '..', img);
      await fs.unlink(imgPath).catch(() => {});
    }
    
    const filtered = tasks.filter(t => t.id !== req.params.id);
    await writeTasks(filtered);
    
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/export', async (req, res) => {
  try {
    const tasks = await readTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/import', async (req, res) => {
  try {
    const tasks = req.body;
    if (!Array.isArray(tasks)) return res.status(400).json({ error: 'Invalid format' });
    await writeTasks(tasks);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
