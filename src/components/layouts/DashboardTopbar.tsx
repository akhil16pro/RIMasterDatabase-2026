import { useTranslation } from "react-i18next";
import { Clock, ChevronDown } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { SectionTitle } from "@/components/ui/sectionTitle";

export default function DashboardTopbar({
  delay,
  title,
}: {
  delay: number;
  title: string;
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
      <div className="flex gap-2 order-1 md:order-2 justify-end ">
        <LastLoginInfo />
        <LoginAvatar />
      </div>
    </motion.div>
  );
}

function LastLoginInfo() {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2  p-[1px] rounded-lg bg-[linear-gradient(195deg,rgba(2,46,228,0.4)_0%,rgba(255,201,157,0.4)_100%)] ">
      <div className="flex lg:gap-3 gap-2 items-center px-2 lg:px-4 py-2 lg:py-2 rounded-lg bg-white">
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <linearGradient
            id="LastLoginLine"
            x1="34.5"
            y1="3"
            x2="-5"
            y2="23.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#022EE4" />
            <stop offset="1" stopColor="#FFC99D" />
          </linearGradient>
        </svg>
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
  return (
    <div className="flex  items-center lg:p-2 p-[5px]  rounded-lg bg-[linear-gradient(195deg,rgba(2,46,228,0.4)_0%,rgba(255,201,157,0.4)_100%)] cursor-pointer group ">
      <img
        src="/avImg.jpg"
        alt=""
        className="w-8 h-8 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-[5px] md:rounded-lg me-2 group-hover:scale-105 transition-all duration-300"
      />
      <span className="text-[var(--textColor)] font-semibold md:text-[1.2rem] text-[1rem] leading-[100%] max-w-[7rem] overflow-hidden text-ellipsis whitespace-nowrap">
        Ahmed Sharif Chaudhry
      </span>
      <ChevronDown
        // size={24}
        className="size-[18px] md:size-[20px] lg:size-[24px] text-[var(--textColor)]"
      />
    </div>
  );
}
