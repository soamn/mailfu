"use client";

import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Popup from "@/app/components/pop-ups/pop-up";
interface dialog {
  show: boolean;
  message: string;
  color: string;
}
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sending, setSending] = useState<boolean>(false);
  const [dialog, setDialog] = useState<dialog>();
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSending(false);
      setDialog({
        show: false,
        color: "",
        message: "",
      });
    }, 2500);
    return () => clearTimeout(timeout);
  }, [dialog]);
  const handleSubmit = async () => {
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

    try {
      const res = await signIn("credentials", {
        email,
        password,
        callbackUrl: DEFAULT_LOGIN_REDIRECT,
      });
      if (!res || res.error) {
        setDialog({
          message: res?.error || "....",
          show: true,
          color: "red",
        });
      }
    } catch (error) {
      setDialog({
        message: "error Logging in",
        show: true,
        color: "red",
      });
    }
  };

  return (
    <>
      {dialog?.show ? (
        <Popup message={dialog.message} color={dialog.color} />
      ) : (
        <></>
      )}
      <div className=" text-white absolute top-0  w-full text-center mt-20 ">
        <h1 className="font-Kablammo text-4xl">Emails For You</h1>
        <p className="">Get Your emails Sent faster than ever</p>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background bg-zinc-900 ">
        <div className="bg-card shadow-lg rounded-lg p-8 max-w-md w-full bg-zinc-800 ">
          <h2 className="text-2xl font-bold text-primary mb-4 text-center text-orange-600">
            Sign In
          </h2>

          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            defaultValue={email}
            placeholder="Email"
            className="p-2 input-field mb-4 rounded-lg w-full"
            disabled={sending}
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            placeholder="Password"
            className="p-2 input-field mb-6 rounded-lg w-full"
            disabled={sending}
          />
          <button
            onClick={handleSubmit}
            className={`bg-primary text-primary-foreground w-full py-2 rounded-lg mb-4 text-white bg-orange-600 active:bg-orange-800
              ${sending ? "opacity-50" : ""}
              `}
          >
            {sending ? <p>. . . .</p> : <p>Log In</p>}
          </button>

          <div className="flex items-center justify-between mb-4">
            <div className="w-1/3 bg-secondary h-px"></div>
            <div className="text-muted-foreground px-2 text-white">or</div>
            <div className="w-1/3 bg-secondary h-px"></div>
          </div>

          <div className="flex items-center justify-between text-white">
            <button
              onClick={() =>
                signIn(
                  "google",
                  { callbackUrl: DEFAULT_LOGIN_REDIRECT },
                  { scopes: "none", params: "none", propmpt: "none" }
                )
              }
              className="flex items-center justify-center bg-accent w-1/2 py-2 rounded-lg gap-2"
            >
              <FcGoogle />
              <span className="text-accent-foreground">Google</span>
            </button>
            <button
              onClick={() =>
                signIn("github", { callbackUrl: DEFAULT_LOGIN_REDIRECT })
              }
              className="flex items-center justify-center bg-accent w-1/2 py-2 rounded-lg gap-2"
            >
              <FaGithub />
              <span className="text-accent-foreground">GitHub</span>
            </button>
          </div>
          <div className="text-center w-full text-white text-xs p-2 mt-4 hover:text-blue-500 active:text-blue-600">
            {" "}
            <Link href={"/auth/signup"}>
              Don't have an account ? Create One now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
