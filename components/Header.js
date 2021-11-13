import Image from "next/image";
import React, { useState, useContext } from "react";
import { AuthCheckContext } from "./AuthCheck";
import classes from "../styles/header.module.css"


import { SearchIcon } from "@heroicons/react/solid";
import { IoMdArrowDropdown } from "react-icons/io"
import {signUserIn, signOutUser} from "../Auth/auth"
import {deleteUserdata} from "../Functions/DeleteFunctions"

function Header({signInStatus}) {

  const { uid, userPhoto, user } = useContext(AuthCheckContext);
  const [signout, setsignout] = useState(false);


  return (
    <div className="flex items-center px-2 w-full justify-around border-b">
      <div className={`${classes.logo   } flex items-center`}>
      <Image
        src="https://1.bp.blogspot.com/-qdRfUNOtjkM/XeI_00z9pzI/AAAAAAAAF4E/FeD2SvVFnKUjPAKQ_cNM6-D2ahjKb0HkQCLcBGAsYHQ/s1600/Youtube-Icon-square-2340x2340-2.png"
        width={50}
        height={50}
        alt=""
      />
      <h1 className="font-bold">YOUTUBE</h1>
      </div>
      
      <div className={`${classes.search} flex flex-grow items-center mx-10 sm:mx-20 md:mx-44 lg:mx-64`}>
        <input
          className=" border-2 w-full px-2 py-1"
          type="search"
          placeholder="search video"
        />
        <SearchIcon className="h-8 rounded-r-lg border-2" />
      </div>
        <SearchIcon className={`${classes.searchMobile} h-8`} />
        {user? < IoMdArrowDropdown onClick={() => setsignout(!signout)} className="mr-4"/> : null}

      <div className="flex relative">
          {user? <div className={` z-50 bg-white w-28 py-1 flex flex-col justify-center absolute top-10 right-6 ${signout ? "opacity-1" : "opacity-0"}  transition-all duration-500`}>
            <button
            className={`text-red-500 font-thin text-sm  block  m-auto`}
            onClick={() => {
              signOutUser();
              setsignout(!signout);
            }}
          >
            SIGN OUT
          </button>
          </div>: null}
        {uid && userPhoto ? (
          <Image
            width={30}
            height={30}
            src={userPhoto}
            alt=""
            className="rounded-full"
            
          />
        ) : (
          <button
            onClick={signUserIn}
            className={`text-green-700 p-0.5 px-1 mx-1 rounded-md ${signInStatus ? "animate-bounce" : ''}`}
          >
            {" "}
            SIGN IN
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
