# Habit & Expense Tracker

A full-stack web application to track **habits** and **expenses**, built with **Vite + React** on the frontend and **Hasura GraphQL** on the backend.  
It helps users manage daily habits, monitor expenses, and visualize their progress through a seamless and modern UI.

---

## 🚀 Tech Stack

- **Frontend**
  - [Vite](https://vitejs.dev/) – Lightning-fast build tool
  - [React](https://react.dev/) – Component-based UI
  - [Apollo Client](https://www.apollographql.com/docs/react/) – State management & GraphQL queries/mutations

- **Backend**
  - [Hasura GraphQL Engine](https://hasura.io/) – Instant GraphQL API over PostgreSQL
  - PostgreSQL – Database layer

---

## ✨ Features

- 📅 **Habit Tracking** – Add, update, and monitor daily habits.
- 💰 **Expense Management** – Log expenses with categories and timestamps.
- 📊 **Analytics & Insights** – Visualize spending and habit trends.
- 🔐 **Authentication-ready** – Easy to integrate auth (e.g., Firebase, Auth0).
- ⚡ **Real-time Updates** – Subscriptions powered by Hasura GraphQL.

---

## 📂 Project Structure
```
habit-expense-tracker/
├── client/ # Frontend (Vite + React + Apollo Client)
│ ├── src/
│ ├── public/
│ └── package.json
├── server/ # Backend (Hasura configs + migrations)
│ ├── migrations/
│ ├── metadata/
│ └── docker-compose.yml
└── README.md
```

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/habit-expense-tracker.git
cd habit-expense-tracker
```
### 2. Setup Backend 
```bash 
cd server
docker-compose up -d
```
### 3. Setup frontend and client 
```bash
cd client
npm install
VITE_HASURA_GRAPHQL_ENDPOINT=http://localhost:8080/v1/graphql
VITE_HASURA_ADMIN_SECRET=youradminsecret
npm run dev
```

## ROADMAP 
+ Add authentication & role-based access
+ Improve analytics with charts (Recharts/ Chart.js)
+ Export expense reports (CSV/PDFs)
+ Responsive Design. 

