// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCaBe599pbnL3Olg6-3Ew6NutRCwkPFM1s",
  authDomain: "chat-app-b11f2.firebaseapp.com",
  projectId: "chat-app-b11f2",
  storageBucket: "chat-app-b11f2.appspot.com",
  messagingSenderId: "729292214404",
  appId: "1:729292214404:web:f31bf105d40d5a4c5732d1",
  measurementId: "G-QZPFSRJNP6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);