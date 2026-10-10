export function notFoundHandler(_request, response) {
  response.status(404).json({ message: 'Route not found.' })
}

export function errorHandler(error, _request, response, _next) {
  if (error.name === 'CastError') {
    response.status(400).json({ message: 'Task ID is invalid.' })
    return
  }

  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((item) => item.message)
    response.status(400).json({ message: messages.join(' ') })
    return
  }

  if (error.type === 'entity.parse.failed') {
    response.status(400).json({ message: 'Request body contains invalid JSON.' })
    return
  }

  console.error(error)
  response.status(500).json({ message: 'An unexpected server error occurred.' })
}
