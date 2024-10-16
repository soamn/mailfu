"use client";
import { useCSVReader } from "react-papaparse";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Popup from "../pop-ups/pop-up";
import SentMails from "./sentMails";
interface dialog {
  show: boolean;
  message: string;
  color: string;
}
interface ApiResponse {
  sentEmails: EmailInfo[];
  failedEmails: string[];
  message: string;
  status: number;
}
interface EmailInfo {
  email: string;
  subject: string;
  body: string;
}
const FileMail = () => {
  useEffect(() => {
    setSenderEmail(user?.email as string);
    setSenderName(user?.name as string);
  });
  const { data: session, status } = useSession();
  const user = session?.user;
  const [senderEmail, setSenderEmail] = useState<string>("");
  const [senderName, setSenderName] = useState<string>("");
  const [message, setMessage] = useState<string>();
  const [csvdata, setcsvData] = useState<Array<Array<string>>>();
  const [sending, setSending] = useState<boolean>(false);
  const [sentEmails, setSentEmails] = useState<EmailInfo[]>([]);
  const [failedEmails, setFailedEmails] = useState<string[]>([]);

  const [dialog, setDialog] = useState<dialog>();
  const [showSentMails, setShowSentMails] = useState<boolean>(false);

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

  const { CSVReader } = useCSVReader();
  const data = {
    senderEmail,
    senderName,
    message,
    csvdata,
  };
  const handleSubmit = async () => {
    if (status === "loading") {
      return <p>Loading...</p>;
    }
    if (!csvdata) {
      setDialog({
        show: true,
        color: "black",
        message: "⚠️File not found",
      });
      return;
    }
    if (!message) {
      setDialog({
        show: true,
        color: "red",
        message: "message prompt not found",
      });
      return;
    }
    if (csvdata.length > 11) {
      setDialog({
        show: true,
        color: "red",
        message: "Your csv should have only 10 email addresses at a time",
      });
      return;
    }
    if (!senderEmail || !senderName) {
      setSenderEmail(user?.email as string);
      setSenderName(user?.name as string);
      setDialog({
        show: true,
        color: "red",
        message: "error fetching session please retry",
      });

      return;
    }
    setSending(true);
    try {
      const Response = await fetch("/api/filemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res: ApiResponse = await Response.json();
      if (res.status == 200) {
        setDialog({
          message: "✅ Emails Sent successfully ",
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
      <div className="relative z-10 overflow-hidden rounded-xl border border-gray-800 p-[1px] w-full max-w-lg">
        <div className="animate-rotate absolute inset-0 h-full w-full rounded-full bg-[conic-gradient(blue_20deg,red_20deg,green_40deg,purple_60deg,transparent_120deg)] opacity-70"></div>
        <div className="relative z-20 flex flex-col h-full rounded-[0.60rem] bg-black p-10">
          <div className="flex flex-col">
            <div className="p-3 rounded-lg mb-4">
              <label htmlFor="file" className="text-white mb-2 block">
                Choose a CSV File
              </label>
              <CSVReader
                onUploadAccepted={(results: any) => {
                  setcsvData(results.data);
                }}
              >
                {({
                  getRootProps,
                  acceptedFile,
                  ProgressBar,
                  getRemoveFileProps,
                }: any) => (
                  <>
                    <div className="flex justify-between items-center  p-2 rounded-lg">
                      <button
                        type="button"
                        {...getRootProps()}
                        className="text-white hover:bg-zinc-700 px-3 py-1 rounded"
                      >
                        📁 Upload
                      </button>
                      <div className="text-white truncate max-w-[150px]">
                        {acceptedFile && acceptedFile.name}
                      </div>
                      <button
                        {...getRemoveFileProps()}
                        className="text-white hover:bg-zinc-700 px-3 py-1 rounded"
                      >
                        🗑️
                      </button>
                    </div>
                    <ProgressBar style={{ marginTop: "10px" }} />
                  </>
                )}
              </CSVReader>
            </div>

            <div className="flex items-center p-2 rounded-lg mb-4">
              <span className="inline-block">✉️</span>
              <div className="bg-transparent outline-none w-full text-white placeholder-gray-400 disabled">
                {user?.email ? (
                  <div className="text-sm p-2 rounded-lg mr-2 mb-2 flex items-center justify-between">
                    <p>{user.email}</p>
                    <a
                      href="/settings"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      ⚙️
                    </a>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>

            <textarea
              required
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              placeholder="Enter Key points of the mail, or explain to us how you want the mail"
              className={`w-full bg-zinc-900 p-3 rounded-lg text-white placeholder-gray-400 h-32 resize-none scroll-m-0 ${
                sending ? "disabled select-none" : ""
              }`}
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
      </div>
    </>
  );
};
export default FileMail;
