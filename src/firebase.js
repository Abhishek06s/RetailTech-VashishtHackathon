// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzLRFPq0wRk8PsYLRvvrTqOR2Py5iSWWU",
  authDomain: "dealdrop-38030.firebaseapp.com",
  projectId: "dealdrop-38030",
  storageBucket: "dealdrop-38030.firebasestorage.app",
  messagingSenderId: "385887284711",
  appId: "1:385887284711:web:3f45d754a1449ba4cf6142",
  measurementId: "G-5W734VKNT1"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
