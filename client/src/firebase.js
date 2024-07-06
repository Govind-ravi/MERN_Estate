// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-2ff22.firebaseapp.com",
  projectId: "mern-estate-2ff22",
  storageBucket: "mern-estate-2ff22.appspot.com",
  messagingSenderId: "482131007518",
  appId: "1:482131007518:web:940d6eed3e98c52395360f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

