import { db } from "../firebaseconfig/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";

export { signUserIn, signOutUser };

const provider = new GoogleAuthProvider();
const auth = getAuth();

const signOutUser = async () => {
  signOut(auth);
};

const signUserIn = () => {
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const ytid = Math.floor(Math.random() * 1000000).toString();
      const user = result.user;
      console.log(user);
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return;
      } else {
        postUserData(
          user.uid,
          user.displayName,
          user.email,
          ytid,
          user.photoURL
        );
        createSubscribersData(ytid);
      }
    })
    .catch((error) => {
      // const errorMessage = error.message;
      // alert(errorMessage);
    });
};

const postUserData = async (uid, user, email, ytid, profilepic) => {
  await setDoc(doc(db, "users", uid), {
    username: user,
    email: email,
    videosUploaded: 0,
    uid: uid,
    subscribersNo: 0,
    ytid: ytid,
    profilepic: profilepic,
  });
};

const createSubscribersData = async (ytid) => {
  await setDoc(
    doc(db, "subscribers", ytid),
    {
      start: "start",
    },
    { merge: true }
  );  
  const docRef = doc(db, ytid, "subscribers");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return
  } else {
    await setDoc(doc(db, ytid, "subscribers"), {
      subscribersNo: 0,
    });
  }
  
};
