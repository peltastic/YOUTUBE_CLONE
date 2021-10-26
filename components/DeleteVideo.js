import { useState, useEffect } from "react";
import {deleteVideoData} from "../Functions/DeleteFunctions"
function DeleteVideo({ ytid, vid, uid, videosUploadedCount, IsThumbnail }) {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    setShowModal(true);
  }, []);

  
  return (
    <div
      className={`transition-all p-0 cursor-pointer bg-gray-100 ${
        showModal ? "w-12" : "w-0"
      }`}
      onClick={() => deleteVideoData(ytid, vid, videosUploadedCount, uid, IsThumbnail)}
    >
      <p className={`text-sm ${showModal ? "p-1" : " none hidden"}`}>Delete</p>
    </div>
  );
}

export default DeleteVideo;
