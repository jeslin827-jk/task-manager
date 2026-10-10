# TaskFlow Task Manager

TaskFlow is a beginner-friendly task manager built with React, Express, and MongoDB. Tasks can be created, viewed, edited, deleted, and marked complete. The application includes a responsive interface, task filters, progress indicators, and persistent storage in MongoDB.

## Live Demo

- **Frontend:** https://taskflow-sx8j.onrender.com
- **Backend API:** https://taskflow-api-nte7.onrender.com
- **Health check:** https://taskflow-api-nte7.onrender.com/api/health
- **Tasks endpoint:** https://taskflow-api-nte7.onrender.com/api/tasks

> The backend API endpoints return JSON. Open the frontend link to use the application. Render's free services may take around 50 seconds to wake after inactivity.

## Features

- Create tasks with a title and optional description
- View tasks saved in MongoDB
- Edit task details
- Mark tasks as complete or incomplete
- Delete tasks
- Filter tasks by All, Active/Pending, and Completed
- View task counts and completion progress
- Responsive React interface
- REST API built with Express
- Input validation and API error handling

## Tech Stack

- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas with Mongoose
- **Deployment:** Render
- **Development assistance:** Code0 / CodeZero extension

## Project Structure

```text
task-manager/
├── client/                 # React interface built with Vite
│   └── src/
│       ├── App.jsx         # Task list, filters, and form
│       ├── App.css         # Task interface styles
│       ├── index.css       # Global styles
│       └── main.jsx        # React entry point
├── server/                 # Express REST API
│   └── src/
│       ├── config/          # MongoDB connection
│       ├── controllers/     # Task request handling
│       ├── models/          # Mongoose data models
│       ├── routes/          # API routes
│       └── server.js        # Server entry point
└── README.md
```

## Run Locally

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm
- MongoDB local instance or MongoDB Atlas account

### 1. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
```

For MongoDB Atlas, replace the local MongoDB URI with your Atlas connection string. Keep `.env` private and never commit credentials to GitHub.

Start the backend:

```bash
npm run dev
```

### 2. Set up the frontend

Open a second terminal from the project root:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. The Vite development proxy forwards `/api` requests to the local backend at `http://localhost:5000`.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Check API health |
| GET | `/api/tasks` | Retrieve tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update task details or completion status |
| DELETE | `/api/tasks/:id` | Delete a task |

### Validation

- Task title is required and limited to 120 characters.
- Description is optional and limited to 500 characters.
- Completion status must be a Boolean.
- Invalid requests return a `400` response; a task that cannot be found returns `404`.

## Verification

The following project checks were run during development:

```bash
cd client
npm run lint
npm run build
```

```bash
cd server
npm test
```

The frontend lint and production build passed, and all six server validation tests passed. The deployed backend was also checked: `/api/health` returned `{"status":"ok"}`, and `/api/tasks` returned task data from MongoDB.

## Code0 / CodeZero AI Development Experience

Code0 was used during development to assist with implementation, debugging, and verification. Specific examples include:

1. **React task interface:** helped implement the task form, task list, edit/delete actions, completion controls, and filters.
2. **Express REST API:** helped build and refine task endpoints and request validation.
3. **MongoDB persistence:** helped review the Mongoose connection and task data flow.
4. **Error handling and deployment configuration:** helped diagnose API request errors and configure the frontend to call the deployed API in production while retaining the local Vite proxy for development.
5. **Documentation and checks:** helped update setup/API documentation and run frontend lint/build checks and server validation tests.

The reported automated checks passed as described in the Verification section. The live deployment was then manually checked using the health and tasks endpoints.

## Notes

- The backend and frontend are deployed as separate Render services.
- Render free services may spin down after inactivity, so the first request can be delayed while a service starts.
- Do not commit `.env` files, database passwords, or other secrets.
