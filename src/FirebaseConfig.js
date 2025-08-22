// src/FirebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCf2PiHarnsj0IVZ129bDarSnekjlx93MU",
  authDomain: "login-page-d5e57.firebaseapp.com",
  projectId: "login-page-d5e57",

  messagingSenderId: "389531755878",
  appId: "1:389531755878:web:e49ea5638240e824cb14a7",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const fireDB = getFirestore(app);
export default app;
