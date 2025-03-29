# KidStudy Server API

RESTful API for KidStudy application built with Express.js, PostgreSQL, and Drizzle ORM.

## Project Structure

The project follows the Service-Repository pattern:

```
src/
├── config/         # Configuration files
├── controllers/    # API controllers
├── middlewares/    # Express middlewares
├── models/         # Database schema definitions
├── repositories/   # Data access layer
├── routes/         # API routes
├── services/       # Business logic layer
└── utils/          # Utility functions
```

## Database Setup

1. Create a PostgreSQL database named `kidstudy`
2. Run the SQL schema in `database/schema.sql` to create the tables

## Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials
```

## Running the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Units

- `GET /api/units` - Get all units
- `GET /api/units/:id` - Get unit by ID
- `GET /api/units/with-lessons` - Get all units with lessons
- `GET /api/units/:id/with-lessons` - Get unit with lessons
- `POST /api/units` - Create a new unit
- `PUT /api/units/:id` - Update unit
- `DELETE /api/units/:id` - Delete unit

### Lessons

- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get lesson by ID
- `GET /api/lessons/by-unit/:unitId` - Get lessons by unit ID
- `GET /api/lessons/:id/with-challenges` - Get lesson with challenges
- `POST /api/lessons` - Create a new lesson
- `PUT /api/lessons/:id` - Update lesson
- `DELETE /api/lessons/:id` - Delete lesson

### Challenges

- `GET /api/challenges` - Get all challenges
- `GET /api/challenges/:id` - Get challenge by ID
- `GET /api/challenges/by-lesson/:lessonId` - Get challenges by lesson ID
- `GET /api/challenges/:id/with-options` - Get challenge with options
- `POST /api/challenges` - Create a new challenge
- `PUT /api/challenges/:id` - Update challenge
- `DELETE /api/challenges/:id` - Delete challenge

### User Progress

- `GET /api/user-progress/:userId` - Get user profile
- `GET /api/user-progress/:userId/challenges` - Get user challenge progress
- `POST /api/user-progress` - Create/Update user profile
- `PUT /api/user-progress/:userId/challenge/:challengeId` - Update challenge progress
- `PUT /api/user-progress/:userId/hearts` - Update hearts
- `PUT /api/user-progress/:userId/points` - Update points
- `PUT /api/user-progress/:userId/active-unit` - Update active unit

### Conversations

- `GET /api/conversations/user/:userId` - Get user conversations
- `GET /api/conversations/:id` - Get conversation with messages
- `POST /api/conversations` - Create a new conversation
- `POST /api/conversations/:id/messages` - Add a message to conversation
