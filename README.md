# Todo List API

This is a RESTful API for a Todo List application built with Node.js, Express, and PostgreSQL using
Sequelize as the ORM. The API includes user authentication, and features for creating, updating, and
managing todos.

## Table of Contents

- [Requirements](#requirements)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Requirements

- Node.js (v18+)
- PostgreSQL (v11)
- npm (v7+)

## Features

- User registration and login with JWT authentication
- Password reset with email confirmation
- Protected routes for managing todos
- CRUD operations for todos
- Pagination and filtering for todo lists
- Image upload and resizing for user profiles

## Technologies

- Node.js
- Express.js
- PostgreSQL and Sequelize
- JWT for authentication
- Multer and Sharp for file uploads and image processing

## Installation

1. Clone the repository.

```bash
git clone https://github.com/your-username/todo-list-api.git
cd todo-list-api
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables. Create a `.env` file in the root directory and configure the
   following variables:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
EMAIL_HOST=smtp.your-email-service.com
EMAIL_PORT=your_email_port
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password
```

## Usage

```bash
npm start
```

## API Endpoints

### Authentication

- POST /api/v1/auth/register - Register a new user
- POST /api/v1/auth/login - Log in a user
- PATCH /api/v1/auth/updatePassword - Update user password
- POST /api/v1/auth/forgotPassword - Send password reset email
- PATCH /api/v1/auth/resetPassword/:token - Reset password using the token

### Todo Routes

- GET /api/v1/todos - Get all todos (supports pagination and filtering)
- POST /api/v1/todos - Create a new todo
- GET /api/v1/todos/:id - Get a single todo
- PATCH /api/v1/todos/:id - Update a todo
- DELETE /api/v1/todos/:id - Delete a todo
- PATCH /api/v1/todos/:id/completed - Mark a todo as completed or uncompleted
- PATCH /api/v1/todos/:id/important - Mark a todo as important or not

### User Routes

- GET /api/v1/users - Get all users (admin only)
- PATCH /api/v1/users - Update the current user's information and photo
- DELETE /api/v1/users - Delete the current user's account
