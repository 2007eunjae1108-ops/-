import {
  auth,
  provider
} from "./firebase.js?v=2";
import {
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

export async function login() {
  try {
    await signInWithRedirect(auth, provider);
  } catch (e) {
    alert(e.code + "\n\n" + e.message);
  }
}

export function observeAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

export async function logout() {
  await signOut(auth);
}

// 리다이렉트 후 돌아왔을 때 결과 처리 (에러 확인용)
getRedirectResult(auth).catch((e) => {
  console.error("리다이렉트 로그인 에러:", e.code, e.message);
});
