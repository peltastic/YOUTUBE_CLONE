import { useState, useEffect } from "react";
import { doc, deleteDoc, updateDoc, deleteField } from "firebase/firestore";
import {db} from "../firebaseconfig/firebase"

function DeleteVideo({ ytid, vid, uid, videosUploadedCount }) {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    setShowModal(true);
  }, []);

  const deleteVideoData = async () => {
    await deleteDoc(doc(db, ytid, vid));
    await deleteDoc(doc(db, "videos", vid));
    const docRef = doc(db, "users", uid);

    // Remove the 'capital' field from the document
    await updateDoc(docRef, {
      videosUploaded: videosUploadedCount - 1,
    });
  };
  return (
    <div
      className={`transition-all p-0 cursor-pointer bg-gray-100 ${showModal ? "w-12" : "w-0"}`}
      onClick={deleteVideoData}
    >
      <p className={`text-sm ${showModal ? "p-1" : " none hidden"}`}>Delete</p>
    </div>
  );
}

export default DeleteVideo;
