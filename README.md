# React + Vite

1.**System design summary**

A role‑based e‑learning platform with three personas:

Admin: creates/manages courses, users, and global settings.

Teacher: publishes materials, creates assessments, tracks student progress.

Student: enrolls, studies content, takes tests/assessments, views progress.

Core features: authentication + authorization (RBAC), course lifecycle, enrollment, content delivery, assessments/submissions, progress tracking, notifications.

Tech Stack Used:

Frontend: React + Vite, React Router, Axios (API client), State (Redux Toolkit ), React Hook Form, Tailwind CSS.

Backend: Node.js + Express, JWT (access/refresh), Role-based middleware, Validation (Joi), File upload (Cloudinary SDK),Caching (Redis)

Databse: Mongo db(atlas)
