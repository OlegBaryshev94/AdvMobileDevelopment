// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALIOiVwbxiMvF_NT-3HMfyVz0loTIukOc",
  authDomain: "taskslab2.firebaseapp.com",
  projectId: "taskslab2",
  storageBucket: "taskslab2.appspot.com",
  messagingSenderId: "540052050719",
  appId: "1:540052050719:web:019dfbd539e81170fd562a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export { app, firebaseConfig };