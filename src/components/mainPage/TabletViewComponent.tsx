"use client";

import { useState } from "react";
import { Heart, MoreHorizontal, Lock } from "lucide-react";

interface CategoryPill {
  label: string;
  variant: "work" | "personal" | "general";
}

interface CardData {
  id: string;
  type: "date" | "emojis" | "header" | "simple" | "detailed" | "locked" | "images";
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

interface TabletViewComponentProps {
  cards: CardData[];
  onCardClick?: (cardId: string) => void;
}

const DUMMY_DATA: CardData[] = [
  {
    id: "1",
    type: "date",
    date: "Nov 20",
  },
  {
    id: "2",
    type: "emojis",
    emojis: ["🍕", "🔥"],
  },
  {
    id: "3",
    type: "header",
    title: "Today in Design",
  },
  {
    id: "4",
    type: "detailed",
    title: "Guide to Creating a Website",
    date: "THU, 4 MAY 23",
    categories: [
      { label: "WORK", variant: "work" },
      { label: "PERSONAL", variant: "personal" },
      { label: "GENERAL", variant: "general" },
    ],
    description:
      "These steps and button labels are crafted to be intuitive and user-friendly, guiding the user through the website creation process with clarity and ease.\n\nStep: Select a Website Template Copy \"Choose a template to start building your website. Pick one that best fits your vision.\"\nPrimary Button: \"Select Template\"\nSecondary Button: \"Preview Template\"\nStep: Customize Your Template\nCopy: \"Now, make it yours! Customize the template to match your style and content needs.\"\nPrimary Button: \"Customize Design\"\nSecondary Button: \"Reset to Default\"\nStep: Add Your Content\nCopy: \"Add your personal touch. Insert text, images, and videos to bring your site to life.\"\nPrimary Button: \"Add Content\"\nSecondary Button: \"Undo Changes\"\nStep: Set Up Domain\nCopy: \"Choose a domain name that represents your website. This will be your address on the web.\"\nPrimary Button: \"Register Domain\"\nSecondary Button: \"Suggest Domains\"\nStep: Preview Your Website\nCopy: \"Almost there! Preview your website to see how it looks to your visitors.\"\nPrimary Button: \"Preview Site\"\nSecondary Button: \"Edit Further\"\nStep: Publish Your Website\nCopy: \"Ready to go live? Publish your website and share your creation with the world.\"\nPrimary Button: \"Publish Now\"\nSecondary Button: \"Go Back\"",
  },
  {
    id: "5",
    type: "images",
    title: "Guide to Creating a Website",
    images: [
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
      "https://images.unsplash.com/photo-1579546929662-711aa81148cf",
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1",
    ],
    isFavorite: false,
  },
  {
    id: "6",
    type: "simple",
    title: "Untitled",
    date: "TODAY",
  },
  {
    id: "7",
    type: "simple",
    title: "What is good design",
    subtitle: "Join 1.3k + readers",
    date: "THU, 4 MAY 23",
  },
  {
    id: "8",
    type: "locked",
    title: "Passwords For Work",
    date: "THU, 4 MAY 23",
    categories: [
      { label: "WORK", variant: "work" },
      { label: "PERSONAL", variant: "personal" },
      { label: "GENERAL", variant: "general" },
    ],
    description:
      "These steps and button labels are crafted to be intuitive and user-friendly, guiding the user through the website creation process with clarity and ease.",
    isLocked: true,
  },
  {
    id: "9",
    type: "simple",
    title: "My Template",
    date: "FRI, 28 APR 23",
    description:
      "These steps and button labels are crafted to be intuitive and user-friendly, guiding the user through the website creation process with clarity and ease.\n\nStep: Select a Website Template Copy \"Choose a template to start building your website. Pick one that best fits your vision.\"\nPrimary Button: \"Select Template\"\nSecondary Button: \"Preview Template\"",
  },
  {
    id: "10",
    type: "simple",
    title: "Guide to Creating a Website",
    date: "THU, 4 MAY 23",
    description:
      "These steps and button labels are crafted to be intuitive and user-friendly, guiding the user through the website creation process with clarity and ease.\n\nStep: Select a Website Template Copy \"Choose a template to start building your website. Pick one that best fits your vision.\"",
  },
];

export default function TabletViewComponent({
  cards = DUMMY_DATA,
  onCardClick,
}: TabletViewComponentProps) {
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
      rounded-[48px] border-2 transition-all duration-300
      ${
        isDarkMode
          ? "border-[#F0F3F6] bg-[#353535] shadow-[0_4px_16px_0_rgba(255,255,255,0.10),0_2px_4px_0_rgba(255,255,255,0.10)]"
          : "border-[#F0F3F6] bg-[#FBFCFE] shadow-[0_4px_16px_0_rgba(0,0,0,0.10),0_2px_4px_0_rgba(0,0,0,0.10)]"
      }
      hover:shadow-[0_8px_24px_0_rgba(0,0,0,0.15),0_4px_8px_0_rgba(0,0,0,0.15)]
      hover:scale-[1.02]
      cursor-pointer
    `;

    switch (card.type) {
      case "date":
        return (
          <div
            key={card.id}
            className={`${baseCardClasses} relative w-[283px] h-[141px] overflow-hidden`}
            onClick={() => onCardClick?.(card.id)}
          >
            <div className="absolute left-[-16px] top-8 w-[316px] h-[85px]">
              <div
                className="absolute left-[-4px] top-[-61px] w-[316px] h-[207px] text-center font-[Nunito] text-[152px] font-black tracking-[-1.52px]"
                style={{
                  background: isDarkMode
                    ? "linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 56.76%)"
                    : "linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.00) 56.76%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                23
              </div>
              <div
                className="absolute left-0 top-[-27px] w-[320px] h-[130px]"
                style={{
                  background: isDarkMode
                    ? "linear-gradient(180deg, #353535 0%, rgba(53, 53, 53, 0.00) 86.54%)"
                    : "linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 86.54%)",
                }}
              />
            </div>
            <div className="absolute left-[-16px] top-[34px] flex w-[316px] h-[85px] flex-col justify-center items-center gap-2">
              <div
                className={`w-[316px] text-center font-[Nunito] text-[62px] font-extrabold tracking-[-0.62px] ${
                  isDarkMode ? "text-white" : "text-[#353535]"
                }`}
              >
                {card.date}
              </div>
            </div>
          </div>
        );

      case "emojis":
        return (
          <div
            key={card.id}
            className={`${baseCardClasses} inline-flex h-[141px] w-[252px] px-10 py-6 flex-col items-start gap-4`}
            onClick={() => onCardClick?.(card.id)}
          >
            <div className="flex w-[172px] h-[86px] justify-between items-center flex-shrink-0">
              {card.emojis?.map((emoji, idx) => (
                <div
                  key={idx}
                  className={`text-center font-[Nunito] text-[80px] font-bold tracking-[-0.8px] ${
                    isDarkMode ? "text-white" : "text-[#353535]"
                  }`}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        );

      case "header":
        return (
          <div
            key={card.id}
            className={`${baseCardClasses} flex w-[646px] h-[141px] px-[30px] py-6 flex-col justify-center items-start gap-4 rounded-[38px]`}
            onClick={() => onCardClick?.(card.id)}
          >
            <div className="flex h-[35px] flex-col justify-center items-center gap-2 flex-shrink-0 self-stretch">
              <div className="self-stretch text-center font-[Nunito] text-[62px] font-bold tracking-[-0.62px]">
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

      case "detailed":
        return (
          <div
            key={card.id}
            className={`${baseCardClasses} inline-flex h-[574px] w-[380px] p-8 pb-6 flex-col items-start gap-4`}
            onClick={() => onCardClick?.(card.id)}
          >
            <div className="flex w-[320px] items-start gap-2 relative overflow-hidden">
              {card.categories?.slice(0, 3).map((cat, idx) => (
                <div
                  key={idx}
                  className={`flex px-4 py-2 justify-center items-center gap-1 rounded-[40px] ${getCategoryColor(
                    cat.variant
                  )} transition-transform hover:scale-105`}
                >
                  <div className="text-white font-[Nunito] text-[21px] font-bold tracking-[-0.21px]">
                    {cat.label}
                  </div>
                </div>
              ))}
              <div
                className="absolute right-0 w-[22px] h-[31px]"
                style={{
                  background: isDarkMode
                    ? "linear-gradient(270deg, #353535 0.11%, rgba(53, 53, 53, 0.00) 99.89%)"
                    : "linear-gradient(270deg, #FFF 0.11%, rgba(255, 255, 255, 0.00) 99.89%)",
                }}
              />
            </div>

            <div className="flex flex-col items-start gap-2 flex-1 self-stretch">
              <div
                className={`w-[316px] font-[Nunito] text-[32px] font-bold tracking-[-0.32px] ${
                  isDarkMode ? "text-white" : "text-[#353535]"
                }`}
              >
                {card.title}
              </div>
              <div className="flex flex-col items-start flex-1 self-stretch relative">
                <div
                  className={`w-[316px] flex-1 font-[Nunito] text-base font-normal tracking-[-0.16px] ${
                    isDarkMode ? "text-[#C1C1CD]" : "text-[#A1A1B3]"
                  } line-clamp-[10] overflow-hidden`}
                >
                  {card.description}
                </div>
                <div
                  className="h-[177px] self-stretch absolute bottom-0"
                  style={{
                    background: isDarkMode
                      ? "linear-gradient(180deg, rgba(53, 53, 53, 0.00) 0%, #353535 100.74%)"
                      : "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 100.74%)",
                  }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center self-stretch">
              <div
                className={`font-[Nunito] text-[22px] font-bold tracking-[-0.22px] ${
                  isDarkMode ? "text-[#C1C1CD]" : "text-[#A1A1B3]"
                }`}
              >
                {card.date}
              </div>
              <MoreHorizontal
                className={`w-[29px] h-[29px] transition-colors hover:opacity-70 ${
                  isDarkMode ? "stroke-[#C1C1CD]" : "stroke-[#A1A1B3]"
                }`}
                strokeWidth={1.6}
              />
            </div>
          </div>
        );

      case "locked":
        return (
          <div
            key={card.id}
            className={`${baseCardClasses} inline-flex h-[562px] w-[380px] p-8 pb-6 flex-col items-start gap-4`}
            onClick={() => onCardClick?.(card.id)}
          >
            <div className="flex w-[320px] items-start gap-2 relative overflow-hidden">
              {card.categories?.slice(0, 3).map((cat, idx) => (
                <div
                  key={idx}
                  className={`flex px-4 py-2 justify-center items-center gap-1 rounded-[40px] ${getCategoryColor(
                    cat.variant
                  )} transition-transform hover:scale-105`}
                >
                  <div className="text-white font-[Nunito] text-[21px] font-bold tracking-[-0.21px]">
                    {cat.label}
                  </div>
                </div>
              ))}
              <div
                className="absolute right-0 w-[22px] h-[31px]"
                style={{
                  background: isDarkMode
                    ? "linear-gradient(270deg, #353535 0.11%, rgba(53, 53, 53, 0.00) 99.89%)"
                    : "linear-gradient(270deg, #FFF 0.11%, rgba(255, 255, 255, 0.00) 99.89%)",
                }}
              />
            </div>

            <div className="flex flex-col items-start gap-2 flex-1 self-stretch">
              <div
                className={`w-[316px] font-[Nunito] text-[32px] font-bold tracking-[-0.32px] ${
                  isDarkMode ? "text-white" : "text-[#353535]"
                }`}
              >
                {card.title}
              </div>
              <div className="flex flex-col items-start flex-1 self-stretch relative">
                <div
                  className={`w-[316px] flex-1 font-[Nunito] text-base font-normal tracking-[-0.16px] ${
                    isDarkMode ? "text-[#C1C1CD]" : "text-[#A1A1B3]"
                  } blur-[2px]`}
                >
                  {card.description}
                </div>
                <div
                  className="h-[177px] self-stretch absolute bottom-0"
                  style={{
                    background: isDarkMode
                      ? "linear-gradient(180deg, rgba(53, 53, 53, 0.00) 0%, #353535 100%)"
                      : "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 100%)",
                  }}
                />
                <Lock
                  className="absolute left-[122px] top-[103px] w-[72.6px] h-[90.75px] fill-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.10)] drop-shadow-[0_6px_12px_rgba(0,0,0,0.10)]"
                  strokeWidth={0}
                />
              </div>
            </div>

            <div className="flex justify-between items-center self-stretch">
              <div
                className={`font-[Nunito] text-[22px] font-bold tracking-[-0.22px] ${
                  isDarkMode ? "text-[#C1C1CD]" : "text-[#A1A1B3]"
                }`}
              >
                {card.date}
              </div>
              <MoreHorizontal
                className={`w-[29px] h-[29px] transition-colors hover:opacity-70 ${
                  isDarkMode ? "stroke-[#C1C1CD]" : "stroke-[#A1A1B3]"
                }`}
                strokeWidth={1.6}
              />
            </div>
          </div>
        );

      case "images":
        return (
          <div
            key={card.id}
            className={`${baseCardClasses} inline-flex px-6 pt-6 pb-0 pl-12 flex-col items-end gap-[26px] w-[416px] h-[703px]`}
            onClick={() => onCardClick?.(card.id)}
          >
            <Heart
              className={`w-[39px] h-[39px] transition-all hover:scale-110 ${
                card.isFavorite ? "fill-red-500 stroke-red-500" : "fill-[#9797AA] stroke-none"
              }`}
            />
            <div className="flex pr-6 flex-col items-center gap-2 self-stretch">
              <div className="w-[320px] h-[614px] relative">
                {card.images?.[2] && (
                  <div
                    className="absolute left-[35px] top-[267px] w-[252px] h-[347px] rounded-lg bg-cover bg-center shadow-[0_0_0_0.5px_rgba(0,0,0,0.10)_inset]"
                    style={{ backgroundImage: `url(${card.images[2]})` }}
                  />
                )}
                {card.images?.[1] && (
                  <div
                    className="absolute left-5 top-[129px] w-[281px] h-[347px] rounded-lg bg-cover bg-center shadow-[0_0_0_0.5px_rgba(0,0,0,0.10)_inset]"
                    style={{ backgroundImage: `url(${card.images[1]})` }}
                  />
                )}
                {card.images?.[0] && (
                  <div
                    className="absolute left-0 top-0 w-[320px] h-[347px] rounded-lg bg-cover bg-center shadow-[0_0_0_0.5px_rgba(0,0,0,0.10)_inset]"
                    style={{ backgroundImage: `url(${card.images[0]})` }}
                  />
                )}
              </div>
            </div>
          </div>
        );

      case "simple":
      default:
        return (
          <div
            key={card.id}
            className={`${baseCardClasses} ${
              card.description ? "h-[378px]" : "h-[174px]"
            } w-[376px] p-8 pb-6 flex flex-col items-start gap-4`}
            onClick={() => onCardClick?.(card.id)}
          >
            <div className="flex flex-col items-start gap-2 flex-1 self-stretch">
              <div
                className={`w-[316px] font-[Nunito] text-[32px] font-bold tracking-[-0.32px] ${
                  isDarkMode ? "text-white" : "text-[#353535]"
                }`}
              >
                {card.title}
              </div>
              <div className="flex flex-col items-start self-stretch relative">
                {card.subtitle && (
                  <div
                    className={`w-[316px] font-[Nunito] text-base font-normal tracking-[-0.16px] ${
                      isDarkMode ? "text-[#C1C1CD]" : "text-[#A1A1B3]"
                    }`}
                  >
                    {card.subtitle}
                  </div>
                )}
                {card.description && (
                  <>
                    <div
                      className={`w-[316px] flex-1 font-[Nunito] text-base font-normal tracking-[-0.16px] ${
                        isDarkMode ? "text-[#C1C1CD]" : "text-[#A1A1B3]"
                      } line-clamp-6`}
                    >
                      {card.description}
                    </div>
                    <div
                      className="h-[177px] self-stretch absolute bottom-0"
                      style={{
                        background: isDarkMode
                          ? "linear-gradient(180deg, rgba(53, 53, 53, 0.00) 0%, #353535 115.82%)"
                          : "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 115.82%)",
                      }}
                    />
                  </>
                )}
                {!card.subtitle && !card.description && (
                  <div
                    className="h-[177px] self-stretch"
                    style={{
                      background: isDarkMode
                        ? "linear-gradient(180deg, #353535 0%, #353535 115.82%)"
                        : "linear-gradient(180deg, #FFF 0%, #FFF 115.82%)",
                    }}
                  />
                )}
              </div>
            </div>

            {card.date && (
              <div className="flex justify-between items-center self-stretch">
                <div
                  className={`font-[Nunito] text-[22px] font-bold tracking-[-0.22px] ${
                    isDarkMode ? "text-[#C1C1CD]" : "text-[#A1A1B3]"
                  }`}
                >
                  {card.date}
                </div>
                <MoreHorizontal
                  className={`w-[29px] h-[29px] transition-colors hover:opacity-70 ${
                    isDarkMode ? "stroke-[#C1C1CD]" : "stroke-[#A1A1B3]"
                  }`}
                  strokeWidth={1.6}
                />
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div
      className={`min-h-screen p-10 transition-colors duration-300 ${
        isDarkMode ? "bg-[#2B2B2B]" : "bg-[#F5F5F7]"
      }`}
    >
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1
            className={`text-4xl font-bold ${isDarkMode ? "text-white" : "text-[#353535]"}`}
          >
            Tablet View
          </h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              isDarkMode
                ? "bg-white text-[#353535] hover:bg-gray-200"
                : "bg-[#353535] text-white hover:bg-[#4A4A4A]"
            }`}
          >
            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,max-content))] gap-6 justify-start">
          {cards.map((card) => renderCard(card))}
        </div>
      </div>
    </div>
  );
}
