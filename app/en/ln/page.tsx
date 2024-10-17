import React from "react";
import Hero from "../../components/landing/hero";
import Features from "@/app/components/landing/features";
import Pricing from "@/app/components/landing/pricing";
import Footer from "@/app/components/landing/footer";
import Header from "@/app/components/landing/header";

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white ">
      <Header />
      <div
        style={{
          animationName: "blink",
          animationDuration: "1.5s",
        }}
      >
        <Hero />
      </div>
      <div
        style={{
          animationName: "blink",
          animationDuration: "1.5s",
        }}
      >
        <Features />
      </div>
      <div
        style={{
          animationName: "blink",
          animationDuration: "1.5s",
        }}
      >
        <Pricing />
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
