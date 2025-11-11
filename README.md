# React + Vite

1.**SYSTEM DESIGN SUMMARY**

A role‑based e‑learning platform with three personas:

Admin: creates/manages courses, users, and global settings.

Teacher: publishes materials, creates assessments, tracks student progress.

Student: enrolls, studies content, takes tests/assessments, views progress.

Core features: authentication + authorization (RBAC), course lifecycle, enrollment, content delivery, assessments/submissions, progress tracking, notifications.

Student → UI → API Gateway → Auth Service → Course Service → DB
Teacher → UI → API Gateway → Progress Service → DB
Admin   → UI → API Gateway → Admin Service → DB

**Architectural Diagram**
(Overall workflow)
<img width="1758" height="788" alt="Screenshot 2025-11-11 222829" src="https://github.com/user-attachments/assets/69a6936e-5e2c-4296-beca-6cb1b2c5ab63" />
<img width="1638" height="749" alt="Screenshot 2025-11-11 223157" src="https://github.com/user-attachments/assets/bec8c46c-fb1a-40e3-a3f8-49e0208bde34" />

2.**TECHNOLOGY STACK USED**

**Frontend:**

React + Vite

-React Router (protected routes)

-UI: Bootstrap

-State: Redux

-Axios/Fetch for API

**Backend:**

- Node.js + Express

- JWT auth

- Cloud storage SDK for uploads

- Validation with Joi

**Database:**

-MongoDB (Atlas)

3.**KEY CHALLENGES FACED**

**->** AI Chatbot Integration Limitations:
I added an AI chatbot in the system, but the API I used only allowed around 20 free requests. After that, it stopped working unless I paid for it. So basically, the chatbot worked only for limited usage during development.

**->** Manual Work in Assignments Module:
In the assignments section, I had to manually upload and type the questions. I initially tried generating them using AI, but the results were not aligned with the actual syllabus and lacked proper structure. So manual entry ended up being the most reliable approach.

**->** Backend Validation Issue While Adding Courses:
In the admin panel, while adding course videos, if any input field was left blank, the backend threw errors. This happened due to missing validation and handling for empty fields during the course creation process.

**->** Local Project Crash & Repository Recreation:
I initially maintained regular commits. However, the project got corrupted locally, causing some progress to be lost. Because of that, I had to create a new GitHub repository and re-upload the entire project cleanly.

**->** Learning Curve with Tech Stack & Development Workflow:
The tech stack used in this project was mostly new to me, so understanding and applying it took time. Also, maintaining daily commits and structured development workflow was something I was learning during the process, which led to mistakes and delays—but I improved gradually as the project progressed.




