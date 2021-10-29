import { doc, deleteDoc, updateDoc, deleteField } from "firebase/firestore";
import { db, storage } from "../firebaseconfig/firebase";
import { ref, deleteObject } from "firebase/storage";

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
  await deleteDoc(doc(db, "comments", vid));

  // Remove the 'capital' field from the document
  const deleteStorageRef = ref(storage, `${uid}/${vid}`);
  deleteObject(deleteStorageRef);
  console.log(IsThumbnail);
  if (IsThumbnail) {
    const deleteThumbnailStorageRef = ref(storage, `thumbnails/${vid}`);
    deleteObject(deleteThumbnailStorageRef);
  }
};
