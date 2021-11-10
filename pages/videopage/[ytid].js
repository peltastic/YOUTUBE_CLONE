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
  onSnapshot,
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
import classes from "../../styles/videopage.module.css"

function VideoPage() {
  const router = useRouter();
  const { ytid, vid } = router.query;
  const [vidData, setVidData] = useState(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likesCount, setlikesCount] = useState(null);
  const [dislikesCount, setDislikesCount] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState(null);
  const [checkComments, setCheckComments] = useState(false);
  const { Userytid, userPhoto, user } = useContext(AuthCheckContext);

  useEffect( async () => {
    let unsub = null
    if (ytid && vid) {
      const vidRef = collection(db, ytid);
      const q = query(vidRef, where("vid", "==", `${vid}`));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setVidData(doc.data());
      });
      unsub = q
    }

    return () => unsub()
  }, [ytid]);

  useEffect(() => {
    if(!user) {
      router.push("/")
    }
  }, [user])

  useEffect(async () => {
    if (vid) {
      const likesDocRef = doc(db, "likes", vid);
      const likesDocSnap = await getDoc(likesDocRef);
      if (likesDocSnap.exists()) {
        const data = [];
        for (const key in likesDocSnap.data()) {
          data.push(likesDocSnap.data()[key]);
        }
        const likedBy = data.filter((el) => el === Userytid);
        if (likedBy[0] === Userytid) {
          setLiked(true);
        } else {
          setLiked(false);
        }
        setlikesCount(data.length);
      }
    }
  }, [Userytid, vid]);

  useEffect(async () => {
    if (vid) {
      const dislikesDocRef = doc(db, "dislikes", vid);
      const dislikesDocSnap = await getDoc(dislikesDocRef);
      if (dislikesDocSnap.exists()) {
        const data = [];
        for (const key in dislikesDocSnap.data()) {
          data.push(dislikesDocSnap.data()[key]);
        }
        const dislikedBy = data.filter((el) => el === Userytid);
        if (dislikedBy[0] === Userytid) {
          setDisliked(true);
        } else {
          setDisliked(false);
        }
        setDislikesCount(data.length);
      }
    }
  }, [Userytid, vid]);

  useEffect(async () => {
    let unsubscribe = null
    if (vid) {
      const docRef = doc(db, "comments", vid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const unsub = onSnapshot(doc(db, "comments", vid), (doc) => {
          const data = [];
          for (const key in doc.data()) {
            data.push(doc.data()[key]);
          }
          setComments(data);
        });
        unsubscribe = unsub
      } else {
        return
      }
    }
    return () => unsubscribe()
  }, [vid, checkComments]);


  const like = () => {
    if (user) {
      if (liked) {
        onUnlike(vidData.vid, Userytid);
        setLiked(!liked);
        setlikesCount(likesCount - 1);
      } else {
        onLike(vidData.vid, Userytid);
        setLiked(!liked);
        setlikesCount(likesCount + 1);
      }
    }
  };

  const dislike = () => {
    if (user) {
      if (disliked) {
        onUnDislike(vidData.vid, Userytid);
        setDisliked(!disliked);
        setDislikesCount(dislikesCount - 1);
      } else {
        onDislike(vidData.vid, Userytid);
        setDisliked(!disliked);
        setDislikesCount(dislikesCount + 1);
      }
    }
  };

  const commentHandler = async () => {
    if (user) {
      const commentIdGenerator = Math.floor(Math.random() * 10000).toString();
      const commentId = "comment" + commentIdGenerator;
      if (vid && userPhoto) {
        await setDoc(
          doc(db, "comments", vid),
          {
            [commentId]: {
              comment: commentInput,
              UserPhoto: userPhoto,
              name: user.displayName,
            },
          },
          { merge: true }
        );
      }
      setCheckComments(!checkComments);
      setCommentInput("");
    }
  };

  return (
    <div>
      <Header />
      <div className={`${classes.container} flex w-full`}>
        <div className={`${classes.vidContainer} flex flex-col w-9/12 px-2`}>
          {vidData ? (
            <ReactPlayer
              className=" bg-gray-800"
              width="100%"
              height="80vh"
              controls={true}
              playing={true}
              url={vidData.url}
            />
          ) : <div className=" bg-gray-600 h-80vh w-full"></div>}
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
        <div className={`${classes.commentsContainer} scrollbar border-l border-gray-800 h-90vh w-4/12 px-1 overflow-scroll` }>
          {comments
            ? comments.map((item, index) => (
                <Comment
                  key={index}
                  userName={item.name}
                  userPic={item.UserPhoto}
                  comment={item.comment}
                />
              ))
            : <p className="">No Comments Posted yet</p>
            }
          <div className={`${classes.inputContainer} absolute bottom-4 w-30n bg-gray-50`}>
            <input
              type="text"
              onChange={(e) => setCommentInput(e.target.value)}
              value={commentInput}
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
