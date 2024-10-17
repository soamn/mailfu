"use client";

import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Popup from "@/app/components/pop-ups/pop-up";

interface Dialog {
  show: boolean;
  message: string;
  color: string;
}

const Page = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sending, setSending] = useState<boolean>(false);
  const [dialog, setDialog] = useState<Dialog>();

  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    setToken(tokenFromUrl);
  }, []);
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
    if (!password || !confirmPassword) {
      setDialog({
        message: `All fields are required`,
        show: true,
        color: "yellow",
      });
      return;
    }

    if (password !== confirmPassword) {
      setDialog({
        message: `Passwords do not match`,
        show: true,
        color: "red",
      });

      return;
    }

    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (!passwordRegex.test(password)) {
      setDialog({
        message: `Password should match the criteria`,
        show: true,
        color: "red",
      });
      return;
    }
    if (password.length < 7 || confirmPassword.length < 7) {
      setDialog({
        message: `Password length less than 8 characters`,
        show: true,
        color: "red",
      });
      return;
    }
    setSending(true);

    try {
      const response = await fetch(`/api/new-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, token }),
      });

      const res = await response.json();
      if (response.status !== 200) {
        setDialog({
          message: res.message,
          show: true,
          color: "red",
        });
      } else {
        setDialog({
          message: res.message,
          show: true,
          color: "green",
        });
      }
    } catch (error) {
      setDialog({
        message: `An error occurred`,
        show: true,
        color: "red",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {dialog?.show ? (
        <Popup message={dialog.message} color={dialog.color} />
      ) : null}
      <div className="text-white absolute top-0 w-full text-center mt-20">
        <h1 className="font-Kablammo text-4xl">Reset Your Password</h1>
        <p>Enter your new password below</p>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="bg-card shadow-lg rounded-xl p-8 max-w-md w-full">
          <div className="text-white p-4 text-center">
            Enter your new password
          </div>

          <div className="relative w-full mb-4">
            <input
              min={8}
              max={32}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="New Password"
              className="p-2 input-field rounded-lg w-full"
              disabled={sending}
            />
            <div
              className="absolute right-4 top-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <div className="relative w-full mb-4">
            <input
              min={8}
              max={32}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              placeholder="Confirm New Password"
              className="p-2 input-field rounded-lg w-full"
              disabled={sending}
            />
            <div
              className="absolute right-4 top-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className={`bg-white text-black font-bold py-2 px-6 rounded-md text-lg transition duration-300 hover:bg-gray-200 w-full
              ${sending ? "opacity-50" : ""}
              `}
          >
            {sending ? <p>. . . .</p> : <p>Submit</p>}
          </button>
        </div>
        <div className="text-sm  text-white ">
          <h2 className="text-center font-medium">Password criteria</h2>
          <ul className=" p-4  text-xs *:p-1  ">
            <li>
              <p> * your password should have at least 1 alphabet</p>
            </li>
            <li>
              <p>* your password should have at least 1 Special</p>
            </li>
            <li>
              <p> * your password should have at least 1 Number</p>
            </li>
            <li>
              <p> * your password should be 8 characters long</p>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Page;
