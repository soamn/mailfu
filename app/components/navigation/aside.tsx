"use client";
import { signOut } from "next-auth/react";
import React from "react";
import { GiExitDoor } from "react-icons/gi";

const Aside = () => {
  return (
    <>
      <div className="overflow-y-scroll h-full  border-r border-gray-900 ">
        <ul>
          <li>
            <a href="#">Profile</a>
          </li>
          <li>
            <button
              className="flex items-center gap-1 cursor-pointer text-red-400"
              onClick={() => {
                signOut();
              }}
            >
              Logout <GiExitDoor />
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Aside;
