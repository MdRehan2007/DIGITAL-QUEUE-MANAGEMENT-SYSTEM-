# DIGITAL-QUEUE-MANAGEMENT-SYSTEM-

## Description
This project is a Digital Queue Management System developed using the MERN stack (MongoDB, Express.js, React.js, Node.js). It helps users join a queue digitally and track their position instead of waiting in physical lines.

--

## 🎯 Features
- User Registration and Login
- Generate digital token
- View queue position
- Admin can call next token
- Admin can skip tokens
- Role-based access (User / Admin / Super Admin)
- Responsive and user-friendly UI

--

## 🛠️ Tech Stack
- Frontend: React.js, TailwindCSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT

---

## 🧠 Project Structure
- Client (Frontend UI)
- Server (Backend APIs)
- MVC Architecture:
  - Models → Database structure
  - Controllers → Business logic
  - Routes → API endpoints

---

## 🔄 How It Works
1. User logs in or registers
2. User joins the queue and gets a token
3. Admin manages the queue (next / skip)
4. System updates queue status in real-time

---

## 🚀 Installation

### Backend
```bash
cd server
npm install
npm run dev

### Frontend
```bash
cd client
npm install
npm run dev
