import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import React, { useContext } from "react";
import Image from "next/image";
import { AuthCheckContext } from "../components/AuthCheck";
import {
  onSnapshot,
  query,
  collection,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebaseconfig/firebase";

import Backdrop from "../components/Backdrop";
import AddVideoModal from "../components/AddVideoModal";
import VidThumbnail from "../components/VidThumbnail";

function myvideos() {
  const [showModal, setShowModal] = useState(false);
  const [videoData, setVideoData] = useState([]);
  const [ytid, setYtid] = useState(null);
  const [userData, setUserData] = useState(null)
  const [unsubscribed, setUnsubscribed] = useState(null);
  const { uid, userPhoto, user } = useContext(AuthCheckContext);

  useEffect(() => {
    if (uid) {
      getUserData();
      console.log(user)
    }
  }, [uid]);

  const getUserData = async () => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const q = query(collection(db, data.ytid), where("isVideo", "==", true));
       onSnapshot(q, (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setVideoData(data);
        console.log(data)

      });
      // setUnsubscribed(unsub);
      setYtid(data.ytid);
      setUserData(data)
      // console.log(videoData.length)
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }

    // return () => {
    //   unsub();
    // };
  };

  return (
    <div>
      <Header />
      <div className="flex">
        <Sidebar />
        <div className=" p-6 w-full relative">
          <div className=" flex items-center w-full">
          {uid && userPhoto && user ? (
            <div className=" flex items-center mr-auto">
              <Image
                width={40}
                height={40}
                src={userPhoto}
                className="rounded-full block mr-6"
              />
              <div className=" block ml-4">
                <p className="font-bold">{user.displayName}</p>
                <p className=" font-thin text-gray-400 text-sm">{`${userData ?userData.videosUploaded : "0"} ${userData?.videosUploaded === 1 ? "Video Uploaded": "Videos Uploaded"}`}</p>
              </div>
            </div>
          ) : (
            "loading...."
          )}
          <button
            onClick={() => setShowModal(true)}
            className="border p-1 shadow-md"
          >
            Add Video
          </button>
          </div>
          
          <div className="flex w-full border-b mt-8">
            <button>Videos</button>
          </div>
          <div className="flex w-full">
            {/* <VideoPreloader /> */}
            {videoData.length > 0 ? (
              videoData.map((item, index) => (
                <VidThumbnail
                  name={item.videoname}
                  vidUrl={item.url}
                  ytid={ytid}
                  vid={item.vid}
                  uid={uid}
                  key={index}
                  thumbnail={item.thumbnail}
                  IsThumbnail={item.isThumbnail}
                  showDelete
                />
              ))
            ) : (
              <p>No videos Posted yet</p>
            )}
          </div>
          {/*  */}
        </div>
      </div>
      {showModal ? (
        <AddVideoModal ytid={ytid} clicked={() => setShowModal(false)} />
      ) : null}
      {<Backdrop Modal={showModal} clicked={() => setShowModal(false)} />}
    </div>
  );
}

export default myvideos;
