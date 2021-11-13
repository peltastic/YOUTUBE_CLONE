import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBgCX5GjXM7VmYZxbYrsqqOQ8nslPmgFCE",
  authDomain: "yt-clone-1496b.firebaseapp.com",
  projectId: "yt-clone-1496b",
  storageBucket: "yt-clone-1496b.appspot.com",
  messagingSenderId: "732346878714",
  appId: "1:732346878714:web:a37f1fdaa555993a951743",
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
