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

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useMobile } from "@/hooks/use-mobile";
import { settingsAtom } from "@/routes/__root";
import { useAtomValue } from "jotai";
import { AnimatePresence } from "motion/react";
export default function DashboardSidebar({ delay }: { delay: number }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const isMobile = useMobile();
  const settings = useAtomValue(settingsAtom);

  const mainNavItems = useMemo(
    () => [
      {
        id: 1,
        title: t("dashboard"),
        href: "/" + i18n.language + "/dashboard",
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" stroke="none"  xmlns="http://www.w3.org/2000/svg"><path d="M2.4 11.2H8.8C9.43626 11.1992 10.0462 10.946 10.4961 10.4961C10.946 10.0462 11.1992 9.43626 11.2 8.8V2.4C11.1992 1.76374 10.946 1.15378 10.4961 0.703879C10.0462 0.253975 9.43626 0.000846654 8.8 0H2.4C1.76374 0.000846654 1.15378 0.253975 0.703879 0.703879C0.253975 1.15378 0.000846654 1.76374 0 2.4V8.8C0.000846654 9.43626 0.253975 10.0462 0.703879 10.4961C1.15378 10.946 1.76374 11.1992 2.4 11.2ZM1.6 2.4C1.6 2.18783 1.68429 1.98434 1.83431 1.83431C1.98434 1.68429 2.18783 1.6 2.4 1.6H8.8C9.01218 1.6 9.21566 1.68429 9.36569 1.83431C9.51572 1.98434 9.6 2.18783 9.6 2.4V8.8C9.6 9.01217 9.51572 9.21566 9.36569 9.36569C9.21566 9.51572 9.01218 9.6 8.8 9.6H2.4C2.18783 9.6 1.98434 9.51572 1.83431 9.36569C1.68429 9.21566 1.6 9.01217 1.6 8.8V2.4ZM2.4 24H8.8C9.43626 23.9992 10.0462 23.746 10.4961 23.2961C10.946 22.8462 11.1992 22.2363 11.2 21.6V15.2C11.1992 14.5637 10.946 13.9538 10.4961 13.5039C10.0462 13.054 9.43626 12.8008 8.8 12.8H2.4C1.76374 12.8008 1.15378 13.054 0.703879 13.5039C0.253975 13.9538 0.000846654 14.5637 0 15.2V21.6C0.000846654 22.2363 0.253975 22.8462 0.703879 23.2961C1.15378 23.746 1.76374 23.9992 2.4 24ZM1.6 15.2C1.6 14.9878 1.68429 14.7843 1.83431 14.6343C1.98434 14.4843 2.18783 14.4 2.4 14.4H8.8C9.01218 14.4 9.21566 14.4843 9.36569 14.6343C9.51572 14.7843 9.6 14.9878 9.6 15.2V21.6C9.6 21.8122 9.51572 22.0157 9.36569 22.1657C9.21566 22.3157 9.01218 22.4 8.8 22.4H2.4C2.18783 22.4 1.98434 22.3157 1.83431 22.1657C1.68429 22.0157 1.6 21.8122 1.6 21.6V15.2ZM21.6 0H15.2C14.5637 0.000846654 13.9538 0.253975 13.5039 0.703879C13.054 1.15378 12.8008 1.76374 12.8 2.4V8.8C12.8008 9.43626 13.054 10.0462 13.5039 10.4961C13.9538 10.946 14.5637 11.1992 15.2 11.2H21.6C22.2363 11.1992 22.8462 10.946 23.2961 10.4961C23.746 10.0462 23.9992 9.43626 24 8.8V2.4C23.9992 1.76374 23.746 1.15378 23.2961 0.703879C22.8462 0.253975 22.2363 0.000846654 21.6 0ZM22.4 8.8C22.4 9.01217 22.3157 9.21566 22.1657 9.36569C22.0157 9.51572 21.8122 9.6 21.6 9.6H15.2C14.9878 9.6 14.7843 9.51572 14.6343 9.36569C14.4843 9.21566 14.4 9.01217 14.4 8.8V2.4C14.4 2.18783 14.4843 1.98434 14.6343 1.83431C14.7843 1.68429 14.9878 1.6 15.2 1.6H21.6C21.8122 1.6 22.0157 1.68429 22.1657 1.83431C22.3157 1.98434 22.4 2.18783 22.4 2.4V8.8ZM18.4 12.8C17.2924 12.8 16.2097 13.1284 15.2888 13.7438C14.3679 14.3591 13.6501 15.2337 13.2263 16.257C12.8024 17.2802 12.6915 18.4062 12.9076 19.4925C13.1237 20.5788 13.657 21.5766 14.4402 22.3598C15.2234 23.143 16.2212 23.6763 17.3075 23.8924C18.3938 24.1085 19.5198 23.9976 20.543 23.5737C21.5663 23.1499 22.4409 22.4321 23.0562 21.5112C23.6716 20.5903 24 19.5076 24 18.4C23.9983 16.9153 23.4078 15.4919 22.3579 14.4421C21.3081 13.3922 19.8847 12.8017 18.4 12.8ZM18.4 22.4C17.6089 22.4 16.8355 22.1654 16.1777 21.7259C15.5199 21.2864 15.0072 20.6616 14.7045 19.9307C14.4017 19.1998 14.3225 18.3956 14.4769 17.6196C14.6312 16.8437 15.0122 16.131 15.5716 15.5716C16.131 15.0122 16.8437 14.6312 17.6196 14.4769C18.3956 14.3225 19.1998 14.4017 19.9307 14.7045C20.6616 15.0072 21.2864 15.5199 21.7259 16.1777C22.1654 16.8355 22.4 17.6089 22.4 18.4C22.3987 19.4605 21.9769 20.4772 21.227 21.227C20.4772 21.9769 19.4605 22.3987 18.4 22.4Z" /></svg>',
      },
      {
        id: 2,
        title: t("glossary"),
        href: "/" + i18n.language + "/glossary",
        icon: '<svg width="23" height="28" viewBox="0 0 23 28" stroke="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.0477 27.2222H3.3818C1.5175 27.2222 0.000488281 25.7055 0.000488281 23.8409V23.6948C0.000488281 21.8305 1.5175 20.3135 3.3818 20.3135H20.0477C20.2377 20.3135 20.4199 20.389 20.5542 20.5233C20.6886 20.6576 20.7641 20.8399 20.7641 21.0299V26.5059C20.7641 26.6959 20.6886 26.8781 20.5542 27.0124C20.4199 27.1468 20.2377 27.2222 20.0477 27.2222ZM3.3818 21.7462C2.30781 21.7462 1.43325 22.6205 1.43325 23.6948V23.8409C1.43325 24.9155 2.30781 25.7895 3.3818 25.7895H19.3313V21.7462H3.3818Z" /><path d="M0.71638 24.4853C0.526385 24.4853 0.34417 24.4098 0.209823 24.2755C0.0754756 24.1412 0 23.9589 0 23.7689V3.45526C0 2.534 0.359909 1.66718 1.01325 1.01355C1.33265 0.691077 1.71303 0.435387 2.13224 0.26138C2.55144 0.0873721 3.00108 -0.0014737 3.45496 1.84886e-05H20.5306C21.063 0.000701046 21.5733 0.212502 21.9497 0.588965C22.3261 0.965428 22.5379 1.47582 22.5385 2.00818V19.7386C22.5379 20.271 22.3261 20.7814 21.9496 21.1579C21.5732 21.5344 21.0627 21.7461 20.5303 21.7467H20.0466C19.8566 21.7467 19.6744 21.6713 19.5401 21.5369C19.4057 21.4026 19.3302 21.2204 19.3302 21.0304C19.3302 20.8404 19.4057 20.6582 19.5401 20.5238C19.6744 20.3895 19.8566 20.314 20.0466 20.314H20.5303C20.6829 20.3138 20.8291 20.2532 20.937 20.1453C21.0449 20.0374 21.1056 19.8911 21.1057 19.7386V2.00818C21.1056 1.85567 21.0449 1.70944 20.9371 1.60158C20.8293 1.49371 20.6831 1.43301 20.5306 1.43278H3.45496C3.18965 1.43188 2.92682 1.48378 2.68177 1.58547C2.43672 1.68716 2.21436 1.8366 2.02764 2.02508C1.83881 2.21221 1.689 2.43495 1.58688 2.6804C1.48476 2.92586 1.43238 3.18913 1.43276 3.45498V23.7689C1.43276 23.9589 1.35729 24.1412 1.22294 24.2755C1.08859 24.4098 0.906376 24.4853 0.71638 24.4853ZM21.2069 27.2225H20.0475C19.8575 27.2225 19.6753 27.147 19.5409 27.0126C19.4066 26.8783 19.3311 26.6961 19.3311 26.5061C19.3311 26.3161 19.4066 26.1339 19.5409 25.9995C19.6753 25.8652 19.8575 25.7897 20.0475 25.7897H21.2072C21.3971 25.7897 21.5794 25.8652 21.7137 25.9995C21.8481 26.1339 21.9235 26.3161 21.9235 26.5061C21.9235 26.6961 21.8481 26.8783 21.7137 27.0126C21.5794 27.147 21.3969 27.2225 21.2069 27.2225Z" /><path d="M17.5863 6.04262H6.52253C6.33254 6.04262 6.15032 5.96715 6.01598 5.8328C5.88163 5.69845 5.80615 5.51624 5.80615 5.32624C5.80615 5.13625 5.88163 4.95403 6.01598 4.81969C6.15032 4.68534 6.33254 4.60986 6.52253 4.60986H17.5863C17.7763 4.60986 17.9585 4.68534 18.0929 4.81969C18.2272 4.95403 18.3027 5.13625 18.3027 5.32624C18.3027 5.51624 18.2272 5.69845 18.0929 5.8328C17.9585 5.96715 17.7763 6.04262 17.5863 6.04262ZM17.5863 11.3312H6.52253C6.33254 11.3312 6.15032 11.2558 6.01598 11.1214C5.88163 10.9871 5.80615 10.8048 5.80615 10.6148C5.80615 10.4249 5.88163 10.2426 6.01598 10.1083C6.15032 9.97395 6.33254 9.89847 6.52253 9.89847H17.5863C17.7763 9.89847 17.9585 9.97395 18.0929 10.1083C18.2272 10.2426 18.3027 10.4249 18.3027 10.6148C18.3027 10.8048 18.2272 10.9871 18.0929 11.1214C17.9585 11.2558 17.7763 11.3312 17.5863 11.3312Z" /></svg>',
      },
      {
        id: 3,
        title: t("local-governments-legislations"),
        href: "/" + i18n.language + "/legislations",
        icon: '<svg width="28" height="28" viewBox="0 0 28 28" stroke="none" xmlns="http://www.w3.org/2000/svg"><path d="M27.5334 27.0666H27.0667V10.7334C27.0667 10.6721 27.0547 10.6114 27.0312 10.5547C27.0078 10.4981 26.9734 10.4467 26.9301 10.4033C26.8867 10.36 26.8353 10.3256 26.7787 10.3022C26.722 10.2787 26.6613 10.2667 26.6001 10.2667H24.7334V7.93335C24.7334 7.87206 24.7214 7.81137 24.6979 7.75475C24.6745 7.69812 24.6401 7.64667 24.5968 7.60333C24.5534 7.56 24.502 7.52562 24.4454 7.50218C24.3887 7.47874 24.328 7.46668 24.2668 7.4667H14.4668V5.13335H16.3334V5.6C16.3334 5.66129 16.3454 5.72198 16.3689 5.7786C16.3923 5.83523 16.4267 5.88668 16.47 5.93002C16.5134 5.97336 16.5648 6.00773 16.6215 6.03117C16.6781 6.05461 16.7388 6.06667 16.8001 6.06665H19.6001C19.6818 6.06659 19.7621 6.04509 19.8329 6.00431C19.9038 5.96353 19.9627 5.90488 20.0038 5.83423C20.0448 5.7635 20.0665 5.68326 20.0667 5.60152C20.0669 5.51979 20.0457 5.43942 20.0052 5.36845L19.204 3.96665L20.0052 2.56484C20.0457 2.49388 20.0669 2.41351 20.0667 2.33177C20.0665 2.25004 20.0448 2.1698 20.0038 2.09907C19.9627 2.02842 19.9038 1.96977 19.8329 1.92899C19.7621 1.88821 19.6818 1.86672 19.6001 1.86665H17.2667V1.4C17.2667 1.33871 17.2547 1.27802 17.2312 1.2214C17.2078 1.16477 17.1734 1.11332 17.1301 1.06998C17.0867 1.02665 17.0353 0.992273 16.9787 0.968829C16.922 0.945385 16.8613 0.93333 16.8001 0.933352H14.4667V0.466648C14.4667 0.405361 14.4546 0.344672 14.4312 0.288049C14.4077 0.231425 14.3734 0.179977 14.33 0.136643C14.2867 0.0933084 14.2352 0.0589367 14.1786 0.0354912C14.122 0.0120457 14.0613 -1.43381e-05 14 2.88632e-08C13.9387 -2.15296e-05 13.878 0.012034 13.8214 0.0354776C13.7648 0.0589213 13.7133 0.0932935 13.67 0.13663C13.6266 0.179967 13.5923 0.231418 13.5688 0.288044C13.5454 0.34467 13.5333 0.405361 13.5334 0.466648V7.46665H3.73335C3.67206 7.46663 3.61137 7.47868 3.55475 7.50213C3.49812 7.52557 3.44667 7.55994 3.40333 7.60328C3.36 7.64661 3.32562 7.69807 3.30218 7.75469C3.27874 7.81132 3.26668 7.87201 3.2667 7.9333V10.2666H1.4C1.33871 10.2666 1.27802 10.2787 1.2214 10.3021C1.16477 10.3256 1.11332 10.3599 1.06998 10.4033C1.02665 10.4466 0.992273 10.4981 0.968829 10.5547C0.945385 10.6113 0.93333 10.672 0.933352 10.7333V27.0666H0.466648C0.208687 27.0666 0 27.2756 0 27.5333C0 27.791 0.208742 28 0.466648 28H27.5334C27.7913 28 28 27.791 28 27.5334C28 27.2757 27.7913 27.0666 27.5334 27.0666ZM17.2666 4.66665V2.8H18.7956L18.2615 3.73516C18.2212 3.80566 18.1999 3.88546 18.1999 3.96668C18.1999 4.04789 18.2212 4.1277 18.2615 4.1982L18.7956 5.13335H17.2666V4.66665ZM14.4666 1.86665H16.3333V4.2H14.4666V1.86665ZM4.2 8.4H23.8V10.2666H4.2V8.4ZM8.4 27.0666H5.6V18.632C5.6 17.86 6.22798 17.232 7 17.232C7.77202 17.232 8.4 17.86 8.4 18.632V27.0666ZM15.4 27.0666H12.6V18.632C12.6 17.86 13.228 17.232 14 17.232C14.772 17.232 15.4 17.86 15.4 18.632V27.0666ZM22.4 27.0666H19.6V18.632C19.6 17.86 20.228 17.232 21 17.232C21.772 17.232 22.4 17.86 22.4 18.632V27.0666ZM26.1334 27.0666H23.3334V18.632C23.3334 17.3455 22.2865 16.2987 21 16.2987C19.7135 16.2987 18.6666 17.3455 18.6666 18.632V27.0666H16.3333V18.632C16.3333 17.3455 15.2865 16.2987 13.9999 16.2987C12.7134 16.2987 11.6666 17.3455 11.6666 18.632V27.0666H9.33324V18.632C9.33324 17.3455 8.28641 16.2987 6.99989 16.2987C5.71337 16.2987 4.66665 17.3455 4.66665 18.632V27.0666H1.86665V14H26.1333V27.0666H26.1334ZM26.1334 13.0666H1.86665V11.2H26.1333V13.0666H26.1334Z" /></svg>',
      },
      {
        id: 4,
        title: t("local-governments-courts-decisions"),
        href: "/" + i18n.language + "/courts-decisions",
        icon: '<svg width="32" height="32" viewBox="0 0 32 32"  xmlns="http://www.w3.org/2000/svg"><path d="M15.1008 4.15891L7.5575 11.7022M21.0863 10.1443L13.5429 17.6877M18.635 12.5957L30.6499 24.6106L28.0093 27.2513L15.9943 15.2364M23.2433 30.6499H0.649902M13.3958 19.5953L11.7944 21.1967L4.04849 13.4508L5.64988 11.8494C6.22387 11.2754 7.15443 11.2754 7.72835 11.8494L13.3957 17.5168C13.9698 18.0907 13.9698 19.0214 13.3958 19.5953ZM22.9939 9.9972L24.5953 8.39582L16.8494 0.649902L15.248 2.25129C14.674 2.82528 14.674 3.75584 15.248 4.32976L20.9154 9.99714C21.4894 10.5712 22.4199 10.5712 22.9939 9.9972ZM20.5669 30.6499H3.32625V29.1657C3.32625 27.923 4.33374 26.9155 5.5765 26.9155H18.3167C19.5594 26.9155 20.5669 27.923 20.5669 29.1657V30.6499Z"  fill="none"  stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      },
      {
        id: 5,
        title: t("federal-legislations"),
        href: "/" + i18n.language + "/federal-legislations",
        preventClick: true,
      },
      {
        id: 6,
        title: t("federal-courts-decisions"),
        href: "/" + i18n.language + "/federal-courts-decisions",
        preventClick: true,
      },
      {
        id: 7,
        title: t("international-treaties"),
        href: "/" + i18n.language + "/international-treaties",
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

  useEffect(() => {
    if (isMobile) {
      setIsMenuOpen(true);
    }
  }, []);

  return (
    <div className={cn("sideBar", isMenuOpen ? "open" : "")}>
      <div className="inner">
        <div className="topBox ">
          <div className="inline-flex items-center justify-start relative z-10">
            <Link
              to={"/" + i18n.language}
              className="inline-flex items-center md:gap-4 gap-2 outline-none border-none "
            >
              <motion.img
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                src="/logoShape.svg"
                alt=""
                className=" object-contain lg:h-[5rem] md:h-[4rem] h-[3rem] w-auto"
              />
              {!isMenuOpen && (
                <motion.span
                  initial={{ opacity: 0, x: currentLang === "en" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: currentLang === "en" ? 20 : -20 }}
                  transition={{
                    duration: 0.25,
                    ease: "easeInOut",
                    delay: 0.1,
                  }}
                  className={cn(
                    "inline-block font-bold lg:text-[1.25rem] md:text-[1.1rem] text-[1.1rem] leading-none md:max-w-[5rem] pe-5 md:pe-0 tracking-[0.03em] bg-clip-text text-transparent",
                    "bg-[linear-gradient(90deg,#FFF_0%,#03CBFF_80%)]",
                  )}
                >
                  {settings?.settings?.title || t("logo-text")}
                </motion.span>
              )}
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
            ) : i18n.language === "en" ? (
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

  return (
    <Link
      to={item.href}
      activeOptions={{ exact: false }}
      className={cn(
        "group relative flex justify-content-start w-full items-center gap-2 md:gap-4 py-[.8rem] md:py-[1rem] ps-2 md:ps-4 text-[1.2rem] md:text-[1.3rem] font-medium text-white transition-all duration-300 z-10 [&:before]:content-[''] [&:before]:absolute [&:before]:inset-0 rtl:[&:before]:-left-[var(--sidePadd)] ltr:[&:before]:-right-[var(--sidePadd)] [&:before]:z-[11] ltr:[&:before]:origin-right rtl:[&:before]:origin-left [&:before]:scale-x-0 rtl:[&:before]:rounded-r-[8px] rtl:md:[&:before]:rounded-r-[10px] ltr:[&:before]:rounded-l-[8px] ltr:md:[&:before]:rounded-l-[10px] [&:before]:bg-white [&:before]:transition-transform [&:before]:duration-300 hover:[&:before]:scale-x-100 [&:not(.active)]:before:opacity-[.2]",
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
          className="iconBox size-5 md:size-6 relative z-12 transition-all duration-400 stroke-white fill-white group-[.active]:fill-[url(#dashboard_linear)] transition-fill  group-[.active]:stroke-[url(#dashboard_linear)] transition-stroke  duration-300 [&_svg]:w-full [&_svg]:h-full"
          dangerouslySetInnerHTML={{ __html: item.icon }}
        />
      ) : (
        // <item.icon
        //   strokeWidth={2}
        //   className={`iconBox size-6 md:size-7 relative z-12 transition-all duration-400 stroke-white  group-[.active]:stroke-[url(#dashboard_linear)] transition-stroke duration-300`}
        // />
        <ShieldCheck
          strokeWidth={2}
          className="iconBox size-6 md:size-7 relative z-12 transition-all duration-400 stroke-white group-[.active]:stroke-[url(#dashboard_linear)] transition-stroke duration-300"
        />
      )}

      {!isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: currentLang === "en" ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          // exit={{ opacity: 0, x: currentLang === "en" ? 20 : -20 }}
          transition={{
            duration: 0.25,
            ease: "easeInOut",
            delay: index * 0.05,
          }}
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
        {item.preventClick ? (
          <MenuItem item={item} isMenuOpen={isMenuOpen} index={index} />
        ) : (
          <TooltipTrigger className="flex w-full">
            <MenuItem item={item} isMenuOpen={isMenuOpen} index={index} />
          </TooltipTrigger>
        )}

        <TooltipContent side="right">{item.title}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
