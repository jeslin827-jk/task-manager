import assert from 'node:assert/strict'
import test from 'node:test'
import { validateTaskInput } from './validateTask.js'

test('accepts a task and trims its text', () => {
  assert.deepEqual(validateTaskInput({
    title: '  Write README  ',
    description: '  Include setup steps  ',
  }), {
    values: {
      title: 'Write README',
      description: 'Include setup steps',
      completed: false,
    },
  })
})

test('rejects a blank title', () => {
  assert.equal(validateTaskInput({ title: '  ' }).error, 'Task title is required.')
})

test('rejects oversized task titles', () => {
  assert.equal(validateTaskInput({ title: 'a'.repeat(121) }).error, 'Task titles must be 120 characters or fewer.')
})

test('rejects a non-boolean completion status', () => {
  assert.equal(validateTaskInput({ completed: 'true' }, { partial: true }).error, 'Completed status must be true or false.')
})

test('rejects unknown fields and empty updates', () => {
  assert.match(validateTaskInput({ owner: 'someone' }).error, /Only title/)
  assert.match(validateTaskInput({}, { partial: true }).error, /at least one field/)
})

test('allows completion-only updates', () => {
  assert.deepEqual(validateTaskInput({ completed: true }, { partial: true }), {
    values: { completed: true },
  })
})
