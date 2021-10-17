import { useState, useEffect } from "react";
import { db } from "../firebaseconfig/firebase";
import VideoThumbnail from "./VideoThumbnail";
import VideoPreloader from "./VideoPreloader";
import { onSnapshot, query, collection, where } from "firebase/firestore";

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
    });

    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <div className="flex border w84 flex-wrap p-6">
      {videosData ? (
        videosData.map((item, index) => {
          return (
            <VideoThumbnail
              key={index}
              name={item.videoName}
              vidUrl={item.url}
              ytid={item.ytid}
              vid={item.vid}
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
