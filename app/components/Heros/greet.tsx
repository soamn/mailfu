import React from "react";
import { auth } from "@/auth";
const Greet = async () => {
  const session = await auth();
  return (
    <div className="p-20">
      {session ? (
        <>
          <h1 className="font-Kablammo lg:text-3xl text-3xl  text-center  ">
            Emails For You
          </h1>

          <h2 className="text-lg text-center mt-4">
            Hey<b className="text-2xl"> {session.user.name} ,</b> <br></br>
            Tell us how you would like your email
          </h2>
        </>
      ) : (
        <>Loading</>
      )}
    </div>
  );
};

export default Greet;
