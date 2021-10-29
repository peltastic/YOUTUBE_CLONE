import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Options from "../assets/options.svg";
import DeleteVideo from "./DeleteVideo";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseconfig/firebase";

function VidThumbnail({
  name,
  userPhoto,
  ytid,
  vid,
  showDelete,
  uid,
  thumbnail,
  IsThumbnail
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [thumbnailImage, setThumbnailImage] = useState(null);

  useEffect(async () => {
    if (uid) {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data().videosUploaded);
      } else {
        console.log("No such document!");
      }
    }
  }, [uid]);

  return (
    <div className="w30 m-5 flex flex-col relative ">
      <Link href={`/videopage/${ytid}?vid=${vid}`}>
        <a className=" w-full border h-28 mb-2 relative bg-gray-700">
          <img
            src={
              thumbnail
                ? thumbnail
                : "http://pngimg.com/uploads/youtube/youtube_PNG15.png"
            }
            alt=""
            className="h-full m-auto"
          />
        </a>
      </Link>
      <div className=" flex items-center">
        {userPhoto ? (
          <Link href={`/profile/${ytid}?vid=${vid}`}>
            <a>
              <Image
                src={userPhoto}
                width={30}
                height={30}
                className="rounded-full"
              />
            </a>
          </Link>
        ) : null}
        <p className={`${userPhoto ? "ml-2" : "mr-auto"} `}>{name}</p>
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
          />
        ) : null}
      </div>
    </div>
  );
}

export default VidThumbnail;