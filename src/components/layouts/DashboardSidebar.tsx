import { saveAs } from "file-saver";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { DefaultButton } from "../ui/buttons";
import { CircleMinus, CircleX, LayoutDashboard, BookText, ShieldCheck } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { isMobile } from "react-device-detect";
import { useScroll, useMotionValueEvent, motion } from "motion/react";
import { useState, useMemo } from "react";
import { useAtom, useAtomValue } from "jotai";
import { scrollDirectionAtom } from "@/store/atoms";
import { apiClient } from "@/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";



export default function DashboardSidebar({ delay }: { delay: number }) {
    const { t, i18n } = useTranslation();

    const { href } = useLocation();
    const router = useRouter();

    const mainNavItems = useMemo(
        () => [
            {
                id: 1,
                title: t("dashboard"),
                href: "/" + i18n.language + "/dashboard",
                icon: LayoutDashboard
            },
            {
                id: 2,
                title: t("glossary"),
                href: "/" + i18n.language + "/glossary",
                icon: BookText
            },
            {
                id: 3,
                title: t("federal-legislations"),
                href: "/" + i18n.language + "/federal-legislations",
            },
            {
                id: 4,
                title: t("federal-courts-decisions"),
                href: "/" + i18n.language + "/federal-courts-decisions",
            },
            {
                id: 5,
                title: t("international-treaties"),
                href: "/" + i18n.language + "/international-treaties",
            },
            {
                id: 6,
                title: t("local-governments-legislations"),
                href: "/" + i18n.language + "/local-governments-legislations",
            },
            {
                id: 7,
                title: t("local-governments-courts-decisions"),
                href: "/" + i18n.language + "/local-governments-courts-decisions",
            },
        ],
        [i18n.language],
    );





    const [isMenuOpen, setIsMenuOpen] = useState(false);


    return (
        <motion.div
            className={cn("sideBar", isMenuOpen ? "open" : "")}
        >
            <motion.div
                className="inner"
            >
                <div className="topBox ">
                    <div className="inline-flex items-center relative z-10">
                        <Link
                            to={"/" + i18n.language}
                            className="inline-block outline-none border-none"
                        >
                            {!isMenuOpen ? (
                                <img
                                    src={"/logoDashboard.png"}
                                    alt="Regulatory Intelligence Logo"
                                    className=" object-contain h-[7rem] w-auto"
                                />
                            ) : (
                                <img src="/logoShape.png" alt="" className=" object-contain h-[7rem] w-auto" />
                            )}

                        </Link>
                    </div>
                    <div className="toggleMenu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {!isMenuOpen ? (
                            <CircleMinus size={38} className="text-secondary" strokeWidth={1} />
                        ) : (
                            <CircleX size={38} className="text-secondary" strokeWidth={1} />
                        )}
                    </div>
                </div>
                <div className="bottomBox">
                    <div className="w-full flex items-center relative gap-3 lg:gap-7">
                        <motion.nav className=" w-full flex"

                        >
                            <ul className="flex w-full h-full flex-col  ">
                                {mainNavItems.map((item, index) => (
                                    <MenuItem key={"chapter-nav-item-" + item.id} item={item} />
                                ))}
                            </ul>
                        </motion.nav>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function MenuItem({ item }: { item: any }) {
    const [isHover, setIsHover] = useState(false);

    return (
        <motion.li
            onHoverStart={() => setIsHover(true)}
            onHoverEnd={() => setIsHover(false)}
            transition={{ duration: 0.3, visualDuration: 0.2, bounce: 0.2 }}
            className="w-full relative flex"
        >
            <Link
                to={item.href}
                activeOptions={{ exact: true }}

                className="group relative grid grid-cols-[auto_1fr] w-full items-center gap-4 py-[1rem] pl-4 text-[1.3rem] font-medium text-white transition-all duration-300 z-10 [&:before]:content-[''] [&:before]:absolute [&:before]:inset-0 [&:before]:-right-[1.5rem] [&:before]:z-[11] [&:before]:origin-right [&:before]:scale-x-0 [&:before]:rounded-l-[10px] [&:before]:bg-white [&:before]:transition-transform [&:before]:duration-300 hover:[&:before]:scale-x-100"

                activeProps={{
                    className: "active [&:before]:scale-x-100"
                }}
            >
                <svg width="0" height="0" style={{ position: 'absolute' }}>
                    <linearGradient id="dashboard_linear" x1="23.1869" y1="14.8085" x2="-2.48181e-07" y2="14.8085" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#022EE4" />
                        <stop offset="1" stopColor="#03CBFF" />
                    </linearGradient>
                </svg>
                {item.icon ?
                    <item.icon size={24}
                        strokeWidth={2} className={`iconBox relative z-12 transition-all duration-400 stroke-white group-hover:stroke-[url(#dashboard_linear)] group-[.active]:stroke-[url(#dashboard_linear)] transition-stroke duration-300`} />

                    : <ShieldCheck size={24}
                        strokeWidth={2} className="iconBox relative z-12 transition-all duration-400 stroke-white group-hover:stroke-[url(#dashboard_linear)] group-[.active]:stroke-[url(#dashboard_linear)] transition-stroke duration-300" />
                }

                <span className="relative z-[12] transition-all duration-300 
  group-hover:bg-[linear-gradient(270deg,#022EE4_0%,#03CBFF_100%)] 
  group-hover:bg-clip-text 
  group-hover:text-transparent 
  
  group-[.active]:bg-[linear-gradient(270deg,#022EE4_0%,#03CBFF_100%)] 
  group-[.active]:bg-clip-text 
  group-[.active]:text-transparent whitespace-nowrap overflow-hidden text-ellipsis "
                >
                    {item.title}
                </span>
            </Link>
        </motion.li>
    );
}

