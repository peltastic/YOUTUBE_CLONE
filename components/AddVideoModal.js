import { useState, useContext, useEffect } from "react";
import { storage } from "../firebaseconfig/firebase";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { AuthCheckContext } from "./AuthCheck";
import Spinner from "./Spinner/Spinner";
import { db } from "../firebaseconfig/firebase";
import { doc, setDoc, updateDoc, getDoc, onSnapshot } from "firebase/firestore";
import { FiCheck, FiX } from "react-icons/fi";
import { GrAdd } from "react-icons/gr";
import classes from "../styles/inputstyle.module.css";
import clases from "../styles/addvideomodal.module.css"

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
  const [isVideoName, setIsVideoName] = useState("notyet");
  const [isVideoFile, setIsVideoFile] = useState("notyet");

  useEffect(() => {
    getUserData();

    return () => {
      setLoading(!loading);
    };
  }, [uid]);

  const fileInputUpload = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    if (videofile) {
      setIsVideoFile("notyet");
    } else {
      setIsVideoFile("notinput");
    }
  };
  const thumbnailFileInput = (e) => {
    const file = e.target.files[0];
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
    if (videoName) {
      setIsVideoName("notyet");
    } else {
      setIsVideoName("noinput");
    }
  };

  const onSubmit = (e) => {
    setLoading(!loading);
    if (videoName && videofile) {
      const vid = Math.floor(Math.random() * 1000000).toString();
      e.preventDefault();
      const storageRef = ref(storage, `${uid}/${vid}`);
      uploadBytes(storageRef, videofile)
        .then(() => {
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
              isThumbnail: customThumbnail,
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
            isThumbnail: customThumbnail,
          })
            .then(() => {
              const docRef = doc(db, "users", uid);
             
              return updateDoc(docRef, {
                videosUploaded: videosUploaded + 1,
              });
            })
            .then(() => {
              if (customThumbnail) {
                customThumbnailReq(vid);
              } else {
                NoCustomThumbnailReq(vid);
              }
            })
            .then(() => {
              clicked();
            });
        });
    } else if (!videoName && videofile) {
      setIsVideoName("noinput");
    } else if (videoName && !videofile) {
      setIsVideoFile("noinput");
    } else if (!videofile && !videoName) {
      setIsVideoFile("noinput");
      setIsVideoName("noinput");
    }
  };

  const customThumbnailReq = (vid) => {
    const storageRef = ref(storage, `thumbnails/${vid}`);
    uploadBytes(storageRef, thumbnail)
      .then(() => {
        return getDownloadURL(ref(storage, `thumbnails/${vid}`));
      })
      .then((url) => {
        setDoc(
          doc(db, "videos", vid),
          {
            thumbnail: url,
          },
          { merge: true }
        ).then(() => {
          setDoc(
            doc(db, ytid, vid),
            {
              thumbnail: url,
            },
            { merge: true }
          );
        });
      });
  };

  const NoCustomThumbnailReq = async (vid) => {
    await setDoc(
      doc(db, "videos", vid),
      {
        thumbnail: thumbnail,
      },
      { merge: true }
    );
    await setDoc(
      doc(db, ytid, vid),
      {
        thumbnail: thumbnail,
      },
      { merge: true }
    );
  };

  let loadingImage = null;
  if (loading) {
    loadingImage = <Spinner loading={loading} />;
  }

  let nameInputErrorMessage = null;
  if (isVideoName === "noinput") {
    nameInputErrorMessage = (
      <p className="text-red-500 text-xs font-bold">Enter Video Name</p>
    );
  }
  let noVideoError = null;
  if (isVideoFile === "noinput") {
    noVideoError = (
      <p className="text-red-500 text-xs font-bold">Upload Video File</p>
    );
  }
  return (
    <>
          {loadingImage}
      <div
        className={`fixed bg-white p-6 w-1/2 trans-center top-2/4 left-2/4 border ${clases.modal} ${
          loading ? "z-5" : "z-20"
        }`}
        >
        <FiX onClick={clicked} className="absolute top-1 right-1" />
        <form className={`${clases.modalContainer} w-full flex`}>
          <div className={`${clases.modalblocks} flex flex-col border-r w-6/12 items-center`}>
            <input
              type="text"
              placeholder="Video Title"
              className="border-b outline-none text-sm text-center mb-2"
              onChange={onNameInput}
              required
            />
            {nameInputErrorMessage}
            <label className={`${classes.label}   shadow-md`}>
              <input
                onChange={fileInputUpload}
                // className=" border"
                type="file"
                name="Add Video"
                required
              />
              <span
                className={`flex items-center text-xs font-thin ${
                  videofile ? "text-green-500 font-bold" : ""
                }`}
              >
                <p className="mr-1">
                  {videofile ? "Selected" : "Select Video"}
                </p>
                <GrAdd />
              </span>
            </label>
            {noVideoError}
          </div>
          <div className={`${clases.modalblocks} w-6/12 flex flex-col items-center font-thin text-sm`}>
            <h1 className="font-bold">THUMBNAILS</h1>
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
                    if (customThumbnail) {
                      setCustomThumbnail(false);
                    }
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
              <label className={`${classes.label} shadow-md`}>
                <input
                  onChange={thumbnailFileInput}
                  // className=" border"
                  type="file"
                  name="Add Video"
                  required
                />
                <span className=" flex items-center text-xs font-thin">
                  <p className="mr-1">Select Thumbnail Picture</p>
                  <GrAdd />
                </span>
              </label>
            ) : null}
          </div>

          <input
            className=" absolute bottom-1 right-1 shadow-sm px-1 border bg-white"
            onClick={onSubmit}
            type="submit"
            value="POST"
          />
        </form>
      </div>
    </>
  );
}

export default AddVideoModal;
