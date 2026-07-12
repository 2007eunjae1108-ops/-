import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxcCZ5dfWmyj4YlckCfWgpSuYXDW_f8q0",
  authDomain: "account-book-328ea.firebaseapp.com",
  projectId: "account-book-328ea",
  storageBucket: "account-book-328ea.firebasestorage.app",
  messagingSenderId: "980912910855",
  appId: "1:980912910855:web:7cd110d6c5469dbc5c30a2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// 중복 import 제거하고 그냥 바로 호출
setPersistence(auth, browserLocalPersistence);

export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
