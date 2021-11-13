import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Options from "../assets/options.svg";
import DeleteVideo from "./DeleteVideo";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseconfig/firebase";
import classes from "../styles/videothumbnail.module.css";

function VidThumbnail({
  name,
  userPhoto,
  ytid,
  vid,
  showDelete,
  uid,
  thumbnail,
  IsThumbnail,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (uid) {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data().videosUploaded);
        } else {
          return;
        }
      }
    };
    fetchData();
  }, [uid]);

  return (
    <div className={`${classes.thumbnail} m-5 flex flex-col relative `}>
      <Link href={`/videopage/${ytid}?vid=${vid}`}>
        <a className=" w-full border h-28 mb-2 relative bg-gray-700">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt=""
              className="h-full m-auto"
            />
          ) : (
            <img
              src="http://pngimg.com/uploads/youtube/youtube_PNG15.png"
              alt=""
              className=" h-full m-auto"
              
            />
          )}
        </a>
      </Link>
      <div className=" flex items-center">
        {userPhoto ? (
          <Link href={`/profile/${ytid}?vid=${vid}`}>
            <a>
              <Image
                src={userPhoto}
                width={25}
                height={25}
                className="rounded-full"
                alt=""
              />
            </a>
          </Link>
        ) : null}
        <p className={`${userPhoto ? "ml-2" : "mr-auto"} font-bold text-sm`}>
          {name}
        </p>
        {showDeleteModal && ytid && vid && uid ? (
          <DeleteVideo
            ytid={ytid}
            vid={vid}
            uid={uid}
            videosUploadedCount={userData}
            IsThumbnail={IsThumbnail}
          />
        ) : null}
        {showDelete ? (
          <Image
            className="cursor-pointer"
            onClick={() => setShowDeleteModal(!showDeleteModal)}
            src={Options}
            width={15}
            height={15}
            alt=""
          />
        ) : null}
      </div>
    </div>
  );
}

export default VidThumbnail;
