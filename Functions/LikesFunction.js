import { doc, setDoc, updateDoc, deleteField } from "firebase/firestore"; 
import {db} from "../firebaseconfig/firebase"

export const onLike = async (vid, userYtid) => {
    await setDoc(doc(db, "likes", vid), {
        [userYtid] : userYtid
      }, {merge: true});
}

export const onUnlike = async (vid, userYtid) => {
  const likeRef = doc(db, 'likes', vid);
  await updateDoc(likeRef, {
    [userYtid]: deleteField()
});
}

export const onDislike = async (vid, userYtid) => {
  await setDoc(doc(db, "dislikes", vid), {
    [userYtid]: userYtid
  }, {merge: true})
}
export const onUnDislike = async (vid, userYtid) => {
  const dislikeRef = doc(db, "dislikes", vid);
  await updateDoc(dislikeRef, {
    [userYtid]: deleteField()
  })
}