import React, { useState, createContext, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {db} from "../firebaseconfig/firebase"

export const AuthCheckContext = createContext();

export const AuthCheckProvider = ({ children }) => {
  const [uid, setUserid] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);
  const [user, setUser] = useState(null);
  const [Userytid, setYtid] = useState(null);

  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        setUserid(userId);
        setUserPhoto(user.photoURL);
        setUser(user);
        getUserData(user.uid);
      } else {
        setUserid(null);
        setUser(null)
        setYtid(null)
      }
    });
  }, [uid, auth]);

  const getUserData = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setYtid(docSnap.data().ytid);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const value = {
    uid,
    userPhoto,
    user,
    Userytid,
  };

  return (
    <AuthCheckContext.Provider value={value}>
      {children}
    </AuthCheckContext.Provider>
  );
};
