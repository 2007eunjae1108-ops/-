import {
  auth,
  provider
} from "./firebase.js";

import {
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// 로그인
export async function login() {
  await signInWithRedirect(auth, provider);
}

// Redirect 로그인 결과 처리
export async function checkRedirectResult() {
  try {
    await getRedirectResult(auth);
  } catch (e) {
    alert(e.message);
  }
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
