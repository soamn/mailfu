import React from "react";

interface EmailInfo {
  email: string;
  subject: string;
  body: string;
}

interface SentMailsProps {
  sentEmails: EmailInfo[];
  failedEmails: string[];
  onClose: () => void;
}

const SentMails: React.FC<SentMailsProps> = ({
  sentEmails,
  failedEmails,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black">Email Send Results</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          {sentEmails.length > 0 && (
            <div className="mb-6 text-black">
              <h3 className="font-semibold text-xl mb-3">Sent Emails:</h3>
              <ul className="space-y-4">
                {sentEmails.map((email, index) => (
                  <li key={index} className="bg-gray-100 p-4 rounded-lg ">
                    <p className="font-semibold">To: {email.email}</p>
                    <p className="text-sm mt-1">Subject: {email.subject}</p>
                    <p className="text-sm text-gray-600 mt-2  ">{email.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {failedEmails.length > 0 && (
            <div>
              <h3 className="font-semibold text-xl mb-3 text-red-500">
                Failed Emails:
              </h3>
              <ul className="space-y-2">
                {failedEmails.map((email, index) => (
                  <li key={index} className="text-sm text-red-600">
                    {email}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentMails;
