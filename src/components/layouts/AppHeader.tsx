import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { DefaultButton } from "../ui/buttons";
import { Menu, X } from "lucide-react";

import { isMobile } from "react-device-detect";
import { useScroll, useMotionValueEvent, motion } from "motion/react";
import { useState, useMemo } from "react";
import { useAtom, useAtomValue } from "jotai";
import { scrollDirectionAtom } from "@/store/atoms";
import { apiClient } from "@/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

export default function AppHeader({ delay }: { delay: number }) {
  const { t, i18n } = useTranslation();
  const { scrollY } = useScroll();
  const [scrollDirection, setScrollDirection] = useAtom(scrollDirectionAtom);
  const { href } = useLocation();
  const router = useRouter();

  const mainNavItems = useMemo(
    () => [
      {
        id: 1,
        title: t("home"),
        href: "/" + i18n.language,
      },
      {
        id: 2,
        title: t("about_regulatory_intelligence"),
        href: "/" + i18n.language + "/about",
      },
      {
        id: 3,
        title: t("strategy"),
        href: "/" + i18n.language + "/strategy",
      },
      {
        id: 4,
        title: t("ri_white_paper"),
        target: "_blank",
        href: "https://regulatoryintelligence.ae/en",
      },
      {
        id: 5,
        title: t("ri_unified_master_database"),
        href: "/" + i18n.language + "/login",
      },
    ],
    [i18n.language],
  );

  useMotionValueEvent(scrollY, "change", (current) => {
    const diff = current - scrollY.getPrevious();
    setScrollDirection(diff > 1 ? "down" : "up");
  });

  const onChangeLanguage = () => {
    const lang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(lang);
    const ur = href.split("/").slice(2);
    const newUrl = "/" + lang + "/" + ur.join("/");
    router.navigate({ to: newUrl });
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      className="fixed top-0 left-0 w-full z-50 block py-5"
      initial={{ y: -150, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        transition: { duration: 0.6, type: "tween", delay: delay },
      }}
      transition={{ duration: 0.6, type: "tween", delay: delay }}
    >
      <motion.div
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: scrollDirection === "up" ? 0 : -100,
          opacity: scrollDirection === "up" ? 1 : 0,
        }}
        transition={{ duration: 0.3, type: "tween", delay: 0 }}
        className="container mx-auto px-3 md:px-0 relative z-10"
      >
        <div className="flex items-center justify-between ">
          <div className="inline-flex items-center relative z-10">
            <Link
              to={"/" + i18n.language}
              className="inline-block h-17 w-auto outline-none border-none"
            >
              <img
                src={i18n.language === "en" ? "/logo-en.png" : "/logo-ar.png"}
                alt="Regulatory Intelligence Logo"
                className="h-full object-contain w-auto"
              />
            </Link>
          </div>

          <div className="inline-flex items-center relative gap-3 lg:gap-7">
            <motion.nav
              className="fixed top-0 left-0 w-full h-full bg-black/70 px-20 lg:px-0 lg:bg-transparent lg:relative"
              style={{
                clipPath: isMobile
                  ? isMenuOpen
                    ? "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
                    : "polygon(0 0, 100% 0, 100% 0, 0 0)"
                  : "none", // or a default path for desktop
              }}
              transition={{ duration: 1, delay: 0 }}
            >
              <ul className="flex w-full h-full md:gap-7 gap-3 flex-col items-center justify-center lg:items-end lg:flex-row">
                {mainNavItems.map((item, index) => (
                  <MenuItem key={"chapter-nav-item-" + item.id} item={item} />
                ))}
              </ul>
            </motion.nav>
            <DefaultButton
              title={i18n?.language === "en" ? "AR" : "EN"}
              size="icon"
              onClick={onChangeLanguage}
              variant="shade"
            />
            {isMobile ? (
              <DefaultButton
                size="icon"
                variant="shade"
                icon={
                  isMenuOpen ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )
                }
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
            ) : null}
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}

function MenuItem({ item }: { item: any }) {
  const [isHover, setIsHover] = useState(false);

  return (
    <motion.li
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
      transition={{ duration: 0.3, visualDuration: 0.2, bounce: 0.2 }}
      className="w-auto relative block"
    >
      <Link
        target={item.href.startsWith("http") ? "_blank" : "_self"}
        to={item.href}
        activeOptions={{ exact: true }}
        className={cn(
          "text-[1.8rem] md:text-[2.5rem] lg:text-lg inline-flex items-center justify-center w-full h-full  overflow-hidden relative text-secondary [&.active]:text-text rtl:leading-[1.2]",
          isHover ? "text-text" : "text-secondary",
        )}
      >
        <span className="relative text-center inline-block overflow-hidden md:whitespace-nowrap">
          {item.title}
        </span>
      </Link>
    </motion.li>
  );
}
