import Link from "next/link";
import GithubIconLink from "./GithubIconLink";
import logo from '../app/images/logo.png'
import Image from 'next/image'

export default function Footer() {
  const originalTemplate = {
    name: "Free Blog Template",
    url: "https://www.figma.com/community/file/1456300075957972581",
    author: "Naufal Adiftya",
  };

  return (
    <footer className="w-full bg-white px-4 py-14 md:py-14 flex flex-col items-center gap-12">
      <hr className="w-full mt-10" />
      <div className="w-full max-w-[1216px] min-w-[343px] flex flex-wrap items-center content-center gap-8">
        {/* Logo and Social Links Column */}
        <div className="min-w-[343px] flex flex-col items-start gap-3">
          {/* Logo */}
          <div className="min-w-[343px] h-10 flex items-center justify-start gap-2">
            <Image
              width={64}
              height={64}
              src={logo}
              alt="projectwj logo"
            />
{/*             <span className="flex-1 text-[#212121] font-bold text-xl leading-[150%]">
              WJwiki
            </span> */}
          </div>

          {/* Social Links */}
{/*           <div className="min-w-[343px] flex items-start gap-3">
            <GithubIconLink 
              href="https://github.com/ProjectWJ"
              size={24}
            />
          </div> */}
        </div>

        {/* Contact Information */}
        <div className="min-w-[343px] flex-1 flex flex-wrap items-start content-start gap-8 md:gap-8">

          {/* Email */}
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

              <GithubIconLink 
                href="https://github.com/ProjectWJ"
                size={16}
              />
            </p>
          </div>
        </div>
      </div>

      {/* 1-B. CC BY 4.0 라이선스 명시 (Attribution) */}
      <div className="w-full max-w-[1216px] min-w-[343px] flex flex-wrap items-center content-center gap-8">
        <div className="text-gray-500 font-normal text-xs">
          <span>
              디자인 템플릿은 <Link 
                  href={originalTemplate.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-700"
              >
                  {originalTemplate.name}
              </Link>
              (저작자: {originalTemplate.author})에서 가져왔으며, <Link
                  href="http://creativecommons.org/licenses/by/4.0/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-700"
              >CC BY 4.0
              </Link> 라이선스가 적용됩니다.
          </span>
        </div>
      </div>

      {/* Credits and Footer Links */}
      <div className="w-full max-w-[1216px] min-w-[343px] flex flex-wrap items-start content-start gap-8">

        {/* Copyright */}
        <div className="flex-1 text-[#30333C] font-normal text-sm leading-[150%]">
          © 2025 ProjectWJ. All rights reserved.
        </div>

        {/* Footer Links */}
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



            {/* Instagram */}
{/*             <a href="#" className="w-6 h-6 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.875 9C1.875 5.64124 1.875 3.96187 2.91843 2.91843C3.96187 1.875 5.64124 1.875 9 1.875C12.3587 1.875 14.0381 1.875 15.0816 2.91843C16.125 3.96187 16.125 5.64124 16.125 9C16.125 12.3587 16.125 14.0381 15.0816 15.0816C14.0381 16.125 12.3587 16.125 9 16.125C5.64124 16.125 3.96187 16.125 2.91843 15.0816C1.875 14.0381 1.875 12.3587 1.875 9Z"
                  stroke="#4F5563"
                  strokeWidth="1.125"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.375 9C12.375 10.864 10.864 12.375 9 12.375C7.13604 12.375 5.625 10.864 5.625 9C5.625 7.13604 7.13604 5.625 9 5.625C10.864 5.625 12.375 7.13604 12.375 9Z"
                  stroke="#4F5563"
                  strokeWidth="1.125"
                />
                <path
                  d="M13.1308 4.875H13.124"
                  stroke="#4F5563"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a> */}

            {/* X (Twitter) */}
{/*             <a href="#" className="w-6 h-6 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.25 15.75L7.9113 10.0887M7.9113 10.0887L2.25 2.25H6L10.0887 7.9113M7.9113 10.0887L12 15.75H15.75L10.0887 7.9113M15.75 2.25L10.0887 7.9113"
                  stroke="#4F5563"
                  strokeWidth="1.125"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a> */}

            {/* LinkedIn */}
{/*             <a href="#" className="w-6 h-6 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.375 7.125H3C2.29289 7.125 1.93934 7.125 1.71967 7.34467C1.5 7.56435 1.5 7.9179 1.5 8.625V15C1.5 15.7071 1.5 16.0606 1.71967 16.2803C1.93934 16.5 2.29289 16.5 3 16.5H3.375C4.08211 16.5 4.43566 16.5 4.65533 16.2803C4.875 16.0606 4.875 15.7071 4.875 15V8.625C4.875 7.9179 4.875 7.56435 4.65533 7.34467C4.43566 7.125 4.08211 7.125 3.375 7.125Z"
                  stroke="#4F5563"
                  strokeWidth="1.125"
                />
                <path
                  d="M4.875 3.1875C4.875 4.11948 4.11948 4.875 3.1875 4.875C2.25552 4.875 1.5 4.11948 1.5 3.1875C1.5 2.25552 2.25552 1.5 3.1875 1.5C4.11948 1.5 4.875 2.25552 4.875 3.1875Z"
                  stroke="#4F5563"
                  strokeWidth="1.125"
                />
                <path
                  d="M9.2445 7.125H8.625C7.9179 7.125 7.56435 7.125 7.34467 7.34467C7.125 7.56435 7.125 7.9179 7.125 8.625V15C7.125 15.7071 7.125 16.0606 7.34467 16.2803C7.56435 16.5 7.9179 16.5 8.625 16.5H9C9.7071 16.5 10.0606 16.5 10.2803 16.2803C10.5 16.0606 10.5 15.7071 10.5 15L10.5001 12.3751C10.5001 11.1325 10.8961 10.1251 12.0659 10.1251C12.6508 10.1251 13.125 10.6288 13.125 11.2501V14.6251C13.125 15.3322 13.125 15.6857 13.3447 15.9054C13.5643 16.1251 13.9179 16.1251 14.625 16.1251H14.999C15.706 16.1251 16.0594 16.1251 16.2791 15.9055C16.4988 15.6859 16.4989 15.3324 16.499 14.6255L16.5001 10.5002C16.5001 8.63625 14.7273 7.12518 12.9726 7.12518C11.9737 7.12518 11.0825 7.61482 10.5001 8.3805C10.5 7.90792 10.5 7.67167 10.3974 7.49625C10.3324 7.38514 10.2398 7.29265 10.1288 7.22765C9.95333 7.125 9.71708 7.125 9.2445 7.125Z"
                  stroke="#4F5563"
                  strokeWidth="1.125"
                  strokeLinejoin="round"
                />
              </svg>
            </a> */}

            {/* Facebook */}
{/*             <a href="#" className="w-6 h-6 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.63636 7.74997C3.90304 7.74997 3.75 7.8939 3.75 8.5833V9.83333C3.75 10.5228 3.90304 10.6667 4.63636 10.6667H6.40909V15.6667C6.40909 16.3561 6.56213 16.5 7.29545 16.5H9.06818C9.80153 16.5 9.95453 16.3561 9.95453 15.6667V10.6667H11.945C12.5012 10.6667 12.6446 10.565 12.7973 10.0623L13.1772 8.81227C13.4389 7.95105 13.2776 7.74997 12.3249 7.74997H9.95453V5.66667C9.95453 5.20643 10.3514 4.83333 10.8409 4.83333H13.3636C14.0969 4.83333 14.25 4.68944 14.25 4V2.33333C14.25 1.64389 14.0969 1.5 13.3636 1.5H10.8409C8.39325 1.5 6.40909 3.36548 6.40909 5.66667V7.74997H4.63636Z"
                  stroke="#4F5563"
                  strokeWidth="1.125"
                  strokeLinejoin="round"
                />
              </svg>
            </a> */}

            {/* YouTube */}
{/*             <a href="#" className="w-6 h-6 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 15.375C10.3573 15.375 11.6588 15.2409 12.8651 14.9951C14.3717 14.6879 15.1251 14.5343 15.8126 13.6504C16.5 12.7666 16.5 11.752 16.5 9.72263V8.27737C16.5 6.24805 16.5 5.2334 15.8126 4.34953C15.1251 3.46566 14.3717 3.3121 12.8651 3.00496C11.6588 2.75908 10.3573 2.625 9 2.625C7.64272 2.625 6.34117 2.75908 5.13492 3.00496C3.62825 3.3121 2.87491 3.46566 2.18745 4.34953C1.5 5.2334 1.5 6.24805 1.5 8.27737V9.72263C1.5 11.752 1.5 12.7666 2.18745 13.6504C2.87491 14.5343 3.62825 14.6879 5.13492 14.9951C6.34117 15.2409 7.64272 15.375 9 15.375Z"
                  stroke="#4F5563"
                  strokeWidth="1.125"
                />
                <path
                  d="M11.9716 9.23467C11.8603 9.68902 11.2681 10.0153 10.0837 10.6681C8.7954 11.3779 8.1513 11.7328 7.6296 11.5961C7.4529 11.5498 7.29015 11.4683 7.15349 11.3578C6.75 11.0317 6.75 10.3544 6.75 9C6.75 7.64557 6.75 6.96834 7.15349 6.64213C7.29015 6.53164 7.4529 6.45022 7.6296 6.4039C8.1513 6.26716 8.7954 6.62209 10.0837 7.33195C11.2681 7.98465 11.8603 8.31097 11.9716 8.76532C12.0095 8.91997 12.0095 9.08002 11.9716 9.23467Z"
                  stroke="#4F5563"
                  strokeWidth="1.125"
                  strokeLinejoin="round"
                />
              </svg>
            </a> */}


          {/* Address */}
{/*           <div className="min-w-[276px] flex flex-col items-start gap-1">
            <h3 className="text-[#30333C] font-semibold text-sm leading-[150%]">
              Address
            </h3>
            <p className="text-[#30333C] font-normal text-sm leading-[150%]">
              Level 1, 12 Sample St, Sydney NSW 2000
            </p>
          </div>
 */}
          {/* Phone Number */}
{/*           <div className="min-w-[200px] flex-1 flex flex-col items-start gap-1">
            <h3 className="text-[#30333C] font-semibold text-sm leading-[150%]">
              Phone Number
            </h3>
            <p className="text-[#30333C] font-normal text-sm leading-[150%]">
              1800 123 4567
            </p>
          </div>
 */}