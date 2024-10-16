"use client";
import { useState } from "react";
import Mail from "../mails/mail";
import FileMail from "../mails/filemail";

export default function EmailForm() {
  const [activeForm, setActiveForm] = useState<number>(1);

  return (
    <div className="flex flex-col gap-6 ">
      <div className="flex justify-center gap-3">
        <button
          className={`bg-white text-black font-bold py-2 px-6 rounded-md text-lg transition duration-300 hover:bg-gray-200 ${
            activeForm === 1 ? "" : "opacity-40"
          }`}
          onClick={() => setActiveForm(1)}
        >
          Simple Mail
        </button>
        <button
          className={`bg-white text-black font-bold py-2 px-6 rounded-md text-lg transition duration-300 hover:bg-gray-200 ${
            activeForm === 2 ? "" : "opacity-40"
          }`}
          onClick={() => setActiveForm(2)}
        >
          Upload file
        </button>
      </div>

      <div className="mt-4 flex justify-center">
        {activeForm === 1 ? <Mail /> : <FileMail />}
      </div>
    </div>
  );
}
