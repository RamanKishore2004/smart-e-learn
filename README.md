# React + Vite

1.**System design summary**

A role‑based e‑learning platform with three personas:

Admin: creates/manages courses, users, and global settings.

Teacher: publishes materials, creates assessments, tracks student progress.

Student: enrolls, studies content, takes tests/assessments, views progress.

Core features: authentication + authorization (RBAC), course lifecycle, enrollment, content delivery, assessments/submissions, progress tracking, notifications.

Student → UI → API Gateway → Auth Service → Course Service → DB
Teacher → UI → API Gateway → Progress Service → DB
Admin   → UI → API Gateway → Admin Service → DB

**Architectural Diagram**
<img width="1758" height="788" alt="Screenshot 2025-11-11 222829" src="https://github.com/user-attachments/assets/69a6936e-5e2c-4296-beca-6cb1b2c5ab63" />
