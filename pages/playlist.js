import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Image from "next/image";
import { AuthCheckContext } from "../components/AuthCheck";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebaseconfig/firebase";
import VidThumbnail from "../components/VidThumbnail";
import classes from "../styles/playlist.module.css";

function playlist() {
  const { Userytid, userPhoto, user } = useContext(AuthCheckContext);
  const [playlistData, setplaylistData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (Userytid) {
        const docRef = doc(db, "playlist", Userytid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const vidData = [];
          for (const key in data) {
            vidData.push(data[key]);
          }
          setplaylistData(vidData);
          console.log(vidData);
        }
      }
    };

    fetchData();
  }, [Userytid]);

  return (
    <div>
      <Header />
      <div className=" flex">
        <Sidebar />
        <div className=" flex flex-wrap border w-full">
          <div className={`w-2/12 my-6 ${classes.bioContainer} `}>
            {user && userPhoto ? (
              <div className=" flex flex-col items-center">
                <Image
                  width={40}
                  height={40}
                  src={userPhoto}
                  alt=""
                  className="rounded-full"
                />
                <div className="">{user.displayName}</div>
                <p className="font-bold">YOUR PLAYLIST</p>
              </div>
            ) : (
              <>
                <div className=" m-auto rounded-full w-10 h-10 bg-gray-200"></div>
                <div className=" h-4 w-24 mx-auto my-2 bg-gray-200"></div>
                <div className=" h-4 w-32 mx-auto my-2 bg-gray-200"></div>
              </>
            )}
          </div>
          <div className={`w-10/12 flex flex-wrap ${classes.flexItems}`}>
            {playlistData.length !== 0 ? (
              playlistData.map((item, index) => (
                <VidThumbnail
                  name={item.videoname}
                  vidUrl={item.url}
                  ytid={item.ytid}
                  vid={item.vid}
                  key={index}
                  thumbnail={item.thumbnail}
                  IsThumbnail={item.isThumbnail}
                />
              ))
            ) : (
              <p className=" m-auto py-8 font-bold">
                YOU DON'T HAVE ANY SAVED VIDEOS
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default playlist;
