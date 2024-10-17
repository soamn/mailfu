"use client";

import { useEffect, useState } from "react";

import Popup from "@/app/components/pop-ups/pop-up";

interface Dialog {
  show: boolean;
  message: string;
  color: string;
}

const Page = () => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState<boolean>(false);
  const [dialog, setDialog] = useState<Dialog>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDialog({
        show: false,
        color: "",
        message: "",
      });
    }, 2500);
    return () => clearTimeout(timeout);
  }, [dialog]);

  const handleSubmit = async () => {
    if (!email) {
      setDialog({
        message: `You must enter an email`,
        show: true,
        color: "yellow",
      });
      return;
    }
    setSending(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setDialog({
        message: `Invalid email`,
        show: true,
        color: "red",
      });
      return;
    }
    const Response = await fetch(`/api/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const res = await Response.json();
    if (res.status !== 200) {
      setSending(false);

      setDialog({
        message: res.message,
        show: true,
        color: "red",
      });
    } else {
      setSending(false);

      setDialog({
        message: res.message,
        show: true,
        color: "green",
      });
    }
  };

  return (
    <>
      {dialog?.show ? (
        <Popup message={dialog.message} color={dialog.color} />
      ) : null}
      <div className="text-white absolute top-0 w-full text-center mt-20">
        <h1 className="font-Kablammo text-4xl">Emails For You</h1>
        <p>Get Your emails Sent faster than ever</p>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="bg-card shadow-lg rounded-xl p-8 max-w-md w-full">
          <div className="text-white p-4 text-center">
            Enter The email you have used to register
          </div>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            value={email}
            placeholder="Email"
            className="p-2 input-field mb-4 rounded-lg w-full"
            disabled={sending}
          />
          <button
            onClick={handleSubmit}
            className={`bg-white text-black font-bold py-2 px-6 rounded-md text-lg transition duration-300 hover:bg-gray-200 w-full
              ${sending ? "opacity-50" : ""}
              `}
          >
            {sending ? <p>. . . .</p> : <p>Submit</p>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Page;
