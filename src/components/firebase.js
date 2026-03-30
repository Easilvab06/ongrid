// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBnhNu_A6Zrpjl4YC_4Oc_9uNm1Nr_BvA",
  authDomain: "soinsolar-app.firebaseapp.com",
  projectId: "soinsolar-app",
  storageBucket: "soinsolar-app.firebasestorage.app",
  messagingSenderId: "440117998511",
  appId: "1:440117998511:web:6e43b248159ff2d5d2755a",
  measurementId: "G-ZKBNK5B8QK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);