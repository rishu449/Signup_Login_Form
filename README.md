# React + Firebase Authentication App

This project is a **React + Firebase Authentication system** with Firestore integration.  
It includes **Signup, Login, and User Dashboard**, with form validation using `react-hook-form` and toast notifications with `react-toastify`.

---

## ✨ Features
- ✅ User Signup with validation:
  - Name: Only alphabets allowed
  - Username: Alphanumeric + special characters
  - Password: Must not be same as Username
  - Confirm Password: Must match Password
  - Email: Only Gmail allowed
  - Phone: Country code `+91` with 10-digit number
- ✅ Firebase Authentication (Email/Password)
- ✅ Save extra user data (name, username, phone) in **Firestore**
- ✅ Toast notifications
- ✅ User Dashboard showing logged-in user’s **Name**

---

## 📂 Project Structure
/src
├── /components
│ ├── Signup.jsx
│ ├── Login.jsx
│ ├── UserDashboard.jsx
│
├── FirebaseConfig.js # Firebase setup
├── App.jsx # Routes
└── main.jsx # Entry point


---

## 🚀 Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/your-username/react-firebase-auth.git
cd react-firebase-auth

2. Install dependencies
npm install

3. Setup Firebase

Go to Firebase Console
.

Create a project.

Enable Authentication → Email/Password.

Enable Firestore Database.

Copy your Firebase config and paste it into src/FirebaseConfig.js:

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const fireDB = getFirestore(app);

4. Firestore Rules

Go to Firestore → Rules and paste:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow create: if request.auth != null && request.auth.uid == userId;
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}

5. Run the project
npm run dev


App will be live at:
👉 http://localhost:5173