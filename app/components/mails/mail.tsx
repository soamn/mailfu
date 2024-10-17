"use client";
import { signIn, useSession } from "next-auth/react";
import { useState, KeyboardEvent, ChangeEvent, useEffect } from "react";
import SentMails from "./sentMails";
import Popup from "../pop-ups/pop-up";

interface EmailInfo {
  email: string;
  subject: string;
  body: string;
}

interface ApiResponse {
  sentEmails: EmailInfo[];
  failedEmails: string[];
  message: string;
  status: number;
}
interface dialog {
  show: boolean;
  message: string;
  color: string;
}
const Mail = () => {
  useEffect(() => {
    setSenderEmail(user?.email as string);
    setSenderName(user?.name as string);
  });
  const { data: session, status } = useSession();
  const user = session?.user;
  const [emailInput, setEmailInput] = useState<string>("");
  const [emails, setEmails] = useState<string[]>([]);
  const [senderEmail, setSenderEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [senderName, setSenderName] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [sentEmails, setSentEmails] = useState<EmailInfo[]>([]);
  const [failedEmails, setFailedEmails] = useState<string[]>([]);
  const [showSentMails, setShowSentMails] = useState<boolean>(false);
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

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const data = {
    emails,
    senderEmail,
    message,
    senderName,
  };

  const handleEmailInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmailInput(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (emails.length > 15) {
      setDialog({
        show: true,
        color: "red",
        message: " You can only send 15 emails at once ❗",
      });
      return;
    }
    if (e.key === "Enter" && emails.length < 501 && emailInput.trim() !== "") {
      e.preventDefault();

      if (validateEmail(emailInput)) {
        setEmails([...emails, emailInput.trim()]);
        setEmailInput("");
      } else {
        setDialog({
          show: true,
          color: "yellow",
          message: " ⚠️ Invalid Email address",
        });
      }
    }
  };

  const removeEmail = (index: number): void => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    if (emails.length == 0 || !message) {
      setDialog({
        message: "⚠️Fields Empty",
        show: true,
        color: "yellow",
      });
      return;
    }

    if (!senderEmail || !senderName) {
      setSenderEmail(user?.email as string);
      setSenderName(user?.name as string);
      setDialog({
        message: "error fetching session try Logging in again",
        show: true,
        color: "red",
      });
      return;
    }
    setSending(true);
    try {
      const response = await fetch("/api/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res: ApiResponse = await response.json();
      if (res.status === 200) {
        setDialog({
          message: "✅Emails sent successfully",
          show: true,
          color: "green",
        });
        setSentEmails(res.sentEmails);
        setFailedEmails(res.failedEmails);
        setShowSentMails(true);
      } else {
        setDialog({
          message: res.message,
          show: true,
          color: "red",
        });
      }
    } catch (error) {
      setDialog({
        message: "An error occurred while sending emails",
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
      ) : (
        <></>
      )}
      {showSentMails && (
        <SentMails
          sentEmails={sentEmails}
          failedEmails={failedEmails}
          onClose={() => {
            setSentEmails([]);
            setFailedEmails([]);
            setShowSentMails(false);
          }}
        />
      )}
      <div
        className="relative z-10 overflow-hidden rounded-xl border border-gray-800 p-[1px] w-full max-w-lg"
        style={{
          animationName: "blink",
          animationDuration: "0.8s",
        }}
      >
        <div className="animate-rotate absolute inset-0 h-full w-full rounded-full bg-[conic-gradient(blue_20deg,red_20deg,green_40deg,purple_60deg,transparent_120deg)] opacity-70"></div>
        <div className="relative z-20 flex flex-col h-full rounded-[0.60rem] bg-black p-10">
          <div>
            <div className="flex items-center p-2 rounded-lg mb-4 ">
              <span className="inline-block w-6 h-6 rounded-full bg-white mr-2">
                📫
              </span>
              <div className="flex-1 flex flex-wrap max-h-40 overflow-y-scroll ">
                {emails.map((email, index) => (
                  <div
                    key={index}
                    className="text-sm p-2 rounded-lg mr-2 mb-2 flex items-center bg-white text-black"
                  >
                    {email}
                    <button
                      className="ml-2 text-gray-400 hover:text-black "
                      onClick={() => removeEmail(index)}
                    >
                      x
                    </button>
                  </div>
                ))}

                <input
                  type="email"
                  value={emailInput}
                  onChange={handleEmailInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter Recipient gmail and press Enter..."
                  className={`bg-transparent outline-none text-white placeholder-gray-400 flex-1 p-2 rounded-lg focus:border-2 border-white${
                    sending ? "disabled select-none" : ""
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center p-2 rounded-lg mb-4 ">
              <span className="inline-block ">✉️</span>
              <div className="bg-transparent outline-none w-full text-white placeholder-gray-400 disabled ">
                {user?.email ? (
                  <div className="text-sm p-2 rounded-lg mr-2 mb-2 flex items-center justify-between">
                    <>
                      <p>{user.email}</p>
                      <a href="/settings">⚙️</a>
                    </>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>

          <textarea
            required
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            placeholder="Enter Key points of the mail, or explain to us how you want the mail"
            className={`w-full bg-zinc-900 p-3 rounded-lg placeholder-gray-400 h-32 resize-none scroll-m-0 ${
              sending ? "disabled " : ""
            }`}
            style={{ scrollbarWidth: "none" }}
          ></textarea>

          <div className="flex w-full justify-center mt-4">
            <button
              className={`bg-white text-black font-bold py-2 px-6 rounded-md text-lg transition duration-300 hover:bg-gray-200 ${
                sending ? "disabled bg-blue-400 opacity-30" : ""
              }`}
              onClick={handleSubmit}
            >
              {sending ? <p>Sending</p> : <p>Submit</p>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Mail;
