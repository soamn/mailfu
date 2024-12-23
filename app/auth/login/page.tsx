"use client";

import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Popup from "@/app/components/pop-ups/pop-up";
import { useRouter } from "next/navigation";

interface Dialog {
  show: boolean;
  message: string;
  color: string;
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sending, setSending] = useState<boolean>(false);
  const [dialog, setDialog] = useState<Dialog>();

  const router = useRouter();
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
    if (!email || !password) {
      setDialog({
        message: `You must fill all the fields`,
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

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (!res || res.error) {
      setSending(false);
      setDialog({
        message: "Invalid Credentials",
        show: true,
        color: "red",
      });
    }
    router.refresh();
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
          <h2 className="text-2xl font-bold text-primary mb-4 text-center text-white">
            Sign In
          </h2>

          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            value={email}
            placeholder="Email"
            className="p-2 input-field mb-4 rounded-lg w-full"
            disabled={sending}
          />

          <div className="relative mb-6">
            <input
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              placeholder="Password"
              className="p-2 input-field rounded-lg w-full"
              disabled={sending}
            />
            <span
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            onClick={handleSubmit}
            className={`bg-white text-black font-bold py-2 px-6 rounded-md text-lg transition duration-300 hover:bg-gray-200 w-full
              ${sending ? "opacity-50" : ""}
              `}
          >
            {sending ? <p>. . . .</p> : <p>Log In</p>}
          </button>
          <a
            className="text-white p-2 hover:text-blue-500"
            href="/auth/reset-password"
          >
            Forgot password ?
          </a>
          <div className="flex items-center justify-between p-4">
            <div className="w-1/3 bg-secondary h-px"></div>
            <div className="text-muted-foreground px-2 text-white">or</div>
            <div className="w-1/3 bg-secondary h-px"></div>
          </div>

          <div className="flex items-center justify-between text-white">
            <button
              onClick={() =>
                signIn("google", { callbackUrl: DEFAULT_LOGIN_REDIRECT })
              }
              className="flex items-center justify-center bg-accent w-1/2 py-2 rounded-lg gap-2 hover:bg-white hover:text-black"
            >
              <FcGoogle />
              <span className="text-accent-foreground">Google</span>
            </button>
            <button
              onClick={() =>
                signIn("github", { callbackUrl: DEFAULT_LOGIN_REDIRECT })
              }
              className="flex items-center justify-center bg-accent w-1/2 py-2 rounded-lg gap-2 hover:bg-white hover:text-black"
            >
              <FaGithub />
              <span className="text-accent-foreground">GitHub</span>
            </button>
          </div>

          <div className="text-center w-full text-white text-xs p-2 mt-4 hover:text-blue-500 active:text-blue-600">
            <Link href={"/auth/signup"}>
              Don't have an account? Create One now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
