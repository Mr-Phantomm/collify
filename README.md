# Collify – Classroom + Testing Platform

A full-stack learning platform inspired by Google Classroom with built-in quiz/testing features (MCQs with auto-grading + planned coding/DSA problems).

- Teachers: create classrooms, make quizzes (MCQ), manage students
- Students: join classrooms, attempt quizzes, see scores

Frontend: Next.js (JavaScript) + Tailwind  
Backend: Node.js / Express / MongoDB Atlas

## Features Done
- Register / Login (student & teacher roles)
- JWT authentication & role protection
- Create classroom (teacher only)
- Join classroom using code
- MCQ quiz creation & auto-grading
- Student quiz attempt & instant score

## Features Planned
- Coding / DSA problem submission
- Teacher manual grading view
- Full dashboard with classrooms list
- Responsive UI + Navbar
- Attendance, notices, file uploads

## Tech Stack
- Frontend: Next.js 14 (App Router), React, Tailwind CSS
- Backend: Node.js, Express, Mongoose
- Database: MongoDB Atlas
- Auth: JWT + bcrypt

## Quick Setup

### 1. Clone repo
git clone https://github.com/YOUR_USERNAME/collify.git
cd collify

### 2. Backend
cd backend
npm install

Create .env file in backend/:
PORT=5000
DB_URI=mongodb+srv://<user>:<pass>@cluster0.xxx.mongodb.net/collify?retryWrites=true&w=majority
JWT_SECRET=super_long_random_secret_1234567890

npm start
→ should show "Server is running on port 5000"

### 3. Frontend (new terminal)
cd ../frontend
npm install
npm run dev

→ open http://localhost:3000

### Default flow
1. Register → choose student/teacher
2. Login
3. Dashboard → see classrooms
4. Teacher → create classroom
5. Student → join with code → attempt quiz

## Folder Structure
collify/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── app/           ← login, register, dashboard...
│   │   ├── components/
│   │   └── lib/
│   └── package.json
└── README.md

## Current Status (Feb 2026)
✅ Auth + roles  
✅ Classrooms (create/join)  
✅ MCQ quizzes + auto-grading  
✅ Quiz attempt & score  
🚧 Dashboard + classrooms fetch  
⏳ Coding problems  
⏳ Teacher grading  
⏳ Full UI polish

## Contributing
1. Fork
2. git checkout -b feature/your-feature
3. git commit -m "Add feature"
4. git push origin feature/your-feature
5. Open Pull Request

MIT License  
Feel free to fork, learn, modify.

Made with ❤️ by Arun
