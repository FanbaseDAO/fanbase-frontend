// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGKE0AzthXgTNnOT-Kn8xiK8ZmlcrKfrc",
  authDomain: "fanbasedao.firebaseapp.com",
  projectId: "fanbasedao",
  storageBucket: "fanbasedao.firebasestorage.app",
  messagingSenderId: "1074316187051",
  appId: "1:1074316187051:web:7103158334fd9b1d902eee",
  measurementId: "G-LS9EX24RV8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);