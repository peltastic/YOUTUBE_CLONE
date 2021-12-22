import Link from "next/link";
import { useRouter } from "next/router";
import classes from "../styles/sidebar.module.css";
import {
  AiFillHome,
  AiOutlinePlaySquare,
  AiOutlineRightCircle,
} from "react-icons/ai";
import { MdPlaylistAdd } from "react-icons/md";
import { useState, useContext } from "react";
import { AuthCheckContext } from "./AuthCheck";

function Sidebar({ clicked }) {
  const [fullSidebar, setFullSidebar] = useState(false);
  const { user } = useContext(AuthCheckContext);
  const router = useRouter();
  return (
    <>
      <div
        className={`${classes.sidebarMobile} fixed left-1/2 -translate-x-1/2 py-2 bottom-0 justify-around z-50 bg-white`}
      >
        <AiFillHome onClick={() => router.push("/")} className="h-6 w-6" />

        <AiOutlinePlaySquare
          onClick={() => {
            router.push(`${user ? "/myvideos" : "/"}`);
            clicked();
          }}
          className="h-6 w-6"
        />

        <MdPlaylistAdd
          onClick={() => router.push(`${user ? "/playlist" : "/"}`)}
          className="h-6 w-6"
        />
      </div>
      <div
        className={`${classes.sidebar} ${
          fullSidebar ? "w-1/4 md:w30 lg:w11 relative" : "w5"
        } mr-auto px-2 transition-all `}
      >
        <ul className={`${fullSidebar ? "absolute w-full" : "w-40"} mt-5`}>
          <li className=" flex justify-start mb-2">
            <Link href="/">
              <a
                className={`text-lg w-full transition-all ease-our ${
                  fullSidebar ? "translate-x-0" : "-translate-x-3/4"
                } flex items-center `}
              >
                <p className="text-gray-500 mr-auto font-light ">Home</p>
                <AiFillHome className=" h-6 w-6 mr-3" />
              </a>
            </Link>
          </li>
          <li className=" flex justify-start mb-2">
            <Link href={user ? "/myvideos" : "/"}>
              <a
                onClick={clicked}
                className={`text-lg w-full transition-all ease-our ${
                  fullSidebar ? "translate-x-0" : "-translate-x-3/4"
                } flex items-center `}
              >
                <p className="text-gray-500 font-light mr-auto">Your Videos</p>
                <AiOutlinePlaySquare className=" h-6 w-6 mr-3" />
              </a>
            </Link>
          </li>
          <li className=" flex justify-start mb-2">
            <Link className="" href={user ? "/playlist" : "/"}>
              <a
                onClick={clicked}
                className={`text-lg w-full transition-all ease-our ${
                  fullSidebar ? "translate-x-0" : "-translate-x-3/4"
                } flex items-center `}
              >
                <p className="text-gray-500 font-light mr-auto">Playlist</p>
                <MdPlaylistAdd className=" h-6 w-6 mr-3 " />
              </a>
            </Link>
          </li>
          <AiOutlineRightCircle
            onClick={() => setFullSidebar(!fullSidebar)}
            className="ml-1 h-6 w-6"
          />
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
