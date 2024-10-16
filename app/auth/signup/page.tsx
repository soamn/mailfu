"use client";

import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import Link from "next/link";
import Popup from "@/app/components/pop-ups/pop-up";
import { useRouter } from "next/navigation";
interface dialog {
  show: boolean;
  message: string;
  color: string;
}
const RegisterForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");
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
  const data = {
    name,
    email,
    password,
  };
  const handleSubmit = async (e: React.FormEvent) => {
    setSending(true);
    e.preventDefault();
    if (!email || !password || !name) {
      setDialog({
        message: "Please fill each of the Field",
        show: true,
        color: "yellow",
      });

      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    if (!passwordRegex.test(password)) {
      setDialog({
        message: `Password Should match the criteria
           [a-z]   [0-9]    [@#..$]`,
        show: true,
        color: "red",
      });
      return;
    }
   
    if (!emailRegex.test(email)) {
      setDialog({
        message: `Invalid email`,
        show: true,
        color: "red",
      });
      return;
    }

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await response.json();
    if (res.status == 201) {
      setDialog({
        message: res.message,
        show: true,
        color: "green",
      });
    }
    if (res.status == 200) {
      setDialog({
        message: res.message,
        show: true,
        color: "green",
      });
      //redirect
      router.push("/auth/login");
    } else if (res.status == 400) {
      setDialog({
        message: res.message,
        show: true,
        color: "yellow",
      });
    }
  };

  return (
    <div>
      <div className=" text-white absolute top-0  w-full text-center mt-20 ">
        {dialog?.show ? (
          <Popup message={dialog.message} color={dialog.color} />
        ) : (
          <></>
        )}
        <h1 className="font-Kablammo text-4xl">Emails For You</h1>
        <p className="">Get Your emails Sent faster than ever</p>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-zinc-900 ">
        <div className="bg-card shadow-lg rounded-lg p-8 max-w-md w-full dark:bg-zinc-800 ">
          <h2 className="text-2xl font-bold text-primary mb-4 text-center text-orange-600 ">
            Sign Up
          </h2>
          <input
            onChange={(e) => {
              setName(e.target.value);
            }}
            type="text"
            placeholder="Name"
            className="p-2 input-field mb-4 rounded-lg w-full"
            disabled={sending}
          />
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            disabled={sending}
            type="email"
            placeholder="Email"
            className="p-2 input-field mb-4 rounded-lg w-full"
          />
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            disabled={sending}
            type="password"
            placeholder="Password"
            className="p-2 input-field mb-6 rounded-lg w-full"
          />
          <button
            onClick={handleSubmit}
            className={`bg-primary text-primary-foreground w-full py-2 rounded-lg mb-4 text-white bg-orange-600 active:bg-orange-800
              ${sending ? "opacity-50" : ""}
              `}
          >
            {sending ? <p>. . . .</p> : <p>Sign Up</p>}
          </button>
          <div className="flex items-center justify-between mb-4">
            <div className="w-1/3 bg-secondary h-px"></div>
            <div className="text-muted-foreground px-2 text-white">
              or sign up with
            </div>
            <div className="w-1/3 bg-secondary h-px"></div>
          </div>
          <div className="flex items-center justify-between text-white">
            <button
              onClick={() => {
                signIn("google", { callbackUrl: DEFAULT_LOGIN_REDIRECT });
              }}
              className="flex items-center justify-center bg-accent w-1/2 py-2 rounded-lg gap-2"
            >
              <FcGoogle />
              <span className="text-accent-foreground">Google</span>
            </button>
            <button
              onClick={() => {
                signIn("github", { callbackUrl: DEFAULT_LOGIN_REDIRECT });
              }}
              className="flex items-center justify-center bg-accent w-1/2 py-2 rounded-lg gap-2"
            >
              <FaGithub />
              <span className="text-accent-foreground">GitHub</span>
            </button>
          </div>
          <div className="text-center w-full text-white text-xs p-2 mt-4 hover:text-blue-500 active:text-blue-600">
            {" "}
            <Link href={"/auth/login"}>Already have an account ? Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
