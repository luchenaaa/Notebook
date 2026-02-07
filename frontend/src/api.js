const API_BASE = 'http://localhost:3001/api';

export async function getTasks(filter = 'all', tag = '') {
  const params = new URLSearchParams();
  if (filter !== 'all') params.append('filter', filter);
  if (tag) params.append('tag', tag);
  const res = await fetch(`${API_BASE}/tasks?${params}`);
  return res.json();
}

export async function getTask(id) {
  const res = await fetch(`${API_BASE}/tasks/${id}`);
  return res.json();
}

export async function createTask(formData) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    body: formData
  });
  return res.json();
}

export async function updateTask(id, formData) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    body: formData
  });
  return res.json();
}

export async function toggleDone(id) {
  const res = await fetch(`${API_BASE}/tasks/${id}/done`, {
    method: 'PATCH'
  });
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE'
  });
  return res.json();
}

export async function exportTasks() {
  const res = await fetch(`${API_BASE}/export`);
  return res.json();
}

export async function importTasks(tasks) {
  const res = await fetch(`${API_BASE}/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tasks)
  });
  return res.json();
}
