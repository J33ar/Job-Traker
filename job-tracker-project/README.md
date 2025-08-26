# Job Tracker

A React (Create React App) project to track job applications, using **Firebase Authentication & Firestore**, **Redux Toolkit**, **Redux Persist**, and **Material UI**.

---

## ✨ Features
- **Authentication**
  - Register/Login with Firebase Authentication (Email & Password).
  - Auto-login using `onAuthStateChanged`.
  - Logout functionality.

- **User Profile**
  - Displays user info from Firestore (`users` collection).
  - Each user document includes: `name`, `email`, `role`.

- **Job Applications**
  - Create, Read, Update, Delete job applications stored in `jobApplications` collection.
  - Fields: `company`, `position`, `status` (`applied`, `interview`, `rejected`, `hired`), `userid`, `createdAt`.
  - Filter applications by status (buttons on Dashboard).
  - State persisted locally with Redux Persist (data available offline in case of connection loss).

- **Dashboard**
  - Table of user’s applications.
  - New application form.
  - Filter by status with instant results from cache and Firestore refetch.

- **Admin Page**
  - Lists all job applications for every user.
  - Only accessible to users with `role = "admin"` in Firestore.
  - Role check handled with protected routes.

- **Protected Routes**
  - Redirects unauthenticated users to `/login`.
  - Restricts `/admin` to admins only.

- **Not Found Page**
  - Handles unknown routes with a redirect button to home.

- **Styling**
  - Material UI components and dark theme.
  - Custom background and logo.

---