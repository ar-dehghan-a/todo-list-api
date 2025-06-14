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
- [Development](#development)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Security Features](#security-features)

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
- Push notifications for due dates
- Email notifications for important events
- Rate limiting for API endpoints
- Request logging and monitoring
- Error handling and validation

## Technologies

- Node.js and Express.js
- PostgreSQL and Sequelize ORM
- JWT for authentication
- Multer and Sharp for file uploads and image processing
- Winston for logging
- Nodemailer for email notifications
- Web Push for browser notifications
- Helmet for security headers
- CORS for cross-origin resource sharing
- Compression for response compression
- Morgan for HTTP request logging
- Joi for request validation

## Installation

1. Clone the repository:

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
# Server Configuration
NODE_ENV=development
PORT=3000
BASE_URL=your_base_url
BASE_API_URL=your_base_url/api/v1
BASE_CLIENT_URL=your_client_rul

# Database
DATABASE_URL=your_database_url

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Email Configuration
MAIL_HOST=smtp.your-email-service.com
MAIL_PORT=your_email_port
MAIL_USER=your_email_username
MAIL_PASSWORD=your_email_password

# Push Notification Configuration
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

## Usage

Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

For production development:

```bash
npm run dev:prod
```

## Development

The project uses ESLint and Prettier for code formatting and linting. The configuration files are:

- `.eslintrc.js` - ESLint configuration
- `.prettierrc` - Prettier configuration

## Project Structure

```
todo-list-api/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── migrations/     # Database migrations
├── public/             # Static files
├── server.js          # Application entry point
└── package.json       # Project dependencies
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

## Error Handling

The API implements a global error handling middleware that:

- Catches and formats all errors
- Provides appropriate HTTP status codes
- Returns consistent error response format
- Logs errors for debugging

## Security Features

- JWT-based authentication
- Password hashing
- Rate limiting
- CORS protection
- Security headers with Helmet
- Input validation with Joi
- SQL injection prevention with Sequelize
- XSS protection
- Request size limiting
