import {
  auth,
  provider
} from "./firebase.js";

import {
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
// 로그인
export async function login() {
  await signInWithPopup(auth, provider);
}

// 로그인 상태 확인
export function observeAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

// 로그아웃
export async function logout() {
  await signOut(auth);
}
