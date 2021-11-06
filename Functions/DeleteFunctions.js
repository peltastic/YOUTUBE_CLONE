import { doc, deleteDoc, updateDoc, deleteField } from "firebase/firestore";
import { db, storage } from "../firebaseconfig/firebase";
import { ref, deleteObject, getStorage } from "firebase/storage";
import { getAuth, deleteUser } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

const auth = getAuth();
const user = auth.currentUser;

export const deleteVideoData = async (
  ytid,
  vid,
  videosUploadedCount,
  uid,
  IsThumbnail
) => {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    videosUploaded: videosUploadedCount - 1,
  });
  await deleteDoc(doc(db, ytid, vid));
  await deleteDoc(doc(db, "videos", vid));
  await deleteDoc(doc(db, "likes", vid));
  await deleteDoc(doc(db, "dislikes", vid));
  await deleteDoc(doc(db, "comments", vid));

  // Remove the 'capital' field from the document
  const deleteStorageRef = ref(storage, `${uid}/${vid}`);
  deleteObject(deleteStorageRef);
  if (IsThumbnail) {
    const deleteThumbnailStorageRef = ref(storage, `thumbnails/${vid}`);
    deleteObject(deleteThumbnailStorageRef);
  }
};

export const deleteUserdata = async (ytid, uid) => {
  // const vids = []
  // const q = query(collection(db, ytid), where("isVideo", "==", true));

  // const querySnapshot = await getDocs(q);
  // querySnapshot.forEach((doc) => {
  //   // doc.data() is never undefined for query doc snapshots
  //   vids.push(doc.data().vid)
  // })
  // console.log(vids)
  // vids.forEach( async (vid) => {
  //   await deleteDoc (doc(db, "videos", vid))
  // })
  // vids.forEach( async (vid) => {
  //   await deleteDoc(doc (db, ytid, vid))
  // })  
  // vids.forEach((vid) => {
  //   const desertRef = ref(storage, `${uid}/${vid}`);
  //   deleteObject(desertRef).then(() => {
  //     console.log("done")
  //   }).catch((error) => {
  //     console.log(error)
  //   });
  // })
  // console.log(uid)
  // await deleteDoc(doc(db,"users", uid))
  // await deleteDoc(doc(db, "subscribers", ytid))
  deleteUser(user).then(() => {
    console.log("deleted")
  }).catch((error) => {
    console.log((error));
  });
};
