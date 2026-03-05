import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  CircleMinus,
  LayoutDashboard,
  BookText,
  ShieldCheck,
  CircleChevronRight,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useMemo, useEffect } from "react";

import { apiClient } from "@/api";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DashboardSidebar({ delay }: { delay: number }) {
  const { t, i18n } = useTranslation();

  const mainNavItems = useMemo(
    () => [
      {
        id: 1,
        title: t("dashboard"),
        href: "/" + i18n.language + "/dashboard",
        icon: LayoutDashboard,
      },
      {
        id: 2,
        title: t("glossary"),
        href: "/" + i18n.language + "/glossary",
        icon: BookText,
      },
      {
        id: 3,
        title: t("federal-legislations"),
        href: "/" + i18n.language + "/federal-legislations",
        preventClick: true,
      },
      {
        id: 4,
        title: t("federal-courts-decisions"),
        href: "/" + i18n.language + "/federal-courts-decisions",
        preventClick: true,
      },
      {
        id: 5,
        title: t("international-treaties"),
        href: "/" + i18n.language + "/international-treaties",
        preventClick: true,
      },
      {
        id: 6,
        title: t("local-governments-legislations"),
        href: "/" + i18n.language + "/local-governments-legislations",
        preventClick: true,
      },
      {
        id: 7,
        title: t("local-governments-courts-decisions"),
        href: "/" + i18n.language + "/local-governments-courts-decisions",
        preventClick: true,
      },
    ],
    [i18n.language],
  );

  const [isMenuOpen, setIsMenuOpen] = useState(() => {
    const savedState = localStorage.getItem("isMenuOpen");
    return savedState !== null ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    localStorage.setItem("isMenuOpen", JSON.stringify(isMenuOpen));
  }, [isMenuOpen]);

  return (
    <motion.div className={cn("sideBar", isMenuOpen ? "open" : "")}>
      <motion.div className="inner">
        <div className="topBox ">
          <div className="inline-flex items-center relative z-10">
            <Link
              to={"/" + i18n.language}
              className="inline-block outline-none border-none"
            >
              {!isMenuOpen ? (
                <motion.img
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  src={"/logoFull.svg"}
                  alt="Regulatory Intelligence Logo"
                  className=" object-contain lg:h-[5rem] md:h-[4rem] h-[3rem] w-auto"
                />
              ) : (
                <motion.img
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  src="/logoShape.svg"
                  alt=""
                  className=" object-contain lg:h-[5rem] md:h-[4rem] h-[3rem] w-auto"
                />
              )}
            </Link>
          </div>

          <div
            className="toggleMenu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg width="0" height="0" style={{ position: "absolute" }}>
              <linearGradient
                id="dashboard_toggle_linear"
                x1="23.1869"
                y1="14.8085"
                x2="-2.48181e-07"
                y2="14.8085"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#022EE4" />
                <stop offset="1" stopColor="#03CBFF" />
              </linearGradient>
            </svg>
            {!isMenuOpen ? (
              <CircleMinus
                className="text-secondary md:size-9 lg:size-10"
                strokeWidth={1}
                stroke="url(#dashboard_toggle_linear)"
              />
            ) : (
              <CircleChevronRight
                className="text-secondary md:size-9 lg:size-10"
                strokeWidth={1}
                stroke="url(#dashboard_toggle_linear)"
              />
            )}
          </div>
        </div>
        <div className="bottomBox">
          <div className="w-full flex items-center relative gap-3 lg:gap-7">
            <motion.nav className=" w-full flex">
              <svg width="0" height="0" style={{ position: "absolute" }}>
                <linearGradient
                  id="dashboard_linear"
                  x1="23.1869"
                  y1="14.8085"
                  x2="-2.48181e-07"
                  y2="14.8085"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#022EE4" />
                  <stop offset="1" stopColor="#03CBFF" />
                </linearGradient>
              </svg>
              <ul className="flex w-full h-full flex-col  ">
                {mainNavItems.map((item, index) => (
                  <motion.li
                    transition={{
                      duration: 0.3,
                      visualDuration: 0.2,
                      bounce: 0.2,
                    }}
                    className={cn("w-full relative flex")}
                    key={"navItem-" + item.id}
                  >
                    {!isMenuOpen ? (
                      <MenuItem
                        item={item}
                        isMenuOpen={isMenuOpen}
                        index={index}
                      />
                    ) : (
                      <MenuItemWithTooltip
                        item={item}
                        isMenuOpen={isMenuOpen}
                        index={index}
                      />
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MenuItem({
  item,
  isMenuOpen,
  index,
}: {
  item: any;
  isMenuOpen: boolean;
}) {
  const [isHover, setIsHover] = useState(false);

  return (
    <Link
      to={item.href}
      activeOptions={{ exact: true }}
      className={cn(
        "group relative flex justify-content-start w-full items-center gap-2 md:gap-4 py-[.8rem] md:py-[1rem] pl-2 md:pl-4 text-[1.2rem] md:text-[1.3rem] font-medium text-white transition-all duration-300 z-10 [&:before]:content-[''] [&:before]:absolute [&:before]:inset-0 [&:before]:-right-[var(--sidePadd)] [&:before]:z-[11] [&:before]:origin-right [&:before]:scale-x-0 [&:before]:rounded-l-[8px] md:[&:before]:rounded-l-[10px] [&:before]:bg-white [&:before]:transition-transform [&:before]:duration-300 hover:[&:before]:scale-x-100 [&:not(.active)]:before:opacity-[.2]",
        item.preventClick ? "blur-[5px] pointer-events-none" : "",
      )}
      activeProps={{
        className: "active [&:before]:scale-x-100",
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {item.icon ? (
        <item.icon
          // size={24}
          strokeWidth={2}
          className={`iconBox size-6 md:size-7 relative z-12 transition-all duration-400 stroke-white  group-[.active]:stroke-[url(#dashboard_linear)] transition-stroke duration-300`}
        />
      ) : (
        <ShieldCheck
          // size={24}
          strokeWidth={2}
          className="iconBox size-6 md:size-7 relative z-12 transition-all duration-400 stroke-white group-[.active]:stroke-[url(#dashboard_linear)] transition-stroke duration-300"
        />
      )}

      {!isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{
            duration: 0.25,
            ease: "easeInOut",
            delay: index * 0.05,
          }}
          className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis leading-[100%]"
        >
          <span
            className="relative z-[12] transition-all duration-300 
  group-[.active]:bg-[linear-gradient(270deg,#022EE4_0%,#03CBFF_100%)] 
  group-[.active]:bg-clip-text 
  group-[.active]:text-transparent  "
          >
            {item.title}
          </span>
        </motion.div>
      )}
    </Link>
  );
}

function MenuItemWithTooltip({
  item,
  isMenuOpen,
  index,
}: {
  item: any;
  isMenuOpen: boolean;
  index: number;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="flex w-full">
          <MenuItem item={item} isMenuOpen={isMenuOpen} index={index} />
        </TooltipTrigger>
        <TooltipContent side="right">{item.title}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
