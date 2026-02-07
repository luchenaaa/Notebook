# Notebook & Calendar App

A lightweight local-first task management app with notebook and calendar views.

## Features

- Create, edit, and delete tasks with rich text styling
- Upload up to 3 images per task
- Mark tasks as done/undone
- Filter tasks (All/Active/Done)
- Search tasks by title, content, or tags
- Calendar view with monthly layout
- Task priority levels (High/Medium/Low)
- Task templates for quick creation
- Local file-based storage (no database required)
- Import/Export functionality
- Beautiful modern UI with smooth animations

## Quick Start

### 🚀 Easy Way (Windows)

**Just double-click `start.bat`** - it will automatically start both servers!

The app will open at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### 📋 Manual Setup

If you prefer to run servers manually:

#### Backend

```bash
cd backend
npm install
npm start
```

Server runs on http://localhost:3001

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on http://localhost:3000

## Usage

1. Start the app (double-click `start.bat` or run servers manually)
2. Open http://localhost:3000 in your browser
3. Click "New Task" to create a task
4. Switch between Notebook and Calendar views
5. Use filters to show All/Active/Done tasks
6. Search tasks using the search bar
7. Save frequently used tasks as templates

## Project Structure

```
notebook-app/
├─ backend/          # Express API server
├─ frontend/         # React + Vite app
├─ data/
│  ├─ tasks.json     # Task storage
│  └─ images/        # Uploaded images
├─ start.bat         # Quick start script (Windows)
└─ README.md
```

## Features in Detail

### Task Management
- **Create**: Add tasks with title, description, images, due date, tags, and priority
- **Edit**: Modify any task property, add/remove images
- **Delete**: Remove tasks with confirmation
- **Toggle Done**: Mark tasks as complete/incomplete
- **Priority**: Set High/Medium/Low priority with color coding

### Views
- **Notebook**: Grid view of all tasks with filtering and search
- **Calendar**: Monthly calendar showing tasks by due date

### Organization
- **Search**: Find tasks by title, content, or tags
- **Filter**: Show All, Active, or Completed tasks
- **Tags**: Organize tasks with comma-separated tags
- **Priority**: Visual priority indicators

### Templates
- Save frequently used task formats
- Quick create from saved templates
- Stored locally in browser

### Customization
- **Text Color**: Choose from 10 preset colors
- **Font Weight**: Normal or Bold
- **Images**: Up to 3 images per task

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/done` - Toggle done status
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/export` - Export tasks as JSON
- `POST /api/import` - Import tasks from JSON

## Data Storage

All data is stored locally in the `/data` folder:
- Task metadata: `/data/tasks.json`
- Images: `/data/images/`

No external database or cloud storage required.

## Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- date-fns

**Backend:**
- Node.js
- Express
- Multer (file uploads)
- UUID

## Requirements

- Node.js (v16 or higher)
- npm or yarn

## Tips

- Tasks are automatically sorted by: Not Done → Priority → Due Date
- Images are limited to 5MB each
- Templates are saved in browser localStorage
- Use tags for better organization
- Calendar view shows tasks on their due dates
- Search works across title, content, and tags
