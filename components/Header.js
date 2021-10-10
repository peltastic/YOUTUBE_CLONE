import Image from "next/image";
import React, { useState, useContext } from "react";
import { AuthCheckContext } from "./AuthCheck";


import { SearchIcon } from "@heroicons/react/solid";
import {signUserIn, signOutUser} from "../Auth/auth"

function Header() {

  const { uid, userPhoto } = useContext(AuthCheckContext);
  const [signout, setsignout] = useState(false);


  return (
    <div className="flex items-center px-2 w-full justify-around">
      <Image
        src="https://1.bp.blogspot.com/-qdRfUNOtjkM/XeI_00z9pzI/AAAAAAAAF4E/FeD2SvVFnKUjPAKQ_cNM6-D2ahjKb0HkQCLcBGAsYHQ/s1600/Youtube-Icon-square-2340x2340-2.png"
        width={50}
        height={50}
      />
      <h1 className="font-bold">YOUTUBE</h1>
      <div className="flex flex-grow items-center mx-64">
        <input
          className=" border-2 w-full px-2 py-1"
          type="search"
          placeholder="search video"
        />
        <SearchIcon className="h-8 rounded-r-lg border-2" />
      </div>

      <div className="flex">
        {signout ? (
          <button
            className="text-red-500 font-bold mr-6"
            onClick={() => {
              signOutUser();
              setsignout(!signout);
            }}
          >
            SIGN OUT
          </button>
        ) : null}
        {uid && userPhoto ? (
          <Image
            width={30}
            height={30}
            src={userPhoto}
            className="rounded-full"
            onClick={() =>{ 
              setsignout(!signout)
            }}
          />
        ) : (
          <button
            onClick={signUserIn}
            className="border-green-600 border p-0.5 px-1 mx-1 rounded-md"
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
