Slotify

Slotify is a modern web-based timetable generation and management system designed to simplify academic scheduling for educational institutions. The platform enables administrators to efficiently manage faculty members, academic subjects, classrooms, and timetable-related data through an intuitive dashboard interface. Built with React and Tailwind CSS, Slotify focuses on providing a clean user experience while reducing the complexity of manual timetable management. The system is being developed to support automated timetable generation, conflict prevention, resource allocation, and schedule optimization, making academic scheduling faster, more organized, and error-free.



⚠️⚠️ Turning off Backend Will RESULT IN LOSING THE DATA ⚠️⚠️ 
The Data Is stored in Local Ram as a form of text 





## Features

### Faculty Management

* Add faculty members
* Delete faculty members
* Backend-powered faculty storage
* Dynamic faculty selection

### Subject Management

* Manage subjects
* Assign faculty to subjects
* Configure hours per week

### Section Management

* Manage academic sections
* Dynamic section selection

### Timetable Generation

* Multi-section timetable generation
* Mostly Fisher Yates Algorithm With Constratints
* Also Uses Advanced Random Generation To Convergence With 
* Faculty conflict prevention
* Smart scheduling rules
* Editable timetable slots
* Swap mode for quick timetable adjustments
* Version history support

### Save & Load

* Save generated timetables
* Load previously generated timetables
* Local storage support

### Export

* Export generated timetables as PDF

---

# Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS

## Backend

* Node.js
* Express.js

## Future Enhancements

* MongoDB Integration
* User Authentication
* Advanced Scheduling Constraints
* Cloud Deployment

---

# Project Structure

```text
slotify/

├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── routes/
│   │   ├── faculty.js
│   │   ├── subjects.js
│   │   └── sections.js
│   │
│   ├── server.js
│   ├── package.json
│   └── node_modules/
│
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd slotify
```

---

# Frontend Setup

Open a terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend will start at:

```text
http://localhost:5173
```

---

# Backend Setup

Open a second terminal:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Required packages:

```bash
npm install express cors nodemon
```

Run backend:

```bash
node server.js
```

or

```bash
npx nodemon server.js
```

Backend will start at:

```text
http://localhost:5000
```

---

# API Endpoints

## Faculty

### Get All Faculty

```http
GET /api/faculty
```

### Add Faculty

```http
POST /api/faculty
```

Example Body:

```json
{
  "name": "Dr Rao",
  "department": "CSE",
  "subjects": ["DBMS"]
}
```

### Delete Faculty

```http
DELETE /api/faculty/:id
```

---

# Running the Project

Start Backend:

```bash
cd backend
node server.js
```

Start Frontend:

```bash
cd client
npm run dev
```

Open:

```text
http://localhost:5173
```

Make sure the backend is running before using backend-powered features.

---

# Current Status

Completed:

* Faculty Management API
* Faculty CRUD (GET, POST, DELETE)
* Multi-Section Timetable Generation
* Faculty Conflict Prevention
* Smart Scheduling
* Save & Load Timetables
* Export PDF
* Version History
* Edit & Swap Timetable Slots

In Progress:

* Subject API Integration
* Section API Integration
* MongoDB Persistence

---

# Author

Rohit Reddy

B.Tech CSE

Slotify – Smart Academic Timetable Generator
