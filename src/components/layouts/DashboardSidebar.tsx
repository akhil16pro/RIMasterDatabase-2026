import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  CircleMinus,
  LayoutDashboard,
  BookText,
  ShieldCheck,
  CircleChevronRight,
  CircleChevronLeft,
  Castle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useMemo, useEffect } from "react";

import { apiClient } from "@/api";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { userSessionAtom, settingsAtom } from "@/store/atoms";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useMobile } from "@/hooks/use-mobile";
import { useAtomValue } from "jotai";
import { AnimatePresence } from "motion/react";
import { NAV_CONFIG } from "@/lib/navigation";

export default function DashboardSidebar({ delay }: { delay: number }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const isMobile = useMobile();
  const settings = useAtomValue(settingsAtom);
  const userSession = useAtomValue(userSessionAtom);

  const userRole = userSession?.user?.roles;

  const mainNavItems = useMemo(() => {
    if (!userRole) return [];

    return NAV_CONFIG.filter((item) => {
      return item.roles?.includes(userRole);
    }).map((item) => ({
      ...item,
      title: userRole === "admin" ? t(item.titleKey) : t(item.shortTitleKey),
      href: `/${currentLang}${item.href}`,
    }));
  }, [i18n.language, userRole, t]);

  const [isMenuOpen, setIsMenuOpen] = useState(() => {
    const savedState =
      typeof window !== "undefined"
        ? sessionStorage.getItem("isMenuOpen")
        : null;
    return savedState !== null ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    sessionStorage.setItem("isMenuOpen", JSON.stringify(isMenuOpen));
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMobile) {
      setIsMenuOpen(true);
    }
  }, []);

  return (
    <div className={cn("sideBar", isMenuOpen ? "open" : "")}>
      <div className="inner">
        <div className="topBox ">
          <div className="inline-flex items-center justify-start relative z-10 w-full  ">
            <Link
              to={"/" + i18n.language}
              className="inline-flex items-center md:gap-4 gap-2 outline-none border-none  overflow-clip w-full relative"
            >
              <img
                // initial={{ opacity: 0, scale: 0.5 }}
                // animate={{ opacity: 1, scale: 1 }}
                // exit={{ opacity: 0, scale: 0.5 }}
                // transition={{ duration: 0.25, ease: "easeInOut" }}
                src="/logoShape.svg"
                alt=""
                className=" object-contain lg:h-[5rem] md:h-[4rem] h-[3rem] w-auto"
              />

              <motion.div
                initial={false}
                animate={{
                  opacity: !isMenuOpen ? 1 : 0,
                  x: !isMenuOpen ? 0 : currentLang === "en" ? 20 : -20,
                }}
                exit={{
                  opacity: 0,
                  x: currentLang === "en" ? 20 : -20,
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeInOut",
                  delay: 0.1,
                }}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 inline-block font-bold    tracking-[0.03em] bg-clip-text text-transparent inset-x-[2.3rem] md:inset-x-[2.9rem] lg:inset-x-[3.8rem]",
                  "bg-[linear-gradient(90deg,#FFF_0%,#03CBFF_80%)]",
                  "lg:text-[1.5rem] md:text-[1.3rem] text-[1rem]",
                  currentLang === "en"
                    ? "w-[5rem] md:w-[6rem]  leading-none"
                    : "w-[5rem] md:w-[7rem]  leading-[105%]",
                )}
              >
                <span
                  className="flex flex-col"
                  key={`sidebar-logo-text-${currentLang}`}
                >
                  {settings?.title || t("logo-text")}
                </span>
              </motion.div>
            </Link>
          </div>

          <div
            className="toggleMenu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {!isMenuOpen ? (
              <CircleMinus
                className="text-secondary md:size-9 lg:size-10"
                strokeWidth={1}
                stroke="url(#dashboard_linear)"
              />
            ) : currentLang === "en" ? (
              <CircleChevronRight
                className="text-secondary md:size-9 lg:size-10"
                strokeWidth={1}
                stroke="url(#dashboard_linear)"
              />
            ) : (
              <CircleChevronLeft
                className="text-secondary md:size-9 lg:size-10"
                strokeWidth={1}
                stroke="url(#dashboard_linear)"
              />
            )}
          </div>
        </div>
        <div className="bottomBox">
          <div className="w-full flex items-center relative gap-3 lg:gap-7">
            <nav className=" w-full flex">
              <ul className="flex w-full h-full flex-col  ">
                {mainNavItems.map((item, index) => (
                  <li
                    className={cn("w-full relative flex")}
                    key={"navItem-" + item?.key}
                  >
                    <MenuItem
                      item={item}
                      isMenuOpen={isMenuOpen}
                      index={index}
                    />
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuItem({
  item,
  isMenuOpen,
  index,
}: {
  item: any;
  isMenuOpen: boolean;
  index: number;
}) {
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language;
  const [isHover, setIsHover] = useState(false);
  const IconContent = item?.icon;
  const isSvgString = typeof IconContent === "string";

  const [tooltipOpen, setTooltipOpen] = useState(isMenuOpen);
  const canShowTooltip = isMenuOpen;

  useEffect(() => {
    setTooltipOpen(false);
  }, [isMenuOpen]);
  return (
    <TooltipProvider>
      <Tooltip
        open={canShowTooltip && tooltipOpen}
        onOpenChange={setTooltipOpen}
      >
        <TooltipTrigger asChild>
          <Link
            to={item.href}
            activeOptions={{ exact: false }}
            className={cn(
              "group relative flex justify-content-start w-full items-center gap-2 md:gap-3 lg:gap-4 py-[.8rem] md:py-[1rem] ps-2 md:ps-4 text-[1.2rem] md:text-[1.25rem] font-medium text-white transition-all duration-300 z-10 [&:before]:content-[''] [&:before]:absolute [&:before]:inset-0 rtl:[&:before]:-left-[var(--sidePadd)] ltr:[&:before]:-right-[var(--sidePadd)] [&:before]:z-[11] ltr:[&:before]:origin-right rtl:[&:before]:origin-left [&:before]:scale-x-0 rtl:[&:before]:rounded-r-[8px] rtl:md:[&:before]:rounded-r-[10px] ltr:[&:before]:rounded-l-[8px] ltr:md:[&:before]:rounded-l-[10px] [&:before]:bg-white [&:before]:transition-transform [&:before]:duration-300 hover:[&:before]:scale-x-100 [&:not(.active)]:before:opacity-[.2]",
              item.preventClick ? "blur-[5px] pointer-events-none" : "",
            )}
            activeProps={{
              className: "active [&:before]:scale-x-100",
            }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            {item.icon ? (
              <div
                className="iconBox size-7 md:size-8 relative z-12 transition-all duration-400 stroke-white fill-white group-[.active]:fill-[url(#dashboard_linear)] transition-fill  group-[.active]:stroke-[url(#dashboard_linear)] transition-stroke  duration-300 [&_svg]:w-full [&_svg]:h-full"
                dangerouslySetInnerHTML={{ __html: item.icon }}
              />
            ) : (
              // <item.icon
              //   strokeWidth={2}
              //   className={`iconBox size-6 md:size-7 relative z-12 transition-all duration-400 stroke-white  group-[.active]:stroke-[url(#dashboard_linear)] transition-stroke duration-300`}
              // />
              <ShieldCheck
                strokeWidth={2}
                className="iconBox size-7 md:size-8 relative z-12 transition-all duration-400 stroke-white group-[.active]:stroke-[url(#dashboard_linear)] transition-stroke duration-300"
              />
            )}

            <motion.div
              key={`menu-item-text-${item.id}`}
              initial={false}
              animate={
                !isMenuOpen
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: currentLang === "en" ? 20 : -20 }
              }
              transition={{
                duration: 0.25,

                delay: isMenuOpen ? 0 : index * 0.08,
              }}
              // initial={{ opacity: 0, x: currentLang === "en" ? 20 : -20 }}
              // animate={
              //   !isMenuOpen
              //     ? { opacity: 1, x: 0 }
              //     : { opacity: 0, x: currentLang === "en" ? 20 : -20 }
              // }
              // // exit={{ opacity: 0, x: currentLang === "en" ? 20 : -20 }}
              // transition={{
              //   duration: 0.25,

              //   delay: index * 0.05,
              // }}
              className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis leading-[100%]"
            >
              <span
                className={cn(
                  "relative z-[12] transition-all duration-300  group-[.active]:bg-clip-text group-[.active]:text-transparent",
                  currentLang === "en"
                    ? "group-[.active]:bg-[linear-gradient(270deg,#022EE4_0%,#03CBFF_100%)]"
                    : "group-[.active]:bg-[linear-gradient(45deg,#022EE4_0%,#03CBFF_100%)]",
                )}
              >
                {item.title}
              </span>
            </motion.div>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{item.title}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
