import { useState, useEffect } from "react";
import { db } from "../firebaseconfig/firebase";
import VidThumbnail from "./VidThumbnail";
import VideoPreloader from "./VideoPreloader";
import { onSnapshot, query, collection, where } from "firebase/firestore";
import classes from "../styles/videocontainer.module.css"

function VideosContainer() {
  const [videosData, setVideosData] = useState(null);
  useEffect(() => {
    const q = query(collection(db, "videos"), where("isVideo", "==", true));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const videos = [];
      querySnapshot.forEach((doc) => {
        videos.push(doc.data());
      });
      setVideosData(videos);
      console.log(videos)
    });

    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <div className={`${classes.vidContainer} flex bg-gray-100 w84 justify-center flex-wrap p-6`}>
      {videosData ? (
        videosData.map((item, index) => {
          return (
            <VidThumbnail
              key={index}
              name={item.videoName}
              vidUrl={item.url}
              ytid={item.ytid}
              vid={item.vid}
              thumbnail={item.thumbnail}
              userPhoto={item.userPhoto}
            />
          );
        })
      ) : (
        <>
          <VideoPreloader />
          <VideoPreloader />
          <VideoPreloader />
          <VideoPreloader />
          <VideoPreloader />
          <VideoPreloader />
          <VideoPreloader />
          <VideoPreloader />
          <VideoPreloader />
          <VideoPreloader />
          <VideoPreloader />
          <VideoPreloader />
        </>
      )}
    </div>
  );
}

export default VideosContainer;
