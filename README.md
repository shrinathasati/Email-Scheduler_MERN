# Email Marketing Flowchart Scheduler

This project is a MERN stack application that allows users to design and implement email marketing sequences using a visual flowchart interface. It integrates **React Flow** for frontend flowchart visualization and **Agenda** and **Nodemailer** for backend email scheduling.

## Overview

The application allows users to:
- Create a visual flowchart with nodes for **Cold Email**, **Wait/Delay**, and **Lead Source**.
- Save the flowchart and schedule emails based on the time of saving and the configurations of **Wait/Delay** nodes.
- Schedule emails via a backend API using **Agenda** and send emails with **Nodemailer**.

The project also includes a **Login/Signup authentication feature** for managing user accounts securely.

---

## Tech Stack

### **Frontend**
- React.js
- React Flow (for visual flowchart interface)
- Axios
- Styled with CSS
- Deployed on Vercel

### **Backend**
- Node.js
- Express.js
- MongoDB (for data storage)
- Agenda (for email scheduling)
- Nodemailer (for sending emails)
- Deployed on Render

---

## Features

- **Visual Flowchart Interface:**  
  - Add and remove nodes for Cold Email, Wait/Delay, and Lead Source.
  - Save and update flowcharts dynamically.
- **Email Scheduling:**  
  - Backend API to schedule emails based on the flowchart design.
  - Emails sent using Nodemailer after specified delays.
- **Authentication System:**  
  - Secure Login/Signup functionality using JWT.
- **Data Persistence:**  
  - Flowcharts and user details are saved in MongoDB.

---

## Deployment Links

- **Frontend:** [Live Application](https://email-schedular-frontend.vercel.app/)
- **Backend:** Deployed on Render (linked to the frontend).

---

## Installation Instructions

### **Clone the Repository**
git clone https://github.com/shrinathasati/Email-Scheduler_MERN.git
cd Email-Scheduler_MERN


## frontend

npm install
npm run dev

## backend:

npm install
npm run dev


video demo: https://www.loom.com/share/fb07b22a992448afa8c979488b2f90cd?sid=d93edf31-fa4e-4cc7-aca2-d1a821f3222c

