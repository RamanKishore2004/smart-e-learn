# React + Vite

1.**SYSTEM DESIGN SUMMARY :**

A role‑based e‑learning platform with three personas:

Admin: creates/manages courses, users, and global settings.

Teacher: publishes materials, creates assessments, tracks student progress.

Student: enrolls, studies content, takes tests/assessments, views progress.

Core features: authentication + authorization (RBAC), course lifecycle, enrollment, content delivery, assessments/submissions, progress tracking, notifications.


**Student → UI → API Gateway → Auth Service → Course Service → DB**

**Teacher → UI → API Gateway → Progress Service → DB**

**Admin   → UI → API Gateway → Admin Service → DB**


**Architectural Diagram**
(Overall workflow)
<img width="1758" height="788" alt="Screenshot 2025-11-11 222829" src="https://github.com/user-attachments/assets/69a6936e-5e2c-4296-beca-6cb1b2c5ab63" />
<img width="1638" height="749" alt="Screenshot 2025-11-11 223157" src="https://github.com/user-attachments/assets/bec8c46c-fb1a-40e3-a3f8-49e0208bde34" />

2.**TECHNOLOGY STACK USED :**

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

3.**KEY CHALLENGES FACED :**

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

4.**LESSONS LEARNED AND POSSIBLE FUTURE ENHANCEMENT :**

**->** Learning New Tech & AI Integration:
Even though the tech stack was new to me, I still explored and integrated an AI chatbot using Google AI Studio because I genuinely wanted to bring AI features into my project. This helped me learn faster, but it also made me realize that before using new tools or APIs, I should first understand their basics, pricing, and limitations.

**->** Need for Proper Planning & Validation:
I learned that planning the workflow and adding proper validations on both front-end and back-end is important. Even a small missing input check can cause errors. Good planning and structured development would have reduced rework and issues.

**->** Importance of Backups & Version Control:
Losing my local project files once made me understand how important regular commits and backups are. Using GitHub properly is not just a formality — it actually saves time and prevents major losses.

**->** Future Improvements & Scalability:
Going forward, I want to replace the chatbot with an open-source / no-limit model, add a question bank generator, provide student performance dashboards, improve the admin upload validation, and also explore building a mobile version. I also want to improve my knowledge of React, Node, MongoDB, and AI APIs to make the system more scalable and user-friendly


5.**Project Demo**

🎥 [Watch the Project Demo on YouTube](https://youtu.be/nttHs2qpc0s?si=q8_UJYz5xQw_e2wj)

