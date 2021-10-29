function Comment({ userName, userPic, comment }) {
  return (
    <div className=" flex items-start w-full border-gray-300 border border-b p-3 my-3">
      <img
        src={
          userPic
            ? userPic
            : "https://lh3.googleusercontent.com/a/AATXAJzYb3btzpIhX3o5kjJ-gl5F-alGwZ8ttzo2ZAEZ=s96-c"
        }
        alt=""
        className="rounded-full h-7 w-7"
      />
      <div className="pl-3">
        <p className="text-xs font-bold text-gray-500 ">{userName}</p>
        <p className=" text-xs">
          {comment}
        </p>
      </div>
    </div>
  );
}

export default Comment;
