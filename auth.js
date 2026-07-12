import {
  auth,
  provider
} from "./firebase.js?v=2";

import {
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


export async function login() {
  try {
    await signInWithPopup(auth, provider);
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
