# Collify – Modern Classroom & Testing Platform

![Collify Banner](https://via.placeholder.com/1280x400/6366f1/ffffff?text=Collify+-+Learn+Better+Together)  
<!-- Replace this placeholder with a real banner later (use Canva/Figma) -->

A full-stack web application that combines **Google Classroom-style classroom management** with a powerful **built-in testing platform** — supporting **MCQ quizzes with auto-grading** and (upcoming) **coding/DSA problem submissions**.

- **Teachers** can create classrooms, post quizzes (MCQs + coding), manage students, and grade submissions.
- **Students** can join classrooms, attempt quizzes, submit code, and instantly see scores.

Built with **Next.js (JavaScript)** for the frontend and **Node.js + Express + MongoDB** for the backend.

## ✨ Features

### Core Features
- User authentication (register / login) with role-based access (student / teacher)
- JWT token-based authorization & route protection
- Create & join classrooms using unique auto-generated join codes
- Teacher-only classroom management

### Testing & Examination Platform
- Create MCQ quizzes with auto-grading
- Add multiple-choice questions with options, correct answers, and marks
- Students can attempt quizzes and get instant scores
- Attempt tracking, submission history, and basic results
- **Planned** — Coding/DSA problem creation, code submission, manual/auto grading

### Tech Highlights
- Modern **Next.js 14** (App Router) + JavaScript
- **Express** backend with Mongoose & JWT
- Role-based middleware protection
- Password hashing with bcrypt
- MongoDB Atlas (cloud database)
- Tailwind CSS for responsive UI (being added)

## 🛠 Tech Stack

| Layer          | Technology                              |
|----------------|-----------------------------------------|
| Frontend       | Next.js 14 (App Router), React          |
| Styling        | Tailwind CSS                            |
| Backend        | Node.js, Express.js                     |
| Database       | MongoDB Atlas + Mongoose                |
| Authentication | JWT (jsonwebtoken), bcrypt              |
| Forms          | react-hook-form + zod (planned)         |
| API Client     | fetch / axios                           |

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (free tier is enough)
- Git

### Backend Setup

1. Clone the repo
   ```bash
   git clone https://github.com/yourusername/collify.git
   cd collify
