// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCD0SchWL5ffgj3iGtO1QQAWZQZVPccK_U",
  authDomain: "fanbase-39202.firebaseapp.com",
  projectId: "fanbase-39202",
  storageBucket: "fanbase-39202.firebasestorage.app",
  messagingSenderId: "426833759161",
  appId: "1:426833759161:web:5dd22e57b68e7bfcef0468",
  measurementId: "G-WGSWLMM3PG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);