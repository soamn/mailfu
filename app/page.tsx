import Navbar from "./components/navigation/navbar";
import EmailForm from "./components/forms/emaiform";
import Greet from "./components/Heros/greet";
import PlaneAnimation from "./components/Heros/anim";
export default function Home() {
  return (
    <div className="min-h-screen text-white flex flex-col ">
      <Navbar />
      <div className="invisible md:visible ">
        <PlaneAnimation />
      </div>
      <Greet />
      <main className="flex-grow flex justify-center items-center">
        <div className=" rounded-3xl w-full max-w-4xl p-6 z-10">
          <EmailForm />
        </div>
      </main>
    </div>
  );
}
