"use client";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

const Navbar = () => {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className=" text-white  w-full z-10 absolute top-0 ">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <a
          href="/"
          className="md:text-3xl text-xs md:font-bold font-Kablammo bg-gradient-to-r from-white  to-gray-400 inline-block text-transparent bg-clip-text"
        >
          Emailfu
        </a>
        <div className=" flex space-x-4">
          <a href="/en/ln#pricing" className="text-gray-400 hover:text-white">
            Pricing
          </a>

          {session ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none "
              >
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      loading="lazy"
                      className="w-full h-full object-fit"
                    />
                  ) : (
                    <span>{session.user.name?.[0] || "U"}</span>
                  )}
                </div>
                <span>▼</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black rounded-md shadow-lg py-1">
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-sm text-white hover:bg-zinc-800 w-full text-left"
                  >
                    Settings
                  </a>
                  <button
                    onClick={() => {
                      signOut();
                    }}
                    className="block px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <a
                href="/auth/login"
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
              >
                Sign In
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
