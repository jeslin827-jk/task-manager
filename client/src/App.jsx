import { useEffect, useMemo, useState } from 'react'
import './App.css'

const filters = ['All tasks', 'Active', 'Completed']
const API_BASE_URL = import.meta.env.DEV ? '' : 'https://taskflow-api-nte7.onrender.com'

async function requestTasks(path = '', options = {}) {
  const response = await fetch(`${API_BASE_URL}/api/tasks${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const contentType = response.headers.get('content-type') || ''
  let result = {}

  if (contentType.includes('application/json')) {
    try {
      result = await response.json()
    } catch {
      if (response.ok) {
        throw new Error('The server returned an invalid response.')
      }
    }
  }

  if (!response.ok) {
    throw new Error(result.message || `API request failed (${response.status}).`)
  }

  if (!contentType.includes('application/json')) {
    throw new Error('The server returned an invalid response.')
  }

  return result
}

function TaskForm({ task, onSave, onCancel, saving }) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError('Please enter a task title.')
      return
    }
    if (trimmedTitle.length > 120) {
      setError('Task titles must be 120 characters or fewer.')
      return
    }
    if (description.trim().length > 500) {
      setError('Descriptions must be 500 characters or fewer.')
      return
    }

    try {
      await onSave({ title: trimmedTitle, description: description.trim() })
    } catch (saveError) {
      setError(saveError.message)
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">{task ? 'MAKE A CHANGE' : 'START SMALL'}</p>
          <h2>{task ? 'Edit task' : 'What needs doing?'}</h2>
        </div>
        {task && (
          <button className="text-button" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
      <label htmlFor="task-title">Task title</label>
      <input
        id="task-title"
        autoFocus
        maxLength={120}
        placeholder="e.g. Prepare project proposal"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />
      <label htmlFor="task-description">Description <span>(optional)</span></label>
      <textarea
        id="task-description"
        maxLength={500}
        placeholder="Add a few details to help you get started..."
        rows={3}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="primary-button submit-button" disabled={saving} type="submit">
        {saving ? 'Saving...' : task ? 'Save changes' : 'Add task'}
        {!saving && <span aria-hidden="true"> →</span>}
      </button>
    </form>
  )
}

function TaskCard({ task, onToggle, onEdit, onDelete, busy }) {
  return (
    <article className={`task-card${task.completed ? ' is-completed' : ''}`}>
      <button
        aria-label={task.completed ? `Mark ${task.title} as active` : `Complete ${task.title}`}
        className="completion-button"
        disabled={busy}
        onClick={() => onToggle(task)}
        type="button"
      >
        {task.completed ? '✓' : ''}
      </button>
      <div className="task-content">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <span className="task-date">
          {task.completed ? 'Completed' : 'Added'} {new Date(task.updatedAt || task.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
      <div className="task-actions">
        <button aria-label={`Edit ${task.title}`} disabled={busy} onClick={() => onEdit(task)} type="button">
          Edit
        </button>
        <button aria-label={`Delete ${task.title}`} className="delete-action" disabled={busy} onClick={() => onDelete(task)} type="button">
          Delete
        </button>
      </div>
    </article>
  )
}

function App() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('All tasks')
  const [editingTask, setEditingTask] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [busyTaskId, setBusyTaskId] = useState(null)
  const [pageError, setPageError] = useState('')

  async function loadTasks(showLoading = false) {
    if (showLoading) setLoading(true)
    setPageError('')
    try {
      const result = await requestTasks()
      setTasks(result.data)
    } catch (error) {
      setPageError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    requestTasks()
      .then((result) => {
        if (isMounted) setTasks(result.data)
      })
      .catch((error) => {
        if (isMounted) setPageError(error.message)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const completedCount = tasks.filter((task) => task.completed).length
  const visibleTasks = useMemo(() => tasks.filter((task) => {
    if (filter === 'Active') return !task.completed
    if (filter === 'Completed') return task.completed
    return true
  }), [filter, tasks])

  async function saveTask(values) {
    setSaving(true)
    try {
      const result = await requestTasks(editingTask ? `/${editingTask._id}` : '', {
        method: editingTask ? 'PATCH' : 'POST',
        body: JSON.stringify(values),
      })
      setTasks((current) => editingTask
        ? current.map((task) => task._id === result.data._id ? result.data : task)
        : [result.data, ...current])
      setEditingTask(null)
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  async function toggleTask(task) {
    setBusyTaskId(task._id)
    setPageError('')
    try {
      const result = await requestTasks(`/${task._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: !task.completed }),
      })
      setTasks((current) => current.map((item) => item._id === task._id ? result.data : item))
    } catch (error) {
      setPageError(error.message)
    } finally {
      setBusyTaskId(null)
    }
  }

  async function deleteTask(task) {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return
    setBusyTaskId(task._id)
    setPageError('')
    try {
      await requestTasks(`/${task._id}`, { method: 'DELETE' })
      setTasks((current) => current.filter((item) => item._id !== task._id))
    } catch (error) {
      setPageError(error.message)
    } finally {
      setBusyTaskId(null)
    }
  }

  function editTask(task) {
    setEditingTask(task)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function closeForm() {
    setEditingTask(null)
    setShowForm(false)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="TaskFlow home">
          <span className="brand-mark">
            <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none">
              <path d="m3.5 6.5 2 2 3.5-4M12 7h8M3.5 16.5l2 2 3.5-4M12 17h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>TaskFlow</span>
        </a>
        <span className="topbar-note">A little more focus, every day.</span>
      </header>

      <section className="welcome">
        <div className="welcome-copy">
          <p className="eyebrow">YOUR PERSONAL TASK SPACE</p>
          <h1>Make room for<br /><span>what matters.</span></h1>
          <p className="welcome-description">A clear mind starts with a clear list. Take it one task at a time.</p>
        </div>
        <div className="progress-card" aria-label={`${completedCount} of ${tasks.length} tasks complete`}>
          <span className="progress-label">YOUR PROGRESS</span>
          <div className="progress-numbers">
            <strong>{String(completedCount).padStart(2, '0')}</strong>
            <span> / {String(tasks.length).padStart(2, '0')}</span>
          </div>
          <div className="progress-track">
            <span style={{ width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%` }} />
          </div>
          <p>{tasks.length === 0 ? 'Your first step starts here.' : completedCount === tasks.length ? 'Everything is done. Lovely work!' : 'Every checked box is a small win.'}</p>
        </div>
      </section>

      <section className="workspace">
        <div className="tasks-column">
          <div className="list-heading">
            <div>
              <p className="eyebrow">THE PLAN</p>
              <h2>Your tasks <span className="task-count">{tasks.length}</span></h2>
            </div>
            {!showForm && (
              <button className="primary-button add-button" onClick={() => setShowForm(true)} type="button">
                <span aria-hidden="true">＋</span> New task
              </button>
            )}
          </div>

          <nav className="filter-tabs" aria-label="Filter tasks">
            {filters.map((item) => (
              <button
                aria-pressed={filter === item}
                className={filter === item ? 'selected' : ''}
                key={item}
                onClick={() => setFilter(item)}
                type="button"
              >
                {item}
                {item === 'Active' && <span>{tasks.length - completedCount}</span>}
              </button>
            ))}
          </nav>

          {pageError && (
            <div className="page-error" role="alert">
              <p>{pageError}</p>
              <button onClick={() => loadTasks(true)} type="button">Try again</button>
            </div>
          )}

          {loading ? (
            <p className="status-message" role="status">Loading your tasks...</p>
          ) : visibleTasks.length > 0 ? (
            <div className="task-list">
              {visibleTasks.map((task) => (
                <TaskCard
                  busy={busyTaskId === task._id}
                  key={task._id}
                  onDelete={deleteTask}
                  onEdit={editTask}
                  onToggle={toggleTask}
                  task={task}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">✳</span>
              <h3>{filter === 'Completed' ? 'Nothing completed just yet' : filter === 'Active' ? 'You’re all caught up' : 'A fresh page'}</h3>
              <p>{filter === 'Completed' ? 'Check off a task when you finish it, and it’ll appear here.' : filter === 'Active' ? 'There are no active tasks. Enjoy the breathing room.' : 'Add a task and give your day a little direction.'}</p>
              {filter === 'All tasks' && !showForm && (
                <button className="text-button" onClick={() => setShowForm(true)} type="button">Add your first task →</button>
              )}
            </div>
          )}
        </div>

        {showForm && (
          <aside className="form-column">
            <TaskForm
              key={editingTask?._id ?? 'new'}
              onCancel={closeForm}
              onSave={saveTask}
              saving={saving}
              task={editingTask}
            />
          </aside>
        )}
      </section>
      <footer className="footer-note">One thing at a time. You’re doing great.</footer>
    </main>
  )
}

export default App
