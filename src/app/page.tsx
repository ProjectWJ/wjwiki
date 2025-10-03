"use client";

import { Analytics } from "@vercel/analytics/next"
import { useEffect, useState } from "react";
import NavigationBar from "./navigationbar";
import "../app/css/page.css";

const welcomeText = "Welcome To WJWIKI !".split("");

export default function Home() {
  const [nowTitle, setNowTitle] = useState("");

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    const animateTitle = async () => {
      let temp = "";
      for (let i = 0; i < welcomeText.length; i++) {
        temp += welcomeText[i];
        setNowTitle(temp);
        await delay(100);
      }
    };

    animateTitle();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const navBar = document.getElementById("wjwikiNavBar");
      const takeTour = document.getElementById("takeTourId");
      const intro = document.getElementById("intro");
      const algo = document.getElementById("algo");
      const front = document.getElementById("front");
      const know = document.getElementById("know");

      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // 내비게이션 바 스타일 토글
      if (navBar) {
        navBar.classList.toggle("navScrolledCSS", scrollY > (vh / 10) * 8);
      }

      // 둘러보기 제목 등장
      if (takeTour && scrollY >= vh / 10) {
        takeTour.classList.add("takeTourCSS");
      }

      // 사각형 컨텐츠 애니메이션
      if (
        scrollY >= (vh / 10) * 3 &&
        intro &&
        algo &&
        front &&
        know &&
        !intro.classList.contains("squareIntro")
      ) {
        intro.classList.add("squareIntro");
        algo.classList.add("squareAlgo");
        front.classList.add("squareFront");
        know.classList.add("squareKnow");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <NavigationBar />
      <div
        id="mainScreen"
        className="bgImageCSS h-screen bg-cover bg-fixed bg-center"
      >
        <div className="titleCSS relative left-2/4 top-2/4 inline-block text-5xl font-bold text-white">
          <div className="blinkAnimationCSS">{nowTitle}</div>
        </div>
      </div>

      <div id="aboutScreen" className="h-screen">
        <div className="h-1/6"></div>

        <p id="takeTourId" className="mb-20 mt-20 text-center text-4xl">
          둘러보기
        </p>

        <div className="listDivPaddingCSS flex flex-wrap justify-between">
          {[
            { id: "intro", title: "소개(Introduce)", href: "/introduce" },
            { id: "algo", title: "알고리즘(Algorithm)", href: "/algorithm" },
            { id: "front", title: "프론트엔드(Frontend)", href: "/frontend" },
            { id: "know", title: "지식(Knowledge)", href: "/knowledge" },
          ].map((item) => (
            <div
              key={item.id}
              id={item.id}
              className="inline-block cursor-pointer rounded-2xl border border-solid text-center transition delay-100 ease-in-out hover:bg-gray-50 hover:shadow-2xl"
              onClick={() => (window.location.href = item.href)}
            >
              <p className="pb-5 text-xl font-medium">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
      <Analytics />
    </>
  );
}
