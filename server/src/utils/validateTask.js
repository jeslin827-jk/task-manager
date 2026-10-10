const allowedFields = new Set(['title', 'description', 'completed'])

export function validateTaskInput(input, { partial = false } = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { error: 'Request body must be a JSON object.' }
  }

  const fields = Object.keys(input)
  if (fields.some((field) => !allowedFields.has(field))) {
    return { error: 'Only title, description, and completed fields are allowed.' }
  }
  if (fields.length === 0) {
    return { error: 'Provide at least one field to update.' }
  }

  const values = {}
  if ('title' in input) {
    if (typeof input.title !== 'string' || !input.title.trim()) {
      return { error: 'Task title is required.' }
    }
    if (input.title.trim().length > 120) {
      return { error: 'Task titles must be 120 characters or fewer.' }
    }
    values.title = input.title.trim()
  } else if (!partial) {
    return { error: 'Task title is required.' }
  }

  if ('description' in input) {
    if (typeof input.description !== 'string') {
      return { error: 'Task description must be text.' }
    }
    if (input.description.trim().length > 500) {
      return { error: 'Descriptions must be 500 characters or fewer.' }
    }
    values.description = input.description.trim()
  } else if (!partial) {
    values.description = ''
  }

  if ('completed' in input) {
    if (typeof input.completed !== 'boolean') {
      return { error: 'Completed status must be true or false.' }
    }
    values.completed = input.completed
  } else if (!partial) {
    values.completed = false
  }

  return { values }
}
