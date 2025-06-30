


#  Real-Time Chat Application

A full-stack real-time chat application built with **React**, **Node.js**, **Express**, **MongoDB**, and **Socket.IO**. It features user authentication using JWT, real-time messaging (single and chat), profile setup, emoji support, and a responsive UI.

---

Features

-  **JWT Authentication** — Secure login & signup flow
-  **Real-time Chat** — Powered by Socket.IO
-  **Single & Group Messaging**
-  **User Profile Setup**
-  **Emoji Support** using Emoji Picker
-  **State Management** with Zustand
-  **Timestamps** via Moment.js
-  **Modern UI** built with ShadCN & React Icons

---

Tech Stack

Frontend:
- React
- Zustand (state management)
- Axios (API requests)
- Emoji-picker-react
- React-icons
- ShadCN UI

Backend:
- Node.js
- Express
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- Bcrypt (password hashing)
- Socket.IO (real-time messaging)
- dotenv, cors, cookie-parser

---

Project Structure

```bash
.
├── client/                 # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components
│   └── ...
├── server/                 # Express backend
│   ├── controllers/        # Request handlers
│   ├── routes/             # API routes
│   ├── models/             # Mongoose schemas
│   ├── config/             # DB and environment config
│   └── ...
