// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "chatsupport-39229.firebaseapp.com",
  projectId: "chatsupport-39229",
  storageBucket: "chatsupport-39229.appspot.com",
  messagingSenderId: "1084199600704",
  appId: "1:1084199600704:web:861dd86d285264df1255a5",
  measurementId: "G-B2ZLC09LG1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {auth};