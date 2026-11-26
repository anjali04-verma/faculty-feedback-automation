# Faculty Feedback Automation System

A web-based Faculty Feedback Automation System developed to simplify the process of collecting, managing, and analyzing student feedback about faculty members.

The system provides separate dashboards for Students, Faculty, and Admin to manage feedback efficiently.

## Project Screenshots

### 1. Login Page
Users can log in using their email and password and select their role.

### 2. Student Dashboard
- View total faculty members.
- Submit faculty feedback.
- View feedback history.
- Manage personal profile.
- Customize dashboard settings.

### 3. Faculty Dashboard
- View received feedback.
- Check average ratings.
- Analyze feedback.
- View personal profile and settings.

### 4. Admin Dashboard
- View total students, faculty, and feedback.
- Add and manage student records.
- Add and manage faculty records.
- View all submitted feedback.
- Generate feedback summaries and analytics.
- Manage profile and settings.

## Features

- Role-based login for Student, Faculty, and Admin.
- Student feedback submission.
- Faculty-wise feedback management.
- Rating-based feedback system.
- Feedback history and analytics.
- Admin dashboard for managing students and faculty.
- Light and Dark theme support.
- Responsive dashboard interface.
- Local storage for demo data persistence.

## Technology Stack

**Frontend**
- React.js
- Vite
- JavaScript
- Tailwind CSS

**Libraries**
- React Router DOM
- Lucide React

**Storage**
- Browser Local Storage

## Project Structure

```text
Faculty-Feedback/
│
├── public/
│
├── src/
│   ├── components/
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── SettingPanel.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── FacultyDashboard.jsx
│   │   └── AdminDashboard.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── index.html
└── README.md
```

*Note: Update the folder structure if your actual project contains different filenames or folders.*

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to Project Folder

```bash
cd Faculty-Feedback
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## How It Works

1. Users open the application and log in.
2. Students submit feedback for faculty members.
3. Feedback is stored in browser Local Storage.
4. Faculty members can view feedback and ratings.
5. Admin manages student and faculty records.
6. Admin can monitor feedback and view analytics.

## Future Enhancements

- Backend integration using Node.js and Express.
- Database integration using MongoDB or MySQL.
- Secure authentication and authorization.
- Email notifications for feedback submission.
- Export feedback reports in PDF or Excel format.
- Advanced graphical analytics.
- Anonymous feedback support.

## Project Purpose

The main objective of this project is to digitize the faculty feedback process, improve transparency, reduce manual work, and provide useful insights for improving teaching quality.

---

**Project:** Faculty Feedback Automation System  
**Institution:** ABES Engineering College  
**Project Type:** Web Development Project
