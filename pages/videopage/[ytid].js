import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  onSnapshot

} from "firebase/firestore";
import { db } from "../../firebaseconfig/firebase";
import Header from "../../components/Header";
import ReactPlayer from "react-player";
import { BiLike, BiDislike } from "react-icons/bi";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import {
  onLike,
  onUnlike,
  onDislike,
  onUnDislike,
} from "../../Functions/LikesFunction";
import { AuthCheckContext } from "../../components/AuthCheck";
import Comment from "../../components/Comment";

function VideoPage() {
  const router = useRouter();
  const { ytid, vid } = router.query;
  const [vidData, setVidData] = useState(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likesCount, setlikesCount] = useState(null);
  const [dislikesCount, setDislikesCount] = useState(null);
  const [commentInput, setCommentInput] = useState(null);
  const [comments, setComments] = useState(null)
  const [checkComments, setCheckComments] = useState(false)
  const { Userytid, userPhoto, user } = useContext(AuthCheckContext);

  useEffect(() => {
    if (ytid && vid) {
      getVidData();
    }
  }, [ytid]);

  useEffect(async () => {
    const likesDocRef = doc(db, "likes", ytid);
    const likesDocSnap = await getDoc(likesDocRef);
    if (likesDocSnap.exists()) {
      const data = [];
      for (const key in likesDocSnap.data()) {
        data.push(likesDocSnap.data()[key]);
      }
      console.log(data);
      console.log(Userytid);
      const likedBy = data.filter((el) => el === Userytid);
      console.log(likedBy);
      if (likedBy[0] === Userytid) {
        setLiked(true);
        console.log("true");
      } else {
        setLiked(false);
        console.log(false);
      }
      console.log(data.length);
      setlikesCount(data.length);
    }
  }, [Userytid]);

  useEffect(async () => {
    const dislikesDocRef = doc(db, "dislikes", ytid);
    const dislikesDocSnap = await getDoc(dislikesDocRef);
    if (dislikesDocSnap.exists()) {
      const data = [];
      for (const key in dislikesDocSnap.data()) {
        data.push(dislikesDocSnap.data()[key]);
      }
      console.log(data);
      console.log(Userytid);
      const dislikedBy = data.filter((el) => el === Userytid);
      console.log(dislikedBy);
      if (dislikedBy[0] === Userytid) {
        setDisliked(true);
        console.log("true");
      } else {
        setDisliked(false);
        console.log(false);
      }
      console.log(data.length);
      setDislikesCount(data.length);
    }
  }, [Userytid]);

  useEffect( async() => {
    const docRef = doc(db, "comments", vid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const unsub = onSnapshot(doc(db, "comments", vid), (doc) => {
        const data = []
        for (const key in doc.data()) {
          data.push(doc.data()[key])
        }
        console.log(data)
        setComments(data)

    });
    
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }, [vid, checkComments]);

  const getVidData = async () => {
    const vidRef = collection(db, ytid);
    const q = query(vidRef, where("vid", "==", `${vid}`));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setVidData(doc.data());
    });
  };

  const like = () => {
    if (liked) {
      onUnlike(vidData.ytid, Userytid);
      setLiked(!liked);
      setlikesCount(likesCount - 1);
    } else {
      onLike(vidData.ytid, Userytid);
      setLiked(!liked);
      setlikesCount(likesCount + 1);
    }
  };

  const dislike = () => {
    if (disliked) {
      onUnDislike(vidData.ytid, Userytid);
      setDisliked(!disliked);
      setDislikesCount(dislikesCount - 1);
    } else {
      onDislike(vidData.ytid, Userytid);
      setDisliked(!disliked);
      setDislikesCount(dislikesCount + 1);
    }
  };

  const commentHandler = async () => {
    const commentIdGenerator =  Math.floor(Math.random() * 10000).toString()
    const commentId = "comment" + commentIdGenerator
    console.log(commentId)
    if (vid && userPhoto) {
      await setDoc(doc(db, "comments", vid), {
        [commentId]: {
          comment: commentInput,
          UserPhoto: userPhoto,
          name: user.displayName
        },
      }, {merge: true});
    }
    setCheckComments(!checkComments)
  };

  return (
    <div>
      <Header />
      <div className=" flex w-full">
        <div className=" flex flex-col w-9/12 px-2">
          {vidData ? (
            <ReactPlayer
              className=" bg-gray-800"
              width="100%"
              height="80vh"
              controls={true}
              playing={true}
              url={vidData.url}
            />
          ) : null}
          <div className="flex items-center px-2">
            <div className="mr-auto">
              <h1>{vidData?.videoname}</h1>
            </div>
            <button>
              <BiLike
                onClick={like}
                className={`mr-1 h-10 w-5 ${liked ? "text-green-600" : null}`}
              />
            </button>
            <p className="mr-6 ">{likesCount ? likesCount : "LIKE"}</p>
            <BiDislike
              onClick={dislike}
              className={`mr-1 h-10 w-5 ${disliked ? "text-red-600" : null}`}
            />
            <p className="mr-6">{dislikesCount ? dislikesCount : "DISLIKE"}</p>
            <MdOutlinePlaylistAdd className="mr-1 h-10 w-5" />
            <p className="mr-6">SAVE</p>
          </div>
        </div>
        <div className="scrollbar border-l border-gray-800 h-90vh w-4/12 px-1 overflow-scroll ">
          {comments ? comments.map((item, index) => 
             <Comment key={index} userName={item.name} userPic={item.UserPhoto} />
          ): null}
          <div className="absolute bottom-4 w-30n bg-gray-50">
            <input
              type="text"
              onChange={(e) => setCommentInput(e.target.value)}
              className=" border-b-2 bg-gray-50 border-gray-300  w-full outline-none focus:border-gray-700"
              placeholder="Add a public comment"
            />
            <button className="bg-gray-200 px-2 my-1" onClick={commentHandler}>
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPage;
