import React from "react";
interface PROPS {
  message: string;
  color: string;
}
const Popup = ({ message, color }: PROPS) => {
  return (
    <>
      <div className="w-screen h-fit  absolute flex justify-center inset-0 p-2 z-50">
        <div className=" bg-slate-50 rounded-lg text-black w-fit h-fit overflow-clip">
          <p className={`p-4 text-${color}-500 font-bold `}>{message}</p>
          <div
            className=" w-full h-1 opacity-70"
            style={{
              backgroundColor: `${color}`,
              animationName: "message",
              animationDuration: "2s",
              animationDirection: "ease-in",
            }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Popup;
