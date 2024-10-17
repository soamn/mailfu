"use client";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import image from "@/public/assets/plane.png";

const PlaneAnimation: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const svg = svgRef.current;
    const plane = planeRef.current;
    if (!svg || !plane) return;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    // path.setAttribute("d", "M 0 400 Q 900 100, 600 300  T 1500 100");
    path.setAttribute(
      "d",
      "M 0 900 Q 300 700, 600 800  Q 1300 1000, 1500 800 T 2000 600"
    );
    path.setAttribute("fill", "none");
    path.style.display = "none";
    svg.appendChild(path);

    const pathLength = path.getTotalLength();
    const dotSpacing = 10;
    const numDots = Math.floor(pathLength / dotSpacing);

    const animationDuration = 2000;

    let startTime: number;
    let animationFrameId: number;

    const animatePlane = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);
      const point = path.getPointAtLength(progress * pathLength);

      plane.style.transform = `translate(${point.x}px, ${point.y}px)`;

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animatePlane);
      }
    };

    animationFrameId = requestAnimationFrame(animatePlane);
    for (let i = 0; i < numDots; i++) {
      const dot = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      const point = path.getPointAtLength(i * dotSpacing);
      dot.setAttribute("cx", point.x.toString());
      dot.setAttribute("cy", point.y.toString());
      dot.setAttribute("r", "2");
      dot.setAttribute("fill", "white");
      dot.style.opacity = "0";
      svg.appendChild(dot);

      setTimeout(() => {
        dot.style.opacity = "0.5";
      }, (i / numDots) * animationDuration);
    }

    return () => {
      // Cleanup
      cancelAnimationFrame(animationFrameId);
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }
    };
  }, []);

  return (
    <>
      <div className="absolute z-0 overflow-clip ">
        <div className=" w-screen h-screen flex justify-center items-center overflow-hidden  ">
          <svg ref={svgRef} className="absolute top-0 left-0 w-full h-full " />
          <div
            ref={planeRef}
            className="absolute -top-8 -left-5 text-5xl"
            style={{ willChange: "transform" }}
          >
            <Image
              alt="plane"
              width={50}
              className="-rotate-45"
              height={50}
              src={image}
            ></Image>

            <div className="absolute top-0 left-0">
              {" "}
              <p className="text-white font-Kablammo text-lg">
                {/* <SiGmail /> */}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaneAnimation;
