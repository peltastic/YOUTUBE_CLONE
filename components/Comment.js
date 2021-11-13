import Image from "next/image";
function Comment({ userName, userPic, comment }) {
  return (
    <div className=" flex items-start w-full border-gray-300 border border-b p-3 my-3">
      <Image
        src={
          userPic
            ? userPic
            : "https://lh3.googleusercontent.com/a/AATXAJzYb3btzpIhX3o5kjJ-gl5F-alGwZ8ttzo2ZAEZ=s96-c"
        }
        className="rounded-full"
        width={25}
        height={25}
        alt=""
      />
      <div className="pl-3">
        <p className="text-xs font-bold text-gray-500 ">{userName}</p>
        <p className=" text-xs">{comment}</p>
      </div>
    </div>
  );
}

export default Comment;
