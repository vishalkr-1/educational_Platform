# Educational Platform

## Description

The Educational Platform is a web application designed for users to create, manage, and access educational courses and lessons. Users must sign up and log in to utilize the platform's features. The platform includes course and lesson management functionalities, a search feature to find users, courses, and lessons, and leverages Redis for quick data retrieval.

First, the user will sign up, and after all validations are successfully checked, the user will be redirected to the login page, where authentication will take place. After logging in, a JWT token will be generated, which will be stored in cookies. Then, when the user is redirected to the home page, their verification will be done using the JWT token from the cookies. After that, the user can add, view, update (patch), or delete courses and perform CRUD operations with lessons as well. However, whenever a GET operation is performed, the data will first be fetched from the Redis server. If the data is found there, it will be returned to the user. If not, the request will go to the controller, where the data will be fetched from the database and also stored in the Redis server for faster access next time. The data in the Redis server will expire every 1 minute, so any updates made in the database will also reflect in the Redis server. Lastly, there’s a search endpoint that allows the user to search by their name, search for courses by title, and search for lessons by their title.user also able to logout itself.

-[note-user will logged in  only for 1hr after it  automatically logout because cookies will expire in 1hr]

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [User Routes](#user-routes)
  - [Static Routes](#static-routes)
  - [Course Routes](#course-routes)
  - [Lesson Routes](#lesson-routes)
  - [Search Routes](#search-routes)
- [Middleware](#middleware)
- [Caching](#caching)
- [Views](#views)
- [License](#license)

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd <project-directory>
npm install
npm start

```
## Environment Variables
- [Make sure to create a .env file in the root of your project with the following variables:]

makefile
Copy code
PORT=4500
DATABASE_URL=<your_database_url>

## Features

- **User Authentication**:
  - Users can sign up and log in using JSON Web Tokens (JWT) for secure authentication and authorization. Only authenticated users can access protected endpoints.

-**Data Validation**:
 -User input is validated using Express Validator during the signup process to ensure data integrity.

-**password security**:
-Passwords are securely hashed using Bcrypt to protect user credentials.

- **Course Management**:
  - Create new courses.
  - View all courses or filter to see only user-created courses.
  - Update existing courses.
  - Delete courses.

- **Lesson Management**:
  - Create new lessons.
  - View all lessons or filter to see only user-created lessons.
  - Update existing lessons.
  - Delete lessons.

- **Search Functionality**:
  - Search for users by name.
  - Search for courses by title.
  - Search for lessons by title.

- **Server-Side Rendering (SSR)**:
  - Utilizes EJS (Embedded JavaScript) as the templating engine for dynamic HTML rendering on the server.

- **Data Storage**:
  - User data is cached in a Redis server for quick access during data retrieval.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side development.
- **Express.js**: Web framework for building web applications in Node.js.
- **EJS**: Templating engine for server-side rendering of HTML.
- **MongoDB**: NoSQL database for storing user, course, and lesson data.
- **Redis**: In-memory data store for caching user data to enhance performance.
- **JSON Web Tokens (JWT)**: For secure user authentication and authorization.
- **Mongoose**: ODM library for MongoDB to streamline database operations.
- **JavaScript (ES6+)**: Modern JavaScript for backend development.
## Data Models
# User Schema
-- *This schema stores user details including:*

- **name**: User's name (String, required)
- **email**: User's email (String, required, unique, lowercase)
- **password**: User's password (String, required, hashed)
- **location**: User's location (String, required)
- **age**: User's age (Number, required)
# code
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    age: { type: Number, required: true },
});
# Course Schema
-- **This schema stores information about courses**:

-- **title**: Course title (String, required)
-- **description**: Course description (String, required)
-- **userId**: ID of the user who created the course (ObjectId, required)
# code
const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});
# Lesson Schema
-- **This schema stores information about lessons**:

-- **title**: Lesson title (String, required)
-- **content**: Lesson content (String, required)
-- **userId**: ID of the user who created the lesson (ObjectId, required)
-- **courseId**: ID of the course to which the lesson belongs (ObjectId, required)

 
const LessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
});

## API Endpoints
-- **User Routes**
--  POST /users/signup
**Registers a new user.**
Body:

[name (required)
email (required, unique)
password (required, min 8 chars, includes lowercase, uppercase, number, special char)
location (required)
age (required)]
 
 ## Authenticates a user.
-- POST /users/login

Body:

email (required)
password (required)


## Static Routes
-- GET /static/signup
Renders the signup page.

-- GET /static/login
Renders the login page.

-- GET /static/home
Renders the home page for logged-in users.

-- GET /static/lesson
Renders the lesson page for logged-in users.

--- GET /static/search
Renders the search page.

## Course Routes
POST /courses/add
-- Adds a new course.
Body:

courseName (required)
title (required)
description (required)

-- Retrieves all courses for logged-in users.
GET /courses


-- Retrieves the courses created by the logged-in user.
GET /courses/selfCourses

-- Updates a specific course by ID.
PATCH /courses/selfCourses/update/

-- Deletes a specific course by ID.
DELETE /courses/delete/


## Lesson Routes
-- Adds a new lesson.
POST /lesson/add

Body:

title (required)
content (required)

-- Retrieves all lessons for logged-in users.
GET /lesson

-- Retrieves lessons related to a specific course for the logged-in user.
GET /lesson/selfLesson/

-- Updates a specific lesson by ID.
PATCH /lesson/selfLesson/update/

-- Searches for specific content (requires authentication).
Search Routes
GET /search/name

--Logout
POST /users/logout

## Middleware
restrictToLoggedInUserOnly
Middleware to restrict access to routes for authenticated users only.

## Caching
Implemented caching for courses and lessons to enhance performance.

## Views
Utilizes EJS as the templating engine.
Views are located in the /views directory.

## Dependencies

The following packages are required for this project:

```json
"dependencies": {
    "bcrypt": "^5.1.1",             // For hashing passwords
    "cookie-parser": "^1.4.6",      // To parse cookies in requests
    "cookies": "^0.9.1",            // For managing cookies
    "dotenv": "^16.4.5",            // For loading environment variables
    "ejs": "^3.1.10",                // Templating engine
    "express": "^4.21.0",            // Web framework
    "ioredis": "^5.4.1",            // Redis client for Node.js
    "jsonwebtoken": "^9.0.2",        // For generating and verifying JWTs
    "mongoose": "^8.6.3",            // MongoDB object modeling
    "nodemon": "^3.1.7",             // Tool for automatically restarting the server
    "path": "^0.12.7"     ,
    "express-validator": "^7.2.0",
    "ioredis": "^5.4.1",
    "redis": "^4.7.0"           // Utility for working with file and directory paths
}
```
## License
This project is licensed under the MIT License.