import { useState, useContext, useEffect } from "react";
import { storage } from "../firebaseconfig/firebase";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { AuthCheckContext } from "./AuthCheck";
import Spinner from "./Spinner/Spinner";
import { db } from "../firebaseconfig/firebase";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { FiCheck, FiX } from "react-icons/fi";
// import Hi from "../assets/options.svg"

function AddVideoModal({ clicked, ytid }) {
  const [videoName, setVideoName] = useState(null);
  const [videofile, setVideoFile] = useState(null);
  const [videosUploaded, setVideosUploaded] = useState(null);
  const [loading, setLoading] = useState(false);
  const { uid, userPhoto } = useContext(AuthCheckContext);
  const [thumbnailRequestType, setThumbnailRequestType] = useState("default");
  const [thumbnail, setThumbnail] = useState(
    "http://pngimg.com/uploads/youtube/youtube_PNG15.png"
  );
  const [customThumbnail, setCustomThumbnail] = useState(false);

  useEffect(() => {
    getUserData();

    return () => {
      setLoading(!loading);
    };
  }, [uid]);

  const fileInputUpload = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
  };
  const thumbnailFileInput = (e) => {
    const file = e.target.file[0];
    setThumbnail(file);
  };

  const getUserData = async () => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    // const data = await docSnap.json()
    // console.log(data)

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
    setLoading(!loading);
    const vid = Math.floor(Math.random() * 1000000).toString();
    e.preventDefault();
    const storageRef = ref(storage, `${uid}/${vid}`);
    uploadBytes(storageRef, videofile)
      .then(() => {
        console.log("Uploaded a blob or file!");
        return getDownloadURL(ref(storage, `${uid}/${vid}`));
      })
      .then((url) => {
        setDoc(
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
            setDoc(doc(db, "thumbnail", vid), {
              thumbnail: thumbnail,
            });
          })
          .then(() => {
            if (customThumbnail) {
              const storageRef = ref(storage, `thumbnails/${vid}`);
              return uploadBytes(storageRef, videofile);
            } else{
              clicked()
            }
          })
          .then(() => {
            console.log("Uploaded thumbnail!");
            return getDownloadURL(ref(storage, `thumbnails/${vid}`));
          })
          .then(() => {
            return getDownloadURL(ref(storage, `thumbnails/${vid}`));
          })
          .then (url => {
            setDoc(doc(db, "thumbnail", vid), {
              thumbnail: url,
            });
          })
          .then(() => {
            clicked();
          });
      });
  };

  let loadingImage = null;
  if (loading) {
    loadingImage = (
      <div className=" flex">
        <p>Uploading</p>
        <Spinner />
      </div>
    );
  }
  return (
    <div className="  fixed bg-white p-6 w-9/12 trans-center top-2/4 left-2/4 border z-20">
      <form className="w-full flex">
        <div className=" flex flex-col border w-6/12 items-center">
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
        </div>
        <div className=" border w-6/12 flex flex-col items-center ">
          <h1>THUMBNAILS</h1>
          <div className=" flex items-center">
            <p>Use Default Thumbnail?</p>
            {thumbnailRequestType === "default" ? (
              <FiCheck />
            ) : (
              <FiX
                onClick={() => {
                  setThumbnailRequestType("default");
                  setThumbnail(
                    "http://pngimg.com/uploads/youtube/youtube_PNG15.png"
                  );
                }}
              />
            )}
          </div>
          <div className=" flex">
            <p>Auto Generate Video Thumbnail?</p>
            {thumbnailRequestType === "video" ? (
              <FiCheck onClick={() => setThumbnailRequestType("default")} />
            ) : (
              <FiX
                onClick={() => {
                  setThumbnailRequestType("video");
                  setThumbnail("videoThumbnail");
                }}
              />
            )}
          </div>
          <div className=" flex">
            <p>Choose custom Thumbnail?</p>
            {thumbnailRequestType === "custom" ? (
              <FiCheck
                onClick={() => {
                  setThumbnailRequestType("default");
                  setCustomThumbnail(!customThumbnail);
                }}
              />
            ) : (
              <FiX
                onClick={() => {
                  setThumbnailRequestType("custom");
                  setCustomThumbnail(!customThumbnail);
                }}
              />
            )}
          </div>
          {thumbnailRequestType === "custom" ? (
            <input type="file" onChange={thumbnailFileInput} />
          ) : null}
        </div>

        <input
          className=" absolute bottom-1 right-1"
          onClick={onSubmit}
          type="submit"
          value="POST"
        />
      </form>
      {/* <div className=" flex items-center"> */}
      {/* {loadingImage} */}
      {/* <Spinner /> */}
      {/* </div> */}
    </div>
  );
}

export default AddVideoModal;
