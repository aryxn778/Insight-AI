import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyApEuSjg0VR9HSWLiJ3lFg7NP6R_-Tnh9s",
    authDomain: "insight-ai-79bcf.firebaseapp.com",
    projectId: "insight-ai-79bcf",
    storageBucket: "insight-ai-79bcf.firebasestorage.app",
    messagingSenderId: "816143417952",
    appId: "1:816143417952:web:c7dd85ca47548e2d46f905",
    measurementId: "G-T56SMNTJG2"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
