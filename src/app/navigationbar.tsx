"use client";

import { useState } from "react";
import Image from "next/image";

import "../app/css/navigationbar.css";
import icon_algorithm from "../app/images/algorithm.png";
import icon_frontend from "../app/images/frontend.png";
import icon_introduce from "../app/images/introduce.png";
import icon_knowledge from "../app/images/knowledge.png";

// className={`bg-sky-500 hover:bg-sky-700 ${isBlogHovered ? "opacity-100" : ""}`}>Menu</label>

export default function NavigationBar() {
  const [focus, setFocus] = useState("");

  return (
    <>
      <nav
        id="wjwikiNavBar"
        onMouseLeave={() => setFocus("")}
        className={`reactSizeCSS fixed flex w-screen items-center justify-between
        bg-transparent px-1 py-2 opacity-50 transition delay-100
        ease-in-out hover:opacity-100`}
      >
        <div className={``}>
          <ul
            className={`inline-block items-center justify-start px-4 text-xl
          font-bold text-slate-300 hover:text-white`}
          >
            <li>
              <a href={"/"} className={`hover:bg-transparent`}>
                <span>뭐가문제지</span>
              </a>
            </li>
          </ul>

          <ul
            onMouseEnter={() => setFocus("introduce")}
            className={`inline-block h-4 cursor-default items-center px-5 text-slate-300 hover:text-white`}
          >
            <li className="relative-li">
              Introduce
              {focus === "introduce" ? (
                <ul
                  className={`navUlCSS absolute w-52 rounded-md bg-white p-2
                  text-black`}
                >
                  <li>
                    <a href={"/introduce"}>
                      <Image
                        alt="소개 아이콘"
                        src={icon_introduce}
                        width={24}
                        height={24}
                      />
                      <span>소개</span>
                    </a>
                  </li>
                </ul>
              ) : null}
            </li>
          </ul>

          <ul
            onMouseEnter={() => setFocus("blog")}
            className={`inline-block cursor-default items-center px-5 text-slate-300 hover:text-white`}
          >
            <li className="relative-li">
              Blog
              {focus === "blog" ? (
                <ul
                  className={`navUlCSS absolute w-52 rounded-md bg-white p-2
                  text-black`}
                >
                  <li>
                    <a href={"/algorithm"}>
                      <Image
                        alt="알고리즘 아이콘"
                        src={icon_algorithm}
                        width={24}
                        height={24}
                      />
                      <span>알고리즘</span>
                    </a>
                  </li>
                  <li>
                    <a href={"/frontend"}>
                      <Image
                        alt="프론트엔드 아이콘"
                        src={icon_frontend}
                        width={24}
                        height={24}
                      />
                      <span>프론트엔드</span>
                    </a>
                  </li>
                  <li>
                    <a href={"/knowledge"}>
                      <Image
                        alt="지식 아이콘"
                        src={icon_knowledge}
                        width={24}
                        height={24}
                      />
                      <span>지식</span>
                    </a>
                  </li>
                </ul>
              ) : null}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
