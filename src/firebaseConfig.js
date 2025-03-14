// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";  // เพิ่มการ import สำหรับ Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZpw2LLVMR1GVQ5GqiKMl0D0h3w-w5slY",
  authDomain: "carbookingse800.firebaseapp.com",
  projectId: "carbookingse800",
  storageBucket: "carbookingse800.appspot.com",  // แก้ไข storageBucket ให้เป็น "appspot.com"
  messagingSenderId: "95935923587",
  appId: "1:95935923587:web:17728090134ef8ff6e62b6",
  measurementId: "G-R203N43BFT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);  // เรียกใช้ Firebase Storage

export { auth, db, storage };  // ส่งออก storage ด้วย
