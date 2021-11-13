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
import classes from "../../styles/profile.module.css";
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
    const fetchData = async () => {
      if (ytid) {
        const q = query(collection(db, "users"), where("ytid", "==", ytid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
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
        const docRef = doc(db, "subscribers", ytid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = [];
          for (const key in docSnap.data()) {
            data.push(docSnap.data()[key]);
          }
          if (data && Userytid) {
            let subscriberData;
            subscriberData = data.filter((val) => val === Userytid);
            if (subscriberData[0] === Userytid) {
              setIsSubscribed(true);
            }
          }
        } else {
          return;
        }
      }
    };
    fetchData()
    return () => {
      return;
    }
  }, [ytid, Userytid,]);
  useEffect(() => {
    const fetchData = async () => {
      if (ytid) {
        const docRef = doc(db, "subscribers", ytid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSubscribersNo(docSnap.data().subscribersNo);
        } else {
          console.log("No such document!");
        }
      }
    };
    fetchData();
  }, [ytid, updateSubCount]);
  useEffect(() => {
    if (ytid === Userytid) {
      setIsUser(true);
    } else {
      setIsUser(false);
    }
  }, [ytid, Userytid]);
  useEffect(() => {
    if (!Userytid) {
      router.push("/");
    }
  }, [Userytid, router]);


  const onSubscribe = async () => {
    setIsSubscribed(!isSubscribed);
    if (isSubscribed) {
      const docRef = doc(db, "subscribers", ytid);
      const docRef2 = doc(db, "subscribers", ytid);
      await updateDoc(docRef, {
        subscribersNo: subscribersNo - 1,
      }).then(() => {
        setUpdateSubCount(!updateSubCount);
      });
      await updateDoc(docRef2, {
        [Userytid]: deleteField(),
      });
    } else {
      const docRef = doc(db, "subscribers", ytid);
      await updateDoc(docRef, {
        subscribersNo: subscribersNo + 1,
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
        <div className=" p-6 w-full relative">
          {userData ? (
            <div className=" flex items-end">
              <Image
                width={40}
                height={40}
                src={userData.profilepic}
                alt=""
                className="rounded-full"
              />
              <div className="flex flex-col ml-1">
                <p className="font-bold">{userData.username}</p>
                <p className="text-xs font-thin">{`${subscribersNo} ${
                  subscribersNo === 1 ? "subscriber" : "subscribers"
                }`}</p>
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
            <div className=" flex items-center mr-auto animate-pulse duration-75">
              <div className="h-12 w-12 rounded-full bg-gray-100"></div>

              <div className=" block ml-4">
                <div className="h-4 bg-gray-100 w-24 mb-2"></div>
                <div className="h-4 bg-gray-100 w-24"></div>
              </div>
            </div>
          )}
          <div className="flex border-b w-full mt-8">
            <button>Videos</button>
          </div>
          <div className={`${classes.profile} flex flex-wrap w-full p-2`}>
            {videoData ? (
              videoData.map((item, index) => (
                <VidThumbnail
                  key={index}
                  name={item.videoname}
                  vidUrl={item.url}
                  ytid={ytid}
                  vid={item.vid}
                  thumbnail={item.thumbnail}
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
