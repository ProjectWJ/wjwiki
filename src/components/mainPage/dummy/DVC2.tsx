"use client";

import { Heart, MoreHorizontal, Lock } from "lucide-react";

interface CategoryPill {
  label: string;
  variant: "work" | "personal" | "general";
}

interface CardData {
  id: string;
  type: "date" | "emojis" | "simple" | "locked" | "images" | "text" | "button";
  title?: string;
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
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400",
      "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=400",
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400",
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

export function DesktopViewComponent2({
  cards = DUMMY_DATA,
  onCardClick,
}: DesktopViewComponentProps) {
  const getCategoryColor = (variant: CategoryPill["variant"]) => {
    switch (variant) {
      case "work":
        return "bg-[#26A69A]";
      case "personal":
        return "bg-[#134F71]";
      case "general":
        return "bg-[#E53935]";
      default:
        return "bg-[#A1A1B3]";
    }
  };

  const renderSimpleCard = (card: CardData) => (
    <div
      onClick={() => onCardClick?.(card.id)}
      className="inline-flex flex-col items-start gap-3 rounded-[34px] border border-[#F0F3F6] bg-[#FBFCFE] p-6 pb-4 shadow-[0_2.8px_11.3px_0_rgba(0,0,0,0.10),0_1.4px_2.8px_0_rgba(0,0,0,0.10)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.15),0_2px_4px_0_rgba(0,0,0,0.15)] cursor-pointer w-full max-w-[340px] h-[240px]"
    >
      <div className="flex flex-1 flex-col items-start gap-1.5 self-stretch">
        <div className="w-full font-[Nunito] text-[23px] font-bold leading-normal tracking-[-0.225px] text-[#353535]">
          {card.title}
        </div>
        <div className="relative flex flex-1 flex-col items-start self-stretch overflow-hidden">
          <div className="w-full flex-1 overflow-hidden font-[Nunito] text-[11px] font-normal leading-tight tracking-[-0.113px] text-[#A1A1B3]">
            {card.description}
          </div>
          <div
            className="pointer-events-none h-[125px] self-stretch"
            style={{
              background: "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FBFCFE 115.82%)",
            }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between self-stretch">
        <div className="font-[Nunito] text-[15px] font-bold tracking-[-0.155px] text-[#A1A1B3]">
          {card.date}
        </div>
        <MoreHorizontal
          className="h-5 w-5 stroke-[#A1A1B3] transition-opacity hover:opacity-70"
          strokeWidth={1.13}
        />
      </div>
    </div>
  );

  const renderImagesCard = (card: CardData) => (
    <div
      onClick={() => onCardClick?.(card.id)}
      className="inline-flex flex-col items-end gap-3 rounded-[25px] border border-[#F0F3F6] bg-[#FBFCFE] px-3 pb-0 pl-6 pt-3 shadow-[0_2px_8px_0_rgba(0,0,0,0.10),0_1px_2px_0_rgba(0,0,0,0.10)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.15),0_2px_4px_0_rgba(0,0,0,0.15)] cursor-pointer w-full max-w-[300px] h-[370px]"
    >
      <Heart
        className={`h-5 w-5 flex-shrink-0 transition-all hover:scale-110 ${
          card.isFavorite ? "fill-red-500 stroke-red-500" : "fill-[#9797AA] stroke-none"
        }`}
      />
      <div className="flex flex-col items-center gap-1 self-stretch pr-3">
        <div className="relative h-[315px] w-[164px]">
          {card.images?.[2] && (
            <div
              className="h-[178px] w-[129px] rounded-[4px] bg-cover bg-center shadow-[0_0_0_0.3px_rgba(0,0,0,0.10)_inset]"
              style={{
                backgroundImage: `url(${card.images[2]})`,
                transform: "translate(18px, 137px)",
              }}
            />
          )}
          {card.images?.[1] && (
            <div
              className="absolute left-[10px] top-[66px] h-[178px] w-[144px] rounded-[4px] bg-cover bg-center shadow-[0_0_0_0.3px_rgba(0,0,0,0.10)_inset]"
              style={{ backgroundImage: `url(${card.images[1]})` }}
            />
          )}
          {card.images?.[0] && (
            <div
              className="absolute left-0 top-0 h-[178px] w-[164px] rounded-[4px] bg-cover bg-center shadow-[0_0_0_0.3px_rgba(0,0,0,0.10)_inset]"
              style={{ backgroundImage: `url(${card.images[0]})` }}
            />
          )}
        </div>
      </div>
    </div>
  );

  const renderTextCard = (card: CardData) => (
    <div
      onClick={() => onCardClick?.(card.id)}
      className="flex flex-col items-center justify-center gap-1 rounded-[14px] border border-[#F0F3F6] bg-[#FBFCFE] px-5 py-4 shadow-[0_2.7px_10.8px_0_rgba(0,0,0,0.10),0_1.35px_2.7px_0_rgba(0,0,0,0.10)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.15),0_2px_4px_0_rgba(0,0,0,0.15)] cursor-pointer w-full max-w-[220px] h-[68px]"
    >
      <div className="flex flex-col items-center justify-center self-stretch">
        <div className="w-full text-center font-[Nunito] text-[29px] font-bold leading-none tracking-[-0.29px]">
          <span className="text-[#353535]">Today in </span>
          <span className="text-[#A1A1B3]">Design</span>
        </div>
      </div>
    </div>
  );

  const renderButtonCard = (card: CardData) => (
    <div
      onClick={() => onCardClick?.(card.id)}
      className="flex h-[68px] w-[68px] cursor-pointer items-center justify-center rounded-[14px] bg-[#129CEC] transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_16px_0_rgba(18,156,236,0.4)]"
    />
  );

  const renderEmojisCard = (card: CardData) => (
    <div
      onClick={() => onCardClick?.(card.id)}
      className="inline-flex flex-col items-center justify-center gap-2 rounded-[16px] border border-[#F0F3F6] bg-[#FBFCFE] px-5 py-3 shadow-[0_2px_8px_0_rgba(0,0,0,0.10),0_1px_2px_0_rgba(0,0,0,0.10)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.15),0_2px_4px_0_rgba(0,0,0,0.15)] cursor-pointer w-full max-w-[140px] h-[80px]"
    >
      <div className="flex h-[42px] w-full flex-shrink-0 items-center justify-between">
        {card.emojis?.map((emoji, idx) => (
          <div
            key={idx}
            className="text-center font-[Nunito] text-[39px] font-bold tracking-[-0.394px] text-[#353535]"
          >
            {emoji}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDateCard = (card: CardData) => (
    <div
      onClick={() => onCardClick?.(card.id)}
      className="relative overflow-hidden rounded-[16px] border border-[#F0F3F6] bg-[#FBFCFE] shadow-[0_2.15px_8.6px_0_rgba(0,0,0,0.10),0_1.07px_2.15px_0_rgba(0,0,0,0.10)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.15),0_2px_4px_0_rgba(0,0,0,0.15)] cursor-pointer w-full max-w-[170px] h-[80px]"
    >
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div
          className="pointer-events-none text-center font-[Nunito] text-[82px] font-black tracking-[-0.816px] opacity-20"
          style={{
            background: "linear-gradient(180deg, #353535 0%, rgba(53, 53, 53, 0.00) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          23
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center font-[Nunito] text-[33px] font-extrabold tracking-[-0.333px] text-[#353535]">
            {card.date}
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[50%]"
        style={{
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FBFCFE 66.13%)",
        }}
      />
    </div>
  );

  const renderLockedCard = (card: CardData) => (
    <div
      onClick={() => onCardClick?.(card.id)}
      className="inline-flex flex-col items-start gap-3 rounded-[24px] border border-[#F0F3F6] bg-[#FBFCFE] p-6 pb-4 shadow-[0_2.8px_11.3px_0_rgba(0,0,0,0.10),0_1.4px_2.8px_0_rgba(0,0,0,0.10)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.15),0_2px_4px_0_rgba(0,0,0,0.15)] cursor-pointer w-full max-w-[320px] h-[480px]"
    >
      <div className="relative flex w-full items-start gap-1.5 overflow-hidden">
        <div className="flex flex-wrap items-start gap-1.5">
          {card.categories?.slice(0, 3).map((cat, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-center gap-1 rounded-[28px] px-3 py-1.5 transition-transform hover:scale-105 ${getCategoryColor(
                cat.variant
              )}`}
            >
              <div className="font-[Nunito] text-[15px] font-bold tracking-[-0.148px] text-white">
                {cat.label}
              </div>
            </div>
          ))}
        </div>
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-full w-4"
          style={{
            background:
              "linear-gradient(270deg, #FBFCFE 0.11%, rgba(251, 252, 254, 0.00) 99.89%)",
          }}
        />
      </div>

      <div className="relative flex flex-1 flex-col items-start gap-1.5 self-stretch">
        <div className="w-full font-[Nunito] text-[23px] font-bold tracking-[-0.226px] text-[#353535]">
          {card.title}
        </div>
        <div className="relative flex flex-1 flex-col items-start self-stretch overflow-hidden">
          <div className="w-full flex-1 font-[Nunito] text-[11px] font-normal tracking-[-0.113px] text-[#A1A1B3] blur-[1.4px]">
            {card.description}
          </div>
          <div
            className="pointer-events-none h-[125px] self-stretch"
            style={{
              background: "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FBFCFE 100%)",
            }}
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Lock
              className="h-16 w-16 fill-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.10)] drop-shadow-[0_6px_12px_rgba(0,0,0,0.10)]"
              strokeWidth={0}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between self-stretch">
        <div className="font-[Nunito] text-[16px] font-bold tracking-[-0.155px] text-[#A1A1B3]">
          {card.date}
        </div>
        <MoreHorizontal
          className="h-5 w-5 stroke-[#A1A1B3] transition-opacity hover:opacity-70"
          strokeWidth={1.13}
        />
      </div>
    </div>
  );

  const renderCard = (card: CardData) => {
    switch (card.type) {
      case "simple":
        return renderSimpleCard(card);
      case "images":
        return renderImagesCard(card);
      case "text":
        return renderTextCard(card);
      case "button":
        return renderButtonCard(card);
      case "emojis":
        return renderEmojisCard(card);
      case "date":
        return renderDateCard(card);
      case "locked":
        return renderLockedCard(card);
      default:
        return null;
    }
  };

  const simpleCard = cards.find((c) => c.type === "simple");
  const imagesCard = cards.find((c) => c.type === "images");
  const textCard = cards.find((c) => c.type === "text");
  const buttonCard = cards.find((c) => c.type === "button");
  const emojisCard = cards.find((c) => c.type === "emojis");
  const dateCard = cards.find((c) => c.type === "date");
  const lockedCard = cards.find((c) => c.type === "locked");

  return (
    <div className="w-full min-h-screen bg-white font-[Nunito] p-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex flex-col items-start gap-2">
              <h1 className="w-full font-[Nunito] text-[85px] font-extrabold leading-[86px] tracking-[-3.4px] text-[#353535]">
                Apple
                <br />
                Style
                <br />
                Design Cards
              </h1>
              <p className="font-[Nunito] text-[26px] font-medium text-[#6C6C85]">
                Dark and Light mode included
              </p>
            </div>
            {simpleCard && <div className="w-full">{renderCard(simpleCard)}</div>}
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-5 items-start">
            <div className="col-span-2 grid grid-cols-3 gap-5">
              {emojisCard && <div className="flex justify-center">{renderCard(emojisCard)}</div>}
              {dateCard && <div className="flex justify-center">{renderCard(dateCard)}</div>}
              <div className="col-span-1" />
            </div>

            <div className="col-span-1 flex justify-center">
              {imagesCard && renderCard(imagesCard)}
            </div>

            <div className="col-span-1 flex flex-col gap-5">
              {lockedCard && renderCard(lockedCard)}
            </div>

            <div className="col-span-2 grid grid-cols-2 gap-5">
              {textCard && <div className="flex items-center">{renderCard(textCard)}</div>}
              {buttonCard && <div className="flex items-center">{renderCard(buttonCard)}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
