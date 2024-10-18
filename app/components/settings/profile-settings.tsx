"use client";

import { signIn, useSession } from "next-auth/react";
import React from "react";
import { BiEdit } from "react-icons/bi";

const Profile = () => {
  const session = useSession();
  const user = session?.data?.user;

  if (session.status === "loading") {
    return (
      <div className="h-full w-full text-white p-4 md:p-10">Loading...</div>
    );
  }

  if (!user) {
    return (
      <div className="h-full w-full text-white p-4 md:p-10">
        <p>Please sign in to view your profile.</p>
        <button
          onClick={() => signIn()}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full text-white p-4 md:p-10">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      <div className="flex flex-col md:flex-row w-full">
        <div className="w-full md:w-2/3 md:pr-8">
          <div className="mb-6">
            <h2 className="text-lg">Name:</h2>
            <p className="text-2xl font-bold">{user.name}</p>
          </div>
          <div className="mb-6">
            <h2 className="text-lg">Email:</h2>
            <p className="text-2xl font-bold">{user.email}</p>
          </div>
          {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
            <BiEdit className="mr-2" />
            Edit Profile
          </button> */}
        </div>
        <div className="w-full md:w-1/3 mt-8 md:mt-0">
          <div className="flex flex-col items-center">
            <div className="rounded-full w-32 h-32 overflow-hidden bg-gray-600 flex items-center justify-center mb-4">
              {user.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">{user.name?.[0] || "U"}</span>
              )}
            </div>
            <p className="text-center mb-4">Profile Photo</p>
            {/* <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center">
              <BiEdit className="mr-2" />
              Change Photo
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
