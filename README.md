<h1 align="center">📚 Welcome to the CoSA Student Database👋</h1>

<p align="center">
A comprehensive platform for managing student data within CoSA, including details about students' club memberships, positions of responsibility (PORs), and much more. This project offers efficient storage, retrieval, and management of student-related information, streamlining administrative tasks and enhancing overall efficiency.

</p>

<p align="center">
  <img src="https://img.shields.io/badge/Maintained%20By-OpenLake-green.svg" alt="Maintained by OpenLake">
  <img src="https://img.shields.io/badge/Maintainers-2-yellow.svg" alt="Contributors">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
</p>
<img width="1071" height="752" alt="image" src="https://github.com/user-attachments/assets/bcd44ac4-4a52-409c-86eb-bb77f0058316" />

---

## 🚀 Features

- **User-friendly Frontend**: Clean, responsive UI for easy access to student data.
- **Backend with MongoDB**: Secure and scalable backend using Node.js, Express, and MongoDB.
- **Search & Filter Functionality**: Quickly search, filter, and manage student data.
- **JWT-based Authentication**: Role-based authentication system for admins.
- **RESTful API**: RESTful endpoints for integration and automation.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Axios, HTML5, CSS3
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB
- **Version Control**: Git and GitHub

---

## 🖥️ Setup Instructions

Follow these instructions to run the project locally.

### Prerequisites

Ensure that you have **Node.js** and **NPM** installed on your system.

### 1. Clone the Repository

```bash
git clone https://github.com/OpenLake/Student_Database_COSA.git
cd Student_Database_COSA
```

### 2. Backend Setup

- Navigate to the `backend` directory:
  ```bash
  cd backend
  ```
- Install the necessary packages and dependencies:
  ```bash
  npm install
  ```
- **Create your environment file:**
  In the `backend` directory, copy the example environment file (.env.example) to create your own local version.
  ```bash
  # For macOS/Linux
  cp .env.example .env
  
  # For Windows
  copy .env.example .env
  ```
  Now, open the new `.env` file and fill in your actual values.

- **Seed the database:**
  This next command populates the database with initial necessary data. **You only need to run this once during the initial setup.**
  ```bash
  node seed.js
  ```
- Run the backend server:
  ```bash
  node index.js
  ```
The backend server should now be running on `http://localhost:5000`.Keep this terminal open.

### 3. Frontend Setup
**Open a new, separate terminal window.** This is important, as your backend server needs to keep running in the first terminal.
- Navigate to the `frontend` directory:
  ```bash
  cd ../frontend
  ```
- Install the frontend dependencies:
  ```bash
  npm install
  ```
- **Create your environment file:**
  Just like the backend, copy the example file to create your local frontend environment file.
  ```bash
  # For macOS/Linux
  cp .env.example .env

  # For Windows
  copy .env.example .env
  ```
  Open the new `.env` file and update any variables if necessary (e.g., the backend API URL).
- Start the frontend server:
  ```bash
  npm start
  ```

### 4. You're All Set! 🎉

The frontend development server will open in your browser at **`http://localhost:3000`**. You can now start exploring and contributing to the application!

---

## 📂 Project Structure

```
Student_Database_COSA/
│
├── backend/               # Node.js backend
│   ├── controllers/       # API route controllers
│   ├── models/            # Database models (MongoDB schemas)
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication and role-based middleware 
|   ├── seed.js            # Database seeder script
|   └── index.js           # Main server file
│
├── frontend/              # React.js frontend
│   ├── public/            # Public assets
│   └── src/               # Source code
│       ├── components/    # React components
│       ├── pages/         # Application pages
│       └── App.js         # Main App component
│
├── .gitignore             # Ignored files
├── README.md              # Project documentation
└── package.json           # Dependencies and scripts
```

---

## 🧑‍💻 Maintainers

This project is maintained by:

- [@harshitap1305](https://github.com/harshitap1305)
- [@sakshi1755](https://github.com/sakshi1755)

---

## 🤝 Contributing
We welcome contributions from the community! For complete guidelines on how to get started, please read our **[Contributing Guide](CONTRIBUTING.md)**.
You can also check out the [Issues tab](https://github.com/OpenLake/Student_Database_COSA/issues) for tasks, join our [Discord server](https://discord.gg/hQFhv2t4) to connect with the team, and view the new [Figma design](https://www.figma.com/design/30y4S7ZfFo92GAwV2uacOG/Student-DB_CoSA?node-id=0-1&t=e95ozkVrFmlxgdOK-1).

---

## 📧 Contact

If you have any questions or feedback, feel free to reach out to the maintainers.
