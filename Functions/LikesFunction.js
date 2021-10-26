import { doc, setDoc, updateDoc, deleteField } from "firebase/firestore"; 
import {db} from "../firebaseconfig/firebase"

export const onLike = async (ytid, userYtid) => {
    console.log(ytid, userYtid)
    await setDoc(doc(db, "likes", ytid), {
        [userYtid] : userYtid
      }, {merge: true});
}

export const onUnlike = async (ytid, userYtid) => {
  const likeRef = doc(db, 'likes', ytid);
  await updateDoc(likeRef, {
    [userYtid]: deleteField()
});
}

export const onDislike = async (ytid, userYtid) => {
  await setDoc(doc(db, "dislikes", ytid), {
    [userYtid]: userYtid
  }, {merge: true})
}
export const onUnDislike = async (ytid, userYtid) => {
  const dislikeRef = doc(db, "dislikes", ytid);
  await updateDoc(dislikeRef, {
    [userYtid]: deleteField()
  })
}