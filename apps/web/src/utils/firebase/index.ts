// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAme5Q0od3kZ7bDUu5gx1-eCrFciYZz5Jw",
  authDomain: "ticket-box-888.firebaseapp.com",
  projectId: "ticket-box-888",
  storageBucket: "ticket-box-888.firebasestorage.app",
  messagingSenderId: "264234814214",
  appId: "1:264234814214:web:10e0ba80d293d267092c87",
  measurementId: "G-DT19TBPVVG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth