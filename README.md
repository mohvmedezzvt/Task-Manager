# Task Manager

# Task-Manager Backend

This repository contains the backend code for a Task-Manager. The backend is built with Node.js, Express.js, and MongoDB, providing APIs for managing projects, tasks, and team members. It includes features like user authentication and notifications.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Models](#models)
- [Validations](#validations)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization
- Project management (CRUD operations) with lazy loading and projection
- Task management (CRUD operations) with lazy loading and projection
- Team management (add/remove members)
- Notifications for project members
- Ptoject invitations

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/mohvmedezzvt/Task-Manager.git
    cd Task-Manager
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a .env file in the root directory and add the following environment variables:
    ```bash
    PORT=your_available_port
    MONGO_URI=mongodb://localhost:27017/task_manager
    JWT_SECRET=your_jwt_secret
    ```

4. Start the server:
    ```bash
    npm start
    ```

## Usage

### Authentication

- Register a new user:
  ```http
  POST /api/v1/auth/register
  ```

- Login a user:
  ```http
  POST /api/v1/auth/login
  ```

- Get the current user:
  ```http
  GET /api/v1/users/me
  ```

### Projects

- Get all projects:
  ```http
  GET /api/v1/projects
  ```

- Get a project by ID:
  ```http
  GET /api/v1/projects/:projectId
  ```

- Create a project:
  ```http
  POST /api/v1/projects
  ```

- Update a project:
  ```http
  PATCH /api/v1/projects/:projectId
  ```

- Delete a project:
  ```http
  DELETE /api/v1/projects/:projectId
  ```

### Project Members

- Get all invitations:
  ```http
  GET /api/v1/invitations
  ```

- Get all members of a project:
  ```http
  GET /api/v1/projects/:projectId/members
  ```

- Invite a user to a project:
  ```http
  POST /api/v1/projects/:projectId/invite
  ```

- Respond to an invitation:
  ```http
  PATCH /api/v1/invitations/:invitationId
  ```

- Remove a member from a project:
  ```http
  DELETE /api/v1/projects/:projectId/members
  ```

### Tasks

- Get all tasks of a project:
  ```http
  GET /api/v1/projects/:projectId/tasks
  ```

- Get a task by ID:
  ```http
  GET /api/v1/tasks/:taskId
  ```

- Create a new task:
  ```http
  POST /api/v1/projects/:projectId/tasks
  ```

- Update a task:
  ```http
  PATCH /api/v1/tasks/:taskId
  ```

- Update a task priority:
  ```http
  PATCH /api/v1/projects/:projectId/tasks/:taskId/priority
  ```

- Delete a task:
  ```http
  DELETE /api/v1/tasks/:taskId
  ```

### Notifications

- Get all notifications for the user:
  ```http
  GET /api/v1/notifications
  ```

- Mark a notification as read:
  ```http
  PATCH /api/v1/notifications/:notificationId
  ```

- Mark all notifications as read:
  ```http
  PATCH /api/v1/notifications/read
  ```

- Delete a notification:
  ```http
  DELETE /api/v1/notifications/read
  ```

## Models

### User

- `username`: String, required
- `email`: String, required, unique
- `password`: String, required
- `projects`: Array of Project references

### Project

- `name`: String, required
- `description`: String
- `createdBy`: User reference, required
- `members`: Array of User references
- `tasks`: Array of Task references

### Task

- `name`: String, required
- `description`: String
- `status`: String (e.g., "pending", "in-progress", "completed")
- `dueDate`: Date
- `createdBy`: User reference, required
- `assignedTo`: User reference
- `project`: Project reference, required
- `priority`: String (e.g., "low", "medium", "high")

### Notification

- `user`: User reference, required
- `message`: String, required
- `read`: Boolean, default false
- `createdAt`: Date, default Date.now

## Validations

### Project Validation

- `name`: Required, string, min length 3, max length 50
- `description`: Optional, string, max length 500

### Task Validation

- `name`: Required, string, min length 3, max length 50
- `description`: Optional, string, max length 500
- `status`: Optional, string, one of ["to-do", "in-progress", "done"]
- `dueDate`: Optional, date

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License.
