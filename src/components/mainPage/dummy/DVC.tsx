"use client";

import { useState } from "react";
import { Heart, MoreHorizontal, Lock } from "lucide-react";

interface CategoryPill {
  label: string;
  variant: "work" | "personal" | "general";
}

interface CardData {
  id: string;
  type: "date" | "emojis" | "simple" | "locked" | "images" | "text" | "button";
  title?: string;
  subtitle?: string;
  date?: string;
  categories?: CategoryPill[];
  description?: string;
  emojis?: string[];
  images?: string[];
  isLocked?: boolean;
  isFavorite?: boolean;
}

interface DesktopViewComponentProps {
  cards?: CardData[];
  onCardClick?: (cardId: string) => void;
}

export const DUMMY_DATA: CardData[] = [
  {
    id: "1",
    type: "simple",
    title: "Guide to Creating a Website",
    date: "THU, 4 MAY 23",
    description:
      "These steps and button labels are crafted to be intuitive and user-friendly, guiding the user through the website creation process with clarity and ease.\n\nStep: Select a Website Template Copy \"Choose a template to start building your website. Pick one that best fits your vision.\"\nPrimary Button: \"Select Template\"\nSecondary Button: \"Preview Template\"\nStep: Customize Your Template\nCopy: \"Now, make it yours! Customize the template to match your style and content needs.\"\nPrimary Button: \"Customize Design\"\nSecondary Button: \"Reset to Default\"\nStep: Add Your Content\nCopy: \"Add your personal touch. Insert text, images, and videos to bring your site to life.\"\nPrimary Button: \"Add Content\"\nSecondary Button: \"Undo Changes\"\nStep: Set Up Domain\nCopy: \"Choose a domain name that represents your website. This will be your address on the web.\"\nPrimary Button: \"Register Domain\"\nSecondary Button: \"Suggest Domains\"\nStep: Preview Your Website\nCopy: \"Almost there! Preview your website to see how it looks to your visitors.\"\nPrimary Button: \"Preview Site\"\nSecondary Button: \"Edit Further\"\nStep: Publish Your Website\nCopy: \"Ready to go live? Publish your website and share your creation with the world.\"\nPrimary Button: \"Publish Now\"\nSecondary Button: \"Go Back\"",
  },
  {
    id: "2",
    type: "images",
    images: [
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
      "https://images.unsplash.com/photo-1579546929662-711aa81148cf",
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1",
    ],
    isFavorite: false,
  },
  {
    id: "3",
    type: "text",
    title: "Today in Design",
  },
  {
    id: "4",
    type: "button",
  },
  {
    id: "5",
    type: "emojis",
    emojis: ["🍕", "🔥"],
  },
  {
    id: "6",
    type: "date",
    date: "Nov 20",
  },
  {
    id: "7",
    type: "locked",
    title: "Passwords For Work",
    date: "THU, 4 MAY 23",
    categories: [
      { label: "WORK", variant: "work" },
      { label: "PERSONAL", variant: "personal" },
      { label: "GENERAL", variant: "general" },
    ],
    description:
      "These steps and button labels are crafted to be intuitive and user-friendly, guiding the user through the website creation process with clarity and ease.\n\nStep: Select a Website Template Copy \"Choose a template to start building your website. Pick one that best fits your vision.\"\nPrimary Button: \"Select Template\"\nSecondary Button: \"Preview Template\"\nStep: Customize Your Template\nCopy: \"Now, make it yours! Customize the template to match your style and content needs.\"\nPrimary Button: \"Customize Design\"\nSecondary Button: \"Reset to Default\"\nStep: Add Your Content\nCopy: \"Add your personal touch. Insert text, images, and videos to bring your site to life.\"\nPrimary Button: \"Add Content\"\nSecondary Button: \"Undo Changes\"\nStep: Set Up Domain\nCopy: \"Choose a domain name that represents your website. This will be your address on the web.\"\nPrimary Button: \"Register Domain\"\nSecondary Button: \"Suggest Domains\"\nStep: Preview Your Website\nCopy: \"Almost there! Preview your website to see how it looks to your visitors.\"\nPrimary Button: \"Preview Site\"\nSecondary Button: \"Edit Further\"\nStep: Publish Your Website\nCopy: \"Ready to go live? Publish your website and share your creation with the world.\"\nPrimary Button: \"Publish Now\"\nSecondary Button: \"Go Back\"",
    isLocked: true,
  },
];

export function DesktopViewComponent({
  cards = DUMMY_DATA,
  onCardClick,
}: DesktopViewComponentProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getCategoryColor = (variant: CategoryPill["variant"]) => {
    switch (variant) {
      case "work":
        return "bg-[#26A69A]";
      case "personal":
        return "bg-[#134F71]";
      case "general":
        return "bg-[#E53935]";
      default:
        return "bg-gray-500";
    }
  };

  const renderCard = (card: CardData) => {
    const baseCardClasses = `
      rounded-3xl border transition-all duration-300
      ${
        isDarkMode
          ? "border-[#F0F3F6]/20 bg-[#353535] shadow-[0_2px_8px_0_rgba(255,255,255,0.10),0_1px_2px_0_rgba(255,255,255,0.10)]"
          : "border-[#F0F3F6] bg-[#FBFCFE] shadow-[0_2px_8px_0_rgba(0,0,0,0.10),0_1px_2px_0_rgba(0,0,0,0.10)]"
      }
      hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.15),0_2px_4px_0_rgba(0,0,0,0.15)]
      hover:scale-[1.02]
      cursor-pointer
    `;

    switch (card.type) {
      case "simple":
        return (
          <div
            key={card.id}
            className={`${baseCardClasses} inline-flex h-[196px] w-[279px] p-6 pb-4 flex-col items-start gap-3`}
            onClick={() => onCardClick?.(card.id)}
          >
            <div className="flex flex-col items-start gap-[6px] flex-1 self-stretch">
              <div
                className={`w-full font-[Nunito] text-[23px] font-bold tracking-[-0.225px] ${
                  isDarkMode ? "text-white" : "text-[#353535]"
                }`}
              >
                {card.title}
              </div>
              <div className="flex flex-col items-start flex-1 self-stretch relative">
                <div
                  className={`w-full flex-1 font-[Nunito] text-[11px] font-normal leading-tight tracking-[-0.113px] ${
                    isDarkMode ? "text-[#C1C1CD]" : "text-[#A1A1B3]"
                  } line-clamp-6 overflow-hidden`}
                >
                  {card.description}
                </div>
                <div
                  className="h-[125px] self-stretch absolute bottom-0"
                  style={{
                    background: isDarkMode
                      ? "linear-gradient(180deg, rgba(53, 53, 53, 0.00) 0%, #353535 115.82%)"
                      : "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FBFCFE 115.82%)",
                  }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center self-stretch">
              <div
                className={`font-[Nunito] text-[15px] font-bold tracking-[-0.155px] ${
                  isDarkMode ? "text-[#C1C1CD]" : "text-[#A1A1B3]"
                }`}
              >
                {card.date}
              </div>
              <MoreHorizontal
                className={`w-[20px] h-[20px] transition-colors hover:opacity-70 ${
                  isDarkMode ? "stroke-[#C1C1CD]" : "stroke-[#A1A1B3]"
                }`}
                strokeWidth={1.13}
              />
            </div>
          </div>
        );

      case "images":
        return (
          <div
            key={card.id}
            className={`${baseCardClasses} inline-flex px-3 pt-3 pb-0 pl-6 flex-col items-end gap-3 w-[251px] h-[311px]`}
            onClick={() => onCardClick?.(card.id)}
          >
            <Heart
              className={`w-5 h-5 transition-all hover:scale-110 ${
                card.isFavorite ? "fill-red-500 stroke-red-500" : "fill-[#9797AA] stroke-none"
              }`}
            />
            <div className="flex pr-3 flex-col items-center gap-1 self-stretch">
              <div className="w-[164px] h-[315px] relative">
                {card.images?.[2] && (
                  <div
                    className="absolute left-[18px] top-[137px] w-[129px] h-[178px] rounded-[4px] bg-cover bg-center shadow-[0_0_0_0.3px_rgba(0,0,0,0.10)_inset]"
                    style={{ backgroundImage: `url(${card.images[2]})` }}
                  />
                )}
                {card.images?.[1] && (
                  <div
                    className="absolute left-[10px] top-[66px] w-[144px] h-[178px] rounded-[4px] bg-cover bg-center shadow-[0_0_0_0.3px_rgba(0,0,0,0.10)_inset]"
                    style={{ backgroundImage: `url(${card.images[1]})` }}
                  />
                )}
                {card.images?.[0] && (
                  <div
                    className="absolute left-0 top-0 w-[164px] h-[178px] rounded-[4px] bg-cover bg-center shadow-[0_0_0_0.3px_rgba(0,0,0,0.10)_inset]"
                    style={{ backgroundImage: `url(${card.images[0]})` }}
                  />
                )}
              </div>
            </div>
          </div>
        );

      case "text":
        return (
          <div
            key={card.id}
            className={`${baseCardClasses} flex w-[188px] h-[56px] px-5 py-4 flex-col justify-center items-center`}
            onClick={() => onCardClick?.(card.id)}
          >
            <div className="flex flex-col justify-center items-center gap-[5px] self-stretch">
              <div className="w-full text-center font-[Nunito] text-[29px] font-bold tracking-[-0.29px] leading-none">
                <span className={isDarkMode ? "text-white" : "text-[#353535]"}>
                  Today in{" "}
                </span>
                <span className={isDarkMode ? "text-[#C1C1CD]" : "text-[#A1A1B3]"}>
                  Design
                </span>
              </div>
            </div>
          </div>
        );

      case "button":
        return (
          <div
            key={card.id}
            className={`flex w-[56px] h-[56px] rounded-[14px] bg-[#129CEC] items-center justify-center cursor-pointer
              transition-all duration-300 hover:shadow-[0_4px_16px_0_rgba(18,156,236,0.4)] hover:scale-105`}
            onClick={() => onCardClick?.(card.id)}
          />
        );

      case "emojis":
        return (
          <div
            key={card.id}
            className={`${baseCardClasses} inline-flex h-[69px] w-[118px] px-5 py-3 flex-col justify-center items-center gap-2`}
            onClick={() => onCardClick?.(card.id)}
          >
            <div className="flex w-full h-[42px] justify-between items-center flex-shrink-0">
              {card.emojis?.map((emoji, idx) => (
                <div
                  key={idx}
                  className={`text-center font-[Nunito] text-[39px] font-bold tracking-[-0.394px] ${
                    isDarkMode ? "text-white" : "text-[#353535]"
                  }`}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        );

      case "date":
        return (
          <div
            key={card.id}
            className={`${baseCardClasses} relative w-[144px] h-[69px] overflow-hidden`}
            onClick={() => onCardClick?.(card.id)}
          >
            <div className="absolute left-[-9px] top-[17px] w-[170px] h-[46px]">
              <div
                className="absolute left-[-2px] top-[-33px] w-[170px] h-[111px] text-center font-[Nunito] text-[82px] font-black tracking-[-0.816px]"
                style={{
                  background: isDarkMode
                    ? "linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)"
                    : "linear-gradient(180deg, #353535 0%, rgba(53, 53, 53, 0.00) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                23
              </div>
              <div
                className="absolute left-0 top-[-14px] w-[172px] h-[70px]"
                style={{
                  background: isDarkMode
                    ? "linear-gradient(180deg, rgba(53, 53, 53, 0.00) 0%, #353535 66.13%)"
                    : "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FBFCFE 66.13%)",
                }}
              />
            </div>
            <div className="absolute left-[-9px] top-[18px] flex w-[170px] h-[45px] flex-col justify-center items-center gap-[4px]">
              <div
                className={`w-full text-center font-[Nunito] text-[33px] font-extrabold tracking-[-0.333px] ${
                  isDarkMode ? "text-white" : "text-[#353535]"
                }`}
              >
                {card.date}
              </div>
            </div>
          </div>
        );

      case "locked":
        return (
          <div
            key={card.id}
            className={`${baseCardClasses} inline-flex h-[406px] w-[268px] p-[22px] pb-[17px] flex-col items-start gap-[11px]`}
            onClick={() => onCardClick?.(card.id)}
          >
            <div className="flex w-full items-start gap-[6px] relative overflow-hidden">
              {card.categories?.slice(0, 3).map((cat, idx) => (
                <div
                  key={idx}
                  className={`flex px-[11px] py-[6px] justify-center items-center gap-[3px] rounded-[28px] ${getCategoryColor(
                    cat.variant
                  )} transition-transform hover:scale-105`}
                >
                  <div className="text-white font-[Nunito] text-[15px] font-bold tracking-[-0.148px]">
                    {cat.label}
                  </div>
                </div>
              ))}
              <div
                className="absolute right-0 w-[16px] h-[22px]"
                style={{
                  background: isDarkMode
                    ? "linear-gradient(270deg, #353535 0.11%, rgba(53, 53, 53, 0.00) 99.89%)"
                    : "linear-gradient(270deg, #FBFCFE 0.11%, rgba(251, 252, 254, 0.00) 99.89%)",
                }}
              />
            </div>

            <div className="flex flex-col items-start gap-[6px] flex-1 self-stretch">
              <div
                className={`w-full font-[Nunito] text-[23px] font-bold tracking-[-0.226px] ${
                  isDarkMode ? "text-white" : "text-[#353535]"
                }`}
              >
                {card.title}
              </div>
              <div className="flex flex-col items-start flex-1 self-stretch relative">
                <div
                  className={`w-full flex-1 font-[Nunito] text-[11px] font-normal tracking-[-0.113px] ${
                    isDarkMode ? "text-[#C1C1CD]" : "text-[#A1A1B3]"
                  } blur-[1.4px]`}
                >
                  {card.description}
                </div>
                <div
                  className="h-[125px] self-stretch absolute bottom-0"
                  style={{
                    background: isDarkMode
                      ? "linear-gradient(180deg, rgba(53, 53, 53, 0.00) 0%, #353535 100%)"
                      : "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FBFCFE 100%)",
                  }}
                />
                <Lock
                  className="absolute left-[86px] top-[73px] w-[51px] h-[64px] fill-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.10)] drop-shadow-[0_6px_12px_rgba(0,0,0,0.10)]"
                  strokeWidth={0}
                />
              </div>
            </div>

            <div className="flex justify-between items-center self-stretch">
              <div
                className={`font-[Nunito] text-[16px] font-bold tracking-[-0.155px] ${
                  isDarkMode ? "text-[#C1C1CD]" : "text-[#A1A1B3]"
                }`}
              >
                {card.date}
              </div>
              <MoreHorizontal
                className={`w-[20px] h-[20px] transition-colors hover:opacity-70 ${
                  isDarkMode ? "stroke-[#C1C1CD]" : "stroke-[#A1A1B3]"
                }`}
                strokeWidth={1.13}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen p-0 transition-colors duration-300 font-[Nunito] ${
        isDarkMode ? "bg-[#2B2B2B]" : "bg-white"
      }`}
    >
      <div
        className={`w-[870px] h-[527px] mx-auto rounded-md transition-colors duration-300 relative ${
          isDarkMode ? "bg-[#2B2B2B]" : "bg-white"
        }`}
      >
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`absolute top-4 left-4 z-10 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
            isDarkMode
              ? "bg-white text-[#353535] hover:bg-gray-200"
              : "bg-[#353535] text-white hover:bg-[#4A4A4A]"
          }`}
        >
          {isDarkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        <div className="absolute left-5 top-[225px] w-[508px] inline-flex flex-col items-start gap-2">
          <div
            className={`w-[508px] h-[260px] font-[Nunito] text-[85px] font-extrabold leading-[86px] tracking-[-3.4px] ${
              isDarkMode ? "text-white" : "text-[#353535]"
            }`}
          >
            Apple
            <br />
            Style
            <br />
            Design Cards
          </div>
          <div
            className={`font-[Nunito] text-[26px] font-medium ${
              isDarkMode ? "text-[#C1C1CD]" : "text-[#6C6C85]"
            }`}
          >
            Dark and Light mode included
          </div>
        </div>

        <div className="absolute left-5 top-4">
          {cards.find((c) => c.type === "simple") &&
            renderCard(cards.find((c) => c.type === "simple")!)}
        </div>

        <div className="absolute left-[315px] top-4">
          {cards.find((c) => c.type === "images") &&
            renderCard(cards.find((c) => c.type === "images")!)}
        </div>

        <div className="absolute left-[315px] top-[336px]">
          {cards.find((c) => c.type === "text") &&
            renderCard(cards.find((c) => c.type === "text")!)}
        </div>

        <div className="absolute left-[510px] top-[336px]">
          {cards.find((c) => c.type === "button") &&
            renderCard(cards.find((c) => c.type === "button")!)}
        </div>

        <div className="absolute left-[582px] top-4">
          {cards.find((c) => c.type === "emojis") &&
            renderCard(cards.find((c) => c.type === "emojis")!)}
        </div>

        <div className="absolute left-[706px] top-4">
          {cards.find((c) => c.type === "date") &&
            renderCard(cards.find((c) => c.type === "date")!)}
        </div>

        <div className="absolute left-[582px] top-[101px]">
          {cards.find((c) => c.type === "locked") &&
            renderCard(cards.find((c) => c.type === "locked")!)}
        </div>
      </div>
    </div>
  );
}
