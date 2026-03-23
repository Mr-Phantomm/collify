<div align="center">

  <h1>📚 Collify</h1>
  <p>
    <strong>Modern Classroom & Testing Platform</strong><br />
    Create classes • Run MCQ quizzes with auto-grading • Join with code • Future: coding problems & attendance
  </p>

  <p>
    <a href="https://github.com/Mr-Phantomm/collify/stargazers">
      <img src="https://img.shields.io/github/stars/yourusername/collify?style=social" alt="GitHub stars" />
    </a>
    <a href="https://github.com/Mr-Phantomm/collify/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/yourusername/collify?color=blue" alt="License" />
    </a>
    <a href="https://github.com/Mr-Phantomm/collify/issues">
      <img src="https://img.shields.io/github/issues/yourusername/collify?color=red" alt="Issues" />
    </a>
    <a href="https://github.com/Mr-Phantomm/collify/pulls">
      <img src="https://img.shields.io/github/issues-pr/yourusername/collify?color=purple" alt="Pull Requests" />
    </a>
  </p>

</div>

<br />

## ✨ Features

| Category             | Status | Description                                                                 |
|----------------------|--------|-----------------------------------------------------------------------------|
| Authentication       | ✅     | Register / Login with role (Student / Teacher) + JWT                        |
| Classrooms           | ✅     | Create classroom • Unique join code • Join classroom • My classrooms list   |
| Posts & Announcements| ✅     | Teacher can post notices / materials / Google Meet links                    |
| MCQ Quizzes          | ✅     | Create quizzes • Auto-grading • Instant feedback for students               |
| Attendance           | 🚧     | Teacher marks present/absent • Student views own attendance                 |
| Coding / DSA Problems| ⏳     | Planned – submission + judging (Judge0 or custom)                           |
| Role-based UI        | ✅     | Teacher sees create/mark controls • Student sees attempt/view mode          |

<br />

## 🛠 Tech Stack

| Layer       | Technology                          | Why we chose it                              |
|-------------|-------------------------------------|----------------------------------------------|
| Frontend    | Next.js 14 (App Router) + React     | Fast, SEO-friendly, great developer experience |
| Styling     | Pure CSS / CSS Modules              | Full control, no bloat, learning focused     |
| Backend     | Node.js + Express                   | Simple, fast API development                 |
| Database    | MongoDB Atlas + Mongoose            | Flexible schema, easy cloud setup            |
| Auth        | JWT + bcrypt                        | Secure tokens & password hashing             |
| File Upload | Multer + Cloudinary (planned)       | Easy PDF/image attachments                   |

<br />

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js ≥ 18
- MongoDB Atlas account (free tier works perfectly)

### Backend

```bash
cd backend
npm install
```

### Create .env file in backend/ folder:
```bash
envPORT=5000
DB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-very-long-random-secret-here
CLOUDINARY_CLOUD_NAME=xxx     # optional for now
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

### Start backend:
```bash
npm start
```

### Frontend
```bash
cd ../frontend
npm install
npm run dev
Open http://localhost:3000
```


## 🗺 Current Roadmap

 Authentication & roles
 Classroom create / join
 Dashboard + classroom list
 Posts (announcements / materials)
 Quiz creation & attempt UI
 Attendance marking + view
 Coding submission & judging
 Responsive design polish
 Deployment (Vercel frontend + Render backend)


## 🤝 Contributing
Pull requests are welcome!

1. Fork the repo
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request


  Happy Learning & Teaching! 🚀

```
