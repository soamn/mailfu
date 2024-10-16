"use client";

import { signIn, useSession } from "next-auth/react";
import React from "react";
import { BiEdit } from "react-icons/bi";

const Profile = () => {
  const session = useSession();
  const user = session?.data?.user;
  return (
    <div className="h-full w-full  text-white p-10">
      <p>Profile settings</p>
      {session ? (
        <div className="flex w-full h-screen ">
          <div className=" w-full ">
            <h2 className="text-lg  mt-4">
              Name:<b className="text-2xl"> {user?.name} </b>
            </h2>

            <h2 className="text-lg  mt-4">
              Email:
              <b className="text-2xl "> {user?.email} </b>
            </h2>
          </div>

          <div className="w-fit p-10  ">
            <div className="rounded-full w-32 h-32 overflow-clip  bg-gray-600 flex items-center justify-center ">
              {user?.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  loading="lazy"
                  className="w-full h-full object-fit"
                />
              ) : (
                <span>{user?.name?.[0] || "U"}</span>
              )}
            </div>
            <p className="w-full text-center">profile Photo</p>
          </div>
        </div>
      ) : (
        <>Loading</>
      )}
    </div>
  );
};

export default Profile;
