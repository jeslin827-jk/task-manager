# TaskFlow Task Manager

TaskFlow is a beginner-friendly task manager built with React, Express, and MongoDB. Tasks are saved in MongoDB and can be created, viewed, edited, deleted, and marked complete.

## Project structure

```text
task-manager/
├── client/                  # React interface built with Vite
│   └── src/
│       ├── App.jsx           # Task list, filters, and form
│       ├── App.css           # Responsive task interface styles
│       └── index.css         # Global styles
└── server/                  # Express REST API
    └── src/
        ├── config/           # MongoDB connection
        ├── controllers/      # Task request handling
        ├── middleware/       # API error responses
        ├── models/           # Mongoose task schema
        ├── routes/           # API endpoints
        └── utils/            # Input validation
```

## Requirements

- Node.js 20.19 or newer (or 22.12 or newer) and npm
- MongoDB running locally, or a MongoDB Atlas connection string

## Setup

1. Install the frontend packages:

   ```powershell
   cd client
   npm install
   ```

2. Install the backend packages:

   ```powershell
   cd ..\server
   npm install
   ```

3. Create the backend environment file by copying the example:

   ```powershell
   Copy-Item .env.example .env
   ```

4. Open `.env` in the `server` directory. The example uses a local MongoDB database:

   ```text
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
   ```

   Start MongoDB before starting the API. To use MongoDB Atlas instead, replace `MONGODB_URI` with your Atlas connection string. Keep real credentials in `.env`, not in source control.

## Run the application

Open two terminals from the project root.

In the first terminal, start the API:

```powershell
cd server
npm run dev
```

In the second terminal, start the React app:

```powershell
cd client
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). During development, Vite forwards `/api` requests to the Express server on port 5000.

## API overview

The API uses JSON. Successful list, create, and update responses contain a `data` property; errors contain a human-readable `message`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Check that the API is running |
| `GET` | `/api/tasks` | List tasks, newest first |
| `POST` | `/api/tasks` | Create a task |
| `PATCH` | `/api/tasks/:id` | Update task title, description, or completion status |
| `DELETE` | `/api/tasks/:id` | Delete a task |

Example create request:

```json
{
  "title": "Prepare project proposal",
  "description": "Gather notes and outline the first draft."
}
```

Titles are required and limited to 120 characters. Descriptions are optional and limited to 500 characters. Completion status must be a Boolean. Invalid task input receives an HTTP `400` response; unknown task IDs and routes return clear `404` responses.

## Checks

Run the frontend linter and production build:

```powershell
cd client
npm run lint
npm run build
```

Run the backend input validation tests:

```powershell
cd server
npm test
```

## AI Development Experience

CodeZero was used throughout development of this assessment. It assisted with:

- Implementing the React task interface, including task forms, list filters, progress display, and error states.
- Building the Express REST API and wiring task persistence through Mongoose and MongoDB.
- Adding task input validation and backend validation tests.
- Reviewing setup and API documentation and running the backend test suite; all 6 tests passed.

Frontend lint and production build checks pass, and all 6 backend input-validation tests pass. A live MongoDB or Atlas connection was not verified as part of these checks. The developer should configure their own MongoDB connection and verify the application in their local environment.

