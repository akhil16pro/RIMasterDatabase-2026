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

import clock from "@/assets/animations/clock.json";
import Lottie from "lottie-react";
import { useLocation, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useSetAtom } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { useAtomValue } from "jotai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouterState } from "@tanstack/react-router";

export default function DashboardTopbar({
  delay,
  title,
  lastLogin,
  campaign,
}: {
  delay: number;
  title: string;
  lastLogin?: boolean;
  campaign?: any;
}) {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  const campaignStartDate = new Date(campaign?.from_date);
  campaignStartDate.setHours(0, 0, 0, 0);
  const campaignEndDate = new Date(campaign?.to_date);
  campaignEndDate.setHours(23, 59, 59, 999);

  const isCampaignActive = campaignStartDate <= now && campaignEndDate >= now;

  const userSession = useAtomValue(userSessionAtom);

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
        {userSession?.user?.last_logged_in && !isCampaignActive && (
          <LastLoginInfo />
        )}
        {isCampaignActive && <CampaignInfo campaign={campaign} />}
        <LoginAvatar />
      </div>
    </motion.div>
  );
}

function CampaignInfo({ campaign }: { campaign: any }) {
  const { t } = useTranslation();

  const targetDate = new Date(campaign?.to_date);

  targetDate.setHours(23, 59, 59, 999);

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
      <div className="flex md:gap-1 items-center px-2 lg:px-4 py-2 lg:py-2 rounded-lg  bg-[var(--brandRed)] lg:ps-[.5rem] ps-[.25rem] text-white">
        {/* <ClockFading
          // size={34}
          className={`iconBox size-[22px] md:size-[25px] lg:size-[30px]  relative z-12 transition-all duration-400 `}
        /> */}

        <Lottie
          animationData={clock}
          loop={true}
          className="w-[32px] h-[32px] md:w-[34px] md:h-[34px] lg:w-[40px] lg:h-[40px] "
        />
        <div
          className="text-[.7rem] md:text-[.85rem] font-medium leading-[100%] uppercase flex flex-col"
          dangerouslySetInnerHTML={{
            __html: t("time_left"),
          }}
        />
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
  const userSession = useAtomValue(userSessionAtom);

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
          <span className="text-[.9rem] md:text-[1.1rem] font-semibold text-[var(--textColor)] leading-[110%]">
            {userSession?.user?.last_logged_in}
          </span>
        </div>
      </div>
    </div>
  );
}

function LoginAvatar() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { location } = useRouterState();
  const queryClient = useQueryClient();

  const userSession = useAtomValue(userSessionAtom);
  const setUserSession = useSetAtom(userSessionAtom);

  const { mutate: handleLogout, isPending: isLoggingOut } = useMutation({
    mutationFn: () => apiClient.get(`${i18n.language}/logout`).json(),
    onSettled: () => {
      setUserSession(null);
      localStorage.removeItem("auth-session");
      queryClient.clear();
      router.navigate({
        to: "/$lang/login",
        params: { lang: i18n.language },
      });
    },
  });

  const handleLanguageChange = async () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    await i18n.changeLanguage(newLang);

    const pathSegments = location.pathname.split("/").filter(Boolean);
    pathSegments[0] = newLang;
    const newUrl = `/${pathSegments.join("/")}`;

    router.navigate({ to: newUrl });
    queryClient.invalidateQueries({ queryKey: ["userInfo"] });
  };
  return (
    <DropdownMenu dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild className="group">
        <div className="flex  items-center lg:p-2 p-[5px]  rounded-lg bg-[linear-gradient(195deg,rgba(2,46,228,0.4)_0%,rgba(255,201,157,0.4)_100%)] cursor-pointer group ">
          {/* <img
            src={userSession?.user?.photo || userSession?.user?.avatar}
            alt=""
            className="w-8 h-8 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-[5px] md:rounded-lg me-2 group-hover:scale-105 transition-all duration-300 bg-white object-cover"
          /> */}
          <Avatar className="me-2 rounded-[5px] md:rounded-lg size-8 md:size-10 lg:size-11">
            <AvatarImage
              src={userSession?.user?.photo}
              alt={userSession?.user?.name}
              className=""
            />
            <AvatarFallback className="rounded-[5px]  ">
              {userSession?.user?.first_name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <span className="text-[var(--textColor)] font-semibold md:text-[1.2rem] text-[1rem] leading-[100%] max-w-[7rem] overflow-hidden text-ellipsis whitespace-nowrap [&:first-letter]:uppercase">
            {userSession?.user?.name}
          </span>
          <ChevronDown
            // size={24}
            className={cn(
              " size-[17px]  md:size-[20px] text-[var(--textColor)] ms-1",
              "group-data-[state=open]:rotate-180 transition-all duration-300",
            )}
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
          onClick={() => handleLogout()}
        >
          <LogOut className=" h-4 w-4" />
          <span>{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
