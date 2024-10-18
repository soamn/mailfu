"use client";
import React, { useState } from "react";
import { CiSettings, CiMenuBurger } from "react-icons/ci";
import Settings from "../components/settings/profile-settings";
import Aside from "../components/navigation/aside";

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="lg:hidden flex items-center justify-between p-4">
        <span className="flex items-center gap-3">
          <CiSettings />
          Settings
        </span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white"
        >
          <CiMenuBurger className="w-6 h-6" />
        </button>
      </div>

      <div
        className={`
        fixed top-0 left-0 h-full w-64 bg-black p-4 transition-transform duration-300 ease-in-out z-30
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:w-72
      `}
      >
        <Aside />
      </div>

      <div className="lg:ml-72 p-4">
        <div className="hidden lg:flex items-center gap-3 mb-4">
          <CiSettings />
          Settings
        </div>
        <div className="overflow-auto">
          <Settings />
        </div>
      </div>
    </div>
  );
};

export default Page;
