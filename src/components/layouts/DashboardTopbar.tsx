import {
  Clock,
  ChevronDown,
  ClockFading,
  User,
  LogOut,
  Languages,
} from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { SectionTitle } from "@/components/ui/sectionTitle";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useLocation, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
export default function DashboardTopbar({
  delay,
  title,
  lastLogin,
  timeCounter,
}: {
  delay: number;
  title: string;
  lastLogin?: boolean;
  timeCounter?: boolean;
}) {
  return (
    <motion.div
      className="topBar flex md:flex-row flex-col gap-2 md:items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: delay, duration: 0.5, ease: "easeInOut" }}
    >
      <div className="flex flex-1  order-2 md:order-1">
        <SectionTitle gradient={true}>
          <span>{title}</span>
        </SectionTitle>
      </div>
      <div className="flex md:gap-2 gap-1 order-1 md:order-2 justify-end flex-wrap ">
        {lastLogin && <LastLoginInfo />}
        {timeCounter && <TimeLeftInfo />}
        <LoginAvatar />
      </div>
    </motion.div>
  );
}

function TimeLeftInfo() {
  const { t } = useTranslation();

  const targetDate = new Date("2026-03-25T13:56:21+04:00");

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({
          days: days.toString().padStart(2, "0"),
          hours: hours.toString().padStart(2, "0"),
          minutes: minutes.toString().padStart(2, "0"),
          seconds: seconds.toString().padStart(2, "0"),
        });
      } else {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
      }
    };

    calculateTimeLeft();

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate.getTime()]);

  return (
    <div className="flex p-[1px] rounded-lg bg-[var(--brandRed)]/30  w-full md:w-auto ">
      <div className="flex gap-2 items-center px-2 lg:px-4 py-2 lg:py-2 rounded-lg  bg-[var(--brandRed)]">
        <ClockFading
          // size={34}
          className={`iconBox size-[22px] md:size-[25px] lg:size-[30px]  relative z-12 transition-all duration-400 `}
        />
        <div className="text-[.7rem] md:text-[.85rem] font-medium leading-[100%] uppercase flex flex-col">
          <span> {t("time")}</span>
          <span> {t("left")}</span>
        </div>
      </div>

      <div className="flex-1 flex items-center gap-1 lg:gap-2 lg:px-5 px-3 justify-between">
        <div className="flex flex-col text-center gap-[2px] w-[2rem]">
          <span className="text-[1.6rem] lg:text-[1.9rem] leading-[80%] font-medium text-[var(--textColor)]">
            {timeLeft.days}
          </span>
          <span className="text-[var(--brandRed)] text-[.7rem] md:text-[.85rem] font-medium leading-[90%] uppercase">
            {t("days")}
          </span>
        </div>
        <span className="text-[1.5rem] leading-[100%] font-bold text-[var(--textColor)]">
          :
        </span>
        <div className="flex flex-col text-center gap-[2px] w-[2rem]">
          <span className="text-[1.6rem] lg:text-[1.9rem] leading-[80%] font-medium text-[var(--textColor)]">
            {timeLeft.hours}
          </span>
          <span className="text-[var(--brandRed)] text-[.7rem] md:text-[.85rem] font-medium leading-[90%] uppercase">
            {t("hours")}
          </span>
        </div>
        <span className="text-[1.5rem] leading-[100%] font-bold text-[var(--textColor)]">
          :
        </span>
        <div className="flex flex-col text-center gap-[2px] w-[2rem]">
          <span className="text-[1.6rem] lg:text-[1.9rem] leading-[80%] font-medium text-[var(--textColor)]">
            {timeLeft.minutes}
          </span>
          <span className="text-[var(--brandRed)] text-[.7rem] md:text-[.85rem] font-medium leading-[90%] uppercase">
            {t("mins")}
          </span>
        </div>
        <span className="text-[1.5rem] leading-[100%] font-bold text-[var(--textColor)]  ">
          :
        </span>
        <div className="flex flex-col text-center gap-[2px] w-[2rem]  ">
          <span className="text-[1.6rem] lg:text-[1.9rem] leading-[80%] font-medium text-[var(--textColor)]">
            {timeLeft.seconds}
          </span>
          <span className="text-[var(--brandRed)] text-[.7rem] md:text-[.85rem] font-medium leading-[90%] uppercase">
            {t("secs")}
          </span>
        </div>
      </div>
    </div>
  );
}

function LastLoginInfo() {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2  p-[1px] rounded-lg bg-[linear-gradient(195deg,rgba(2,46,228,0.4)_0%,rgba(255,201,157,0.4)_100%)] ">
      <div className="flex lg:gap-3 gap-2 items-center px-2 lg:px-4 py-2 lg:py-2 rounded-lg bg-white">
        <Clock
          // size={34}
          className={`iconBox size-[20px] md:size-[27px] lg:size-[34px] relative z-12 transition-all duration-400 stroke-[url(#LastLoginLine)] transition-stroke duration-300`}
        />
        <div className="flex flex-col flex-1 align-center justify-center">
          <span className="text-[.7rem] md:text-[.85rem] font-semibold text-[var(--textColor)] leading-[100%]">
            {t("last-login")}
          </span>
          <span className="text-[.9rem] md:text-[1.1rem] font-semibold text-[var(--textColor)] leading-[100%]">
            3 Days ago
          </span>
        </div>
      </div>
    </div>
  );
}

function LoginAvatar() {
  const { t, i18n } = useTranslation();
  const { href } = useLocation();
  const router = useRouter();
  const currentLang = i18n.language;
  const isRtl = currentLang === "ar";

  const handleLanguageChange = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";

    i18n.changeLanguage(newLang);

    const pathSegments = href.split("/").filter(Boolean);
    pathSegments[0] = newLang;

    const newUrl = `/${pathSegments.join("/")}`;

    router.navigate({ to: newUrl });
  };

  return (
    <DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <div className="flex  items-center lg:p-2 p-[5px]  rounded-lg bg-[linear-gradient(195deg,rgba(2,46,228,0.4)_0%,rgba(255,201,157,0.4)_100%)] cursor-pointer group ">
          <img
            src="/avImg.jpg"
            alt=""
            className="w-8 h-8 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-[5px] md:rounded-lg me-2 group-hover:scale-105 transition-all duration-300"
          />
          <span className="text-[var(--textColor)] font-semibold md:text-[1.2rem] text-[1rem] leading-[100%] max-w-[7rem] overflow-hidden text-ellipsis whitespace-nowrap">
            {t("avname")}
          </span>
          <ChevronDown
            // size={24}
            className="size-[18px] md:size-[20px] lg:size-[24px] text-[var(--textColor)]"
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[11.5rem] md:w-[12.1rem] lg:w-[12.7rem] bg-[linear-gradient(195deg,rgba(2,46,228,0.4)_0%,rgba(255,201,157,0.4)_100%)] rounded-[8px]  lg:rounded-lg border-none"
        align="end"
      >
        <DropdownMenuLabel className="text-[var(--textColor)] font-semibold md:text-[1.2rem] text-[1rem] leading-[100%]  overflow-hidden text-ellipsis whitespace-nowrap md:opacity-50 opacity-60">
          {t("settings")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/30" />
        <DropdownMenuItem className="w-full text-[var(--textColor)] font-semibold md:text-[1rem] text-[.9rem] leading-[100%]  overflow-hidden text-ellipsis whitespace-nowrap hover:text-[var(--textColor)] flex gap-2">
          <User className=" h-4 w-4" />
          <span>{t("profile")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="w-full text-[var(--textColor)] font-semibold md:text-[1rem] text-[.9rem] leading-[100%]  overflow-hidden text-ellipsis whitespace-nowrap hover:text-[var(--textColor)] flex gap-2"
          onClick={handleLanguageChange}
        >
          <Languages className=" h-4 w-4" />
          <span>{t("switch_language")}</span>
        </DropdownMenuItem>

        {/* <DropdownMenuSeparator className="bg-white/30" /> */}
        <DropdownMenuItem
          color="red"
          className="w-full text-[var(--textColor)] font-semibold md:text-[1rem] text-[.9rem] leading-[100%]  overflow-hidden text-ellipsis whitespace-nowrap flex gap-2"
        >
          <LogOut className=" h-4 w-4" />
          <span>{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
