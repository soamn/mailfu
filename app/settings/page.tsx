import React from "react";
import { CiSettings } from "react-icons/ci";
import Settings from "../components/settings/profile-settings";

import Aside from "../components/navigation/aside";

const page = () => {
  return (
    <div className="px-4 mx-auto max-w-8xl lg:px-8 h-full bg-black">
      <div className="pt-16  ml-[18rem] top-0 relative h-fit text-white ">
        <span className="w-full flex items-center gap-3 ">
          <CiSettings />
          settings
        </span>
      </div>
      <div className="z-20 hidden lg:block fixed top-0 right-auto w-[18rem] h-full text-white p-10 ">
        <Aside />
      </div>
      <div className="  ml-[18rem] overflow-scroll text-white ">
        <Settings />
      </div>
    </div>
  );
};

export default page;
