import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { AuthCheckContext } from "../../components/AuthCheck";
import VideoPreloader from "../../components/VideoPreloader";
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "../../firebaseconfig/firebase";
import VidThumbnail from "../../components/VidThumbnail";

function Profile() {
  const router = useRouter();
  const { ytid } = router.query;
  const [userData, setUserData] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [subscribersNo, setSubscribersNo] = useState(null);
  const [isUser, setIsUser] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [updateSubCount, setUpdateSubCount] = useState(false);
  const { Userytid } = useContext(AuthCheckContext);

  useEffect(() => {
    if (ytid) {
      getUserData();
      getSubscribers();
    }
  }, [ytid, Userytid]);
  useEffect(() => {
    if (ytid) {
      getSubscribersNo();

    }
  }, [ytid, updateSubCount]);
  useEffect(() => {
    if (ytid === Userytid) {
      setIsUser(true);
    } else {
      setIsUser(false);
    }
  }, [ytid, Userytid]);

  const getUserData = async () => {
    const q = query(collection(db, "users"), where("ytid", "==", ytid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      setUserData(doc.data());
    });
    const q2 = query(collection(db, ytid), where("isVideo", "==", true));
    onSnapshot(q2, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });

      setVideoData(data);
    });
  };

  const getSubscribersNo = async () => {
    const docRef = doc(db, "subscribers", ytid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setSubscribersNo(docSnap.data().subscribersNo);
      console.log(docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  const getSubscribers = async () => {
    const docRef = doc(db, "subscribers", ytid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log(docSnap.data());
      const data = [];
      for (const key in docSnap.data()) {
        data.push(docSnap.data()[key]);
      }
      console.log(data);
      if (data && Userytid) {
        let subscriberData;
        subscriberData = data.filter((val) => val === Userytid);
        console.log(subscriberData);
        if (subscriberData[0] === Userytid) {
          setIsSubscribed(true);
        }
      }
    } else {
      return;
    }
  };

  const onSubscribe = async () => {
    setIsSubscribed(!isSubscribed);
    if (isSubscribed) {
      console.log(subscribersNo);
      const docRef = doc(db, "subscribers", ytid);
      const docRef2 = doc(db, "subscribers", ytid);
      await updateDoc(docRef, {
        subscribersNo: subscribersNo.subscribersNo - 1,
      }).then(() => {
        setUpdateSubCount(!updateSubCount);
        console.log("done");
      });
      console.log(Userytid);
      await updateDoc(docRef2, {
        [Userytid]: deleteField(),
      });
    } else {
      const docRef = doc(db, "subscribers", ytid);
      await updateDoc(docRef, {
        subscribersNo: subscribersNo.subscribersNo + 1,
      }).then(() => {
        setUpdateSubCount(!updateSubCount);
      });
      await setDoc(
        doc(db, "subscribers", ytid),
        {
          [Userytid]: Userytid,
        },
        { merge: true }
      );
    }
  };

  return (
    <div>
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="border p-6 w-full relative">
          {userData ? (
            <div className=" flex items-end">
              <Image
                width={60}
                height={60}
                src={userData.profilepic}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <p>{userData.username}</p>
                <p className="text-xs">{`${subscribersNo} ${subscribersNo === 1? "subscriber": "subscribers"}`}</p>
              </div>
              {isUser ? null : (
                <button
                  onClick={onSubscribe}
                  className=" ml-auto border border-red-600 "
                >
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              )}
            </div>
          ) : (
            "loading...."
          )}
          <div className="flex border w-full mt-8">
            <button>Videos</button>
          </div>
          <div className="flex w-full border p-2">
            {videoData ? (
              videoData.map((item, index) => (
                <VidThumbnail
                  key={index}
                  name={item.videoname}
                  vidUrl={item.url}
                  ytid={ytid}
                  vid={item.vid}
                />
              ))
            ) : (
              <>
                <VideoPreloader />
                <VideoPreloader />
                <VideoPreloader />
                <VideoPreloader />
              </>
            )}
          </div>
          {/*  */}
        </div>
      </div>
    </div>
  );
}

export default Profile;
