PropSpace — Property Listing App

Name: KIMBI BLESS TANGIRI
Matricule: LMUI250829
School: Landmark Metropolitan University Institute
Department: Software Engineering
Course: Full Stack Development


Overview

PropSpace is a full-stack property listing web application where users can list, browse, update, and delete properties for rent or sale. It includes user authentication, search/filter, a personal dashboard, and account management.

Tech Stack


Frontend: React.js, Axios, React Router DOM
Backend: Node.js, Express.js
Database: MongoDB (Mongoose)
Auth: JWT + bcryptjs


Features


User registration and login with hashed passwords
JWT protected routes
Create, read, update, delete property listings
Public feed with search and filter
Personal dashboard for managing listings
Profile and password management


Getting Started

Backend

bash:    cd backend
         npm install
         npm run dev

Frontend

bash:    cd frontend
         npm install
         pm start

Environment Variables (backend/.env)

envPORT=5000
MONGO_URI=mongodb://localhost:27017/propspace
JWT_SECRET=propspace_secret_key_2026



Submitted as part of the Full Stack Development practical examination.