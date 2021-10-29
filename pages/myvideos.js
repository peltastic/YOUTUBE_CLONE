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
  const [unsubscribed, setUnsubscribed] = useState(null);
  const { uid, userPhoto, user } = useContext(AuthCheckContext);

  useEffect(() => {
    if (uid) {
      getUserData();
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
        <div className="border p-6 w-full relative">
          {uid && userPhoto && user ? (
            <div className=" flex items-end">
              <Image
                width={60}
                height={60}
                src={userPhoto}
                className="rounded-full"
              />
              <div className="">
                <p>{user.displayName}</p>
              </div>
            </div>
          ) : (
            "loading...."
          )}
          <button
            onClick={() => setShowModal(true)}
            className="border absolute right-0 top-1/4"
          >
            Add Video
          </button>
          <div className="flex border w-full mt-8">
            <button>Videos</button>
          </div>
          <div className="flex w-full border p-2">
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
