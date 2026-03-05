import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Clock, ChevronDown } from "lucide-react";
import { useScroll, useMotionValueEvent, motion } from "motion/react";
import { useState, useMemo } from "react";
import { useAtom, useAtomValue } from "jotai";
import { scrollDirectionAtom } from "@/store/atoms";
import { apiClient } from "@/api";
import { useQueryClient } from "@tanstack/react-query";
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
      className="topBar flex items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: delay, duration: 0.5, ease: "easeInOut" }}
    >
      <div className="flex flex-1 self-end">
        <SectionTitle gradient={true}>
          <span>{title}</span>
        </SectionTitle>
      </div>
      <div className="flex gap-2 ">
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
      <div className="flex  gap-3 items-center px-4 py-2 rounded-lg bg-white">
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
          size={34}
          className={`iconBox relative z-12 transition-all duration-400 stroke-[url(#LastLoginLine)] transition-stroke duration-300`}
        />
        <div className="flex flex-col flex-1 align-center justify-center">
          <span className="text-[.85rem] font-semibold text-[var(--textColor)] leading-[100%]">
            {t("last-login")}
          </span>
          <span className="text-[1.1rem] font-semibold text-[var(--textColor)] leading-[100%]">
            3 Days ago
          </span>
        </div>
      </div>
    </div>
  );
}

function LoginAvatar() {
  return (
    <div className="flex  items-center p-2  rounded-lg bg-[linear-gradient(195deg,rgba(2,46,228,0.4)_0%,rgba(255,201,157,0.4)_100%)] cursor-pointer group ">
      <img
        src="/avImg.jpg"
        alt=""
        className="w-11 h-11 rounded-lg me-2 group-hover:scale-105 transition-all duration-300"
      />
      <span className="text-[var(--textColor)] font-semibold text-[1.2rem] leading-[100%] max-w-[7rem] overflow-hidden text-ellipsis whitespace-nowrap">
        Ahmed Sharif Chaudhry
      </span>
      <ChevronDown size={24} className="text-[var(--textColor)]" />
    </div>
  );
}
