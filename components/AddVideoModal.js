import { useState, useContext, useEffect } from "react";
import { storage } from "../firebaseconfig/firebase";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { AuthCheckContext } from "./AuthCheck";
import { db } from "../firebaseconfig/firebase";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { async } from "@firebase/util";

function AddVideoModal({ clicked, ytid }) {
  const [videoName, setVideoName] = useState(null);
  const [videofile, setVideoFile] = useState(null);
  const [videosUploaded, setVideosUploaded] = useState(null);
  const { uid, userPhoto } = useContext(AuthCheckContext);

  useEffect(() => {
    getUserData();
  }, [uid]);

  const fileInputUpload = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
  };

  const getUserData = async () => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setVideosUploaded(docSnap.data().videosUploaded);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const onNameInput = (e) => {
    const value = e.target.value;
    setVideoName(value);
  };

  const onSubmit = (e) => {
    const vid = Math.floor(Math.random() * 1000000).toString();
    e.preventDefault();
    const storageRef = ref(storage, `${uid}/${videoName}`);
    uploadBytes(storageRef, videofile)
      .then(() => {
        console.log("Uploaded a blob or file!");
        return getDownloadURL(ref(storage, `${uid}/${videoName}`));
      })
      .then(async (url) => {
        await setDoc(
          doc(db, "videos", vid),
          {
            videoName: videoName,
            url: url,
            isVideo: true,
            ytid: ytid,
            vid: vid,
            userPhoto: userPhoto,
          },
          { merge: true }
        );

        return setDoc(doc(db, ytid, vid), {
          videoname: videoName,
          url: url,
          isVideo: true,
          ytid: ytid,
          vid: vid,
          userPhoto: userPhoto,
        })
          .then(() => {
            const docRef = doc(db, "users", uid);
            console.log(docRef);
            return updateDoc(docRef, {
              videosUploaded: videosUploaded + 1,
            });
          })
          .then(() => {
            clicked();
          });
      });
  };
  return (
    <div className="fixed bg-white p-6 w-4/12 trans-center top-2/4 left-2/4 border z-20">
      <form>
        <input
          type="text"
          placeholder="Video Title"
          className="border-b"
          onChange={onNameInput}
          required
        />
        <input
          onChange={fileInputUpload}
          className=" border"
          type="file"
          name="Add Video"
          required
        />
        <input onClick={onSubmit} type="submit" value="POST" />
      </form>
    </div>
  );
}

export default AddVideoModal;
