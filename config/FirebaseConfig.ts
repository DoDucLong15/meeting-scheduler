// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "firestore-example-fc810.firebaseapp.com",
  databaseURL: "https://firestore-example-fc810-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "firestore-example-fc810",
  storageBucket: "firestore-example-fc810.appspot.com",
  messagingSenderId: "87016544186",
  appId: "1:87016544186:web:777015a76f4e0999652f83",
  measurementId: "G-W9J0X4MBXF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);