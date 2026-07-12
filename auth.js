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

export async function login() {
  await signInWithRedirect(auth, provider);
}

export async function checkRedirectResult() {
  try {
    await getRedirectResult(auth);
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
