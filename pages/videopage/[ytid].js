import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseconfig/firebase";
import Header from "../../components/Header"
import ReactPlayer from 'react-player'
function VideoPage() {
  const router = useRouter();
  const { ytid, vid } = router.query;
  const [vidData, setVidData] = useState(null);

  useEffect(() => {
    if (ytid && vid) {
      getVidData();
    }
  }, [ytid]);

  const getVidData = async () => {
    const vidRef = collection(db, ytid);
    const q = query(vidRef, where("vid", "==", `${vid}`));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setVidData(doc.data());
    });
  };

  return (
    <div>
      <Header />
      {vidData? <ReactPlayer className=" bg-gray-800" width="900px" height="70vh" controls={true} playing={true} url={vidData.url}/>: null}
    </div>
  );
}

export default VideoPage;
