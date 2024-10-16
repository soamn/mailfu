"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Navbar from "../components/navigation/navbar";
import Popup from "../components/pop-ups/pop-up";
interface dialog {
  show: boolean;
  message: string;
  color: string;
}
const EmailGeneratorPage = () => {
  const { data: session } = useSession();

  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState<string>("");
  const [receiverName, setReceiverName] = useState<string>("");
  const [receiverEmail, setReceiverEmail] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [generatedEmail, setGeneratedEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dialog, setDialog] = useState<dialog>();
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

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    if (session?.user) {
      setSenderEmail(session?.user.email!);
      setSenderName(session?.user.name!);
    }
    e.preventDefault();
    if (validateEmail(senderEmail) && validateEmail(receiverEmail)) {
      setIsLoading(true);
      await requestEmail();
      setIsLoading(false);
    } else {
      setDialog({
        show: true,
        color: "red",
        message: " Please enter valid email addresses",
      });
    }
  };

  const requestEmail = async () => {
    const response = await fetch("/api/quickmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderName,
        senderEmail,
        receiverName,
        receiverEmail,
        prompt,
      }),
    });
    const res = await response.json();
    if (res.status === 200) {
      setDialog({
        show: true,
        color: "green",
        message: res.message,
      });
      setGeneratedEmail(res.generatedEmail);
    } else {
      setDialog({
        show: true,
        color: "red",
        message: res.message,
      });
    }
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <>
      {dialog?.show ? (
        <Popup message={dialog.message} color={dialog.color} />
      ) : (
        <></>
      )}
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8 mt">
        <Navbar />
        <div className="max-w-7xl mx-auto mt-24">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4 font-Kablammo">
              Emails For You
            </h1>
            <p className="text-xl text-gray-300">
              Tell us how you would like your email
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <form
              onSubmit={handleSubmit}
              className="flex-1 bg-gray-800 rounded-xl shadow-lg p-6 space-y-4"
            >
              <div className="space-y-2">
                <label
                  htmlFor="senderName"
                  className="block text-sm font-medium text-gray-300"
                >
                  Your Name
                </label>
                <input
                  defaultValue={session?.user.name || ""}
                  id="senderName"
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your name"
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="senderEmail"
                  className="block text-sm font-medium text-gray-300"
                >
                  Your Email
                </label>
                <input
                  defaultValue={session?.user.email || ""}
                  id="senderEmail"
                  type="email"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email"
                  onChange={(e) => setSenderEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="receiverName"
                  className="block text-sm font-medium text-gray-300"
                >
                  Recipient's Name
                </label>
                <input
                  id="receiverName"
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter recipient's name"
                  onChange={(e) => setReceiverName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="receiverEmail"
                  className="block text-sm font-medium text-gray-300"
                >
                  Recipient's Email
                </label>
                <input
                  id="receiverEmail"
                  type="email"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter recipient's email"
                  onChange={(e) => setReceiverEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="prompt"
                  className="block text-sm font-medium text-gray-300"
                >
                  Email Prompt
                </label>
                <textarea
                  id="prompt"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  style={{ scrollbarWidth: "none" }}
                  placeholder="Enter prompt for the AI to create email for you"
                  rows={4}
                  onChange={(e) => setPrompt(e.target.value)}
                ></textarea>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-150 ease-in-out"
                >
                  {isLoading ? "Generating..." : "Generate Email"}
                </button>
              </div>
            </form>

            <div className="flex-1 bg-gray-800 rounded-xl shadow-lg p-6 overflow-auto max-h-[600px]">
              <h2 className="text-2xl font-bold mb-4">Generated Email</h2>
              {generatedEmail ? (
                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: generatedEmail }}
                ></div>
              ) : (
                <p className="text-gray-400">
                  Your generated email will appear here.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailGeneratorPage;
