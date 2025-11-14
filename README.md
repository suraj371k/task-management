# Full Stack Todo App (React + Node.js + TypeScript)

This is a full stack web application build with modern technology i.e MERN stack with typescript

## Tech Stack

### **Frontend**

* React (TypeScript)
* React Router Dom
* React Query
* Zustand
* React Hook Form
* Zod
* Shadcn UI

### **Backend**

* Node.js (TypeScript)
* Express
* MongoDB Atlas
* Mongoose
* JWT Authentication
* Bcryptjs
* Cookie-Parser

---

## Features

### **Authentication**

* Signup
* Login
* Forgot Password
* Reset Password

### **Todo Management**

* Create Todo
* Update Todo
* List Todos
* Delete Todo
* Mark Todo as completed / not completed
* Priority based like low , medium , high.

### **Backend Extras**

* All errors are logged into a separate MongoDB collection
* Proper error handling using middleware

---

##  Project Structure

### **Backend**

```
backend/
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.ts
└── tsconfig.json
```

### **Frontend**

```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── types/
    |- lib/
│   └── main.tsx
└── tsconfig.json
```

---

## Environment Variables

### **Backend `.env`**

```
MONGODB_URI

JWT_SECRET

PORT

FRONTEND_URL

EMAIL_PASSWORD

EMAIL_USER

```


## How to Run the Project

### **Backend**

```bash
cd backend
npm install
npm run dev
```

### **Frontend**

```bash
cd frontend
npm install
npm run dev
```

---

##  Assumptions

* UI is kept simple and clean.
* Todos are private to each user.

---

##  Demo Video

The demo video includes:

* Adding a todo
* Updating a todo
* Listing todos
* Deleting a todo
* Login
* Logout

Video uploaded to Google Drive.

---

##  Submission

* GitHub Repository Link: https://github.com/suraj371k/task-management
* Google Drive Video Link: https://drive.google.com/file/d/1IZ5Gcnfrsf8QhS9e6ECwQCj9AdKpZGr-/view?usp=sharing

---

