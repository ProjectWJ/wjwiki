import Link from "next/link";
import GithubIconLink from "./GithubIconLink";
import { FooterLogo } from "./LogoSize";

export default function Footer() {
  const originalTemplate = {
    name: "Free Blog Template",
    url: "https://www.figma.com/community/file/1456300075957972581",
    author: "Naufal Adiftya",
  };

  return (
    <footer className="w-full px-4 py-14 md:py-14 flex flex-col items-center gap-12">
      <hr className="w-full mt-10" />
      <div className="w-full max-w-[1216px] min-w-[343px] flex flex-wrap items-center content-center gap-8">
        <div className="min-w-[343px] flex flex-col items-start gap-3">
          {/* 로고 */}
          <div className="min-w-[343px] h-10 flex items-center justify-start gap-2">
            <FooterLogo />
          </div>
        </div>

        <div className="min-w-[343px] flex-1 flex flex-wrap items-start content-start gap-8 md:gap-8">
          {/* 이메일 */}
          <div className="min-w-[250px] flex flex-col items-start gap-1">
            <h3 className="text-[#30333C] font-semibold text-sm leading-[150%]">
              Email
            </h3>
            <p className="text-[#30333C] font-normal text-sm leading-[150%]">
              projectwj@proton.me
            </p>
          </div>

          <div className="min-w-[250px] flex flex-col items-start gap-1">
            <h3 className="text-[#30333C] font-semibold text-sm leading-[150%]">
              Github
            </h3>
            <p className="text-[#30333C] font-normal text-sm leading-[150%] flex items-center gap-1">
              <GithubIconLink href="https://github.com/ProjectWJ" size={16} />
            </p>
          </div>
        </div>
      </div>

      {/* 라이선스 명시 */}
      <div className="w-full max-w-[1216px] min-w-[343px] flex flex-wrap items-center content-center gap-8">
        <div className="text-gray-500 font-normal text-xs">
          <span>
            디자인 템플릿은{" "}
            <Link
              href={originalTemplate.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              {originalTemplate.name}
            </Link>
            (저작자: {originalTemplate.author})에서 가져왔으며,{" "}
            <Link
              href="http://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              CC BY 4.0
            </Link>{" "}
            라이선스가 적용됩니다.
          </span>
        </div>
      </div>

      <div className="w-full max-w-[1216px] min-w-[343px] flex flex-wrap items-start content-start gap-8">
        {/* 카피라이트 */}
        <div className="flex-1 text-[#30333C] font-normal text-sm leading-[150%]">
          © 2025 ProjectWJ. All rights reserved.
        </div>

        {/* 링크 */}
        <div className="min-w-[343px] max-w-[400px] flex-1 flex flex-wrap items-start content-start gap-6">
          <Link
            href="/terms"
            target="_blank"
            className="min-w-[100px] flex-1 text-[#30333C] font-normal text-sm leading-[150%] hover:underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            target="_blank"
            className="min-w-[100px] flex-1 text-[#30333C] font-normal text-sm leading-[150%] hover:underline"
          >
            Terms of Service
          </Link>
          <Link
            href="/terms"
            target="_blank"
            className="min-w-[100px] flex-1 text-[#30333C] font-normal text-sm leading-[150%] hover:underline"
          >
            Cookies Settings
          </Link>
        </div>
      </div>
    </footer>
  );
}
