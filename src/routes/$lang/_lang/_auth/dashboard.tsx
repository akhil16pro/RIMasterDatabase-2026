import { createFileRoute } from "@tanstack/react-router";

import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api";
import RouteLoader from "@/components/layouts/RouteLoader";
import RoteError from "@/components/layouts/RoteError";
import { DefaultButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

import { Link } from "@tanstack/react-router";
import DashboardSidebar from "@/components/layouts/DashboardSidebar";
import DashboardTopbar from "@/components/layouts/DashboardTopbar";

import { ArrowUp, ArrowUpLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/ui/sectionTitle";
import BarChart from "@/components/ui/BarChart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { cn } from "@/lib/utils";

import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";

export const Route = createFileRoute("/$lang/_lang/_auth/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t, i18n } = useTranslation();

  let isLoading = false;
  let error = false;
  let isRefetching = false;
  const data = {
    title: t("ministry-of-health"),
  };

  return (
    <AnimatePresence mode={"wait"}>
      {isLoading || isRefetching ? (
        <RouteLoader key="dashboard-loader" />
      ) : error ? (
        <RoteError key="dashboard-error" />
      ) : (
        <div
          key="dashboard-content"
          className="flex flex-col items-center justify-center w-full h-full flex-1 mainBody "
        >
          <section className="w-full flex-1 relative mainWrapper ">
            <DashboardSidebar delay={0} />

            <div className="contentBox">
              <DashboardTopbar delay={0} title={data.title} lastLogin={true} />
              <MinistryCard delay={0.2} />
              <PerformingEntitiesCard
                title={t("performing-entities-title")}
                delay={0.4}
              />
            </div>
          </section>
        </div>
      )}
    </AnimatePresence>
  );
}

function MinistryCard({ delay }: { delay: number }) {
  const { t, i18n } = useTranslation();
  const userSession = useAtomValue(userSessionAtom);

  let data = [
    {
      title: t("submitted"),
      count: 50,
    },
    {
      title: t("draft"),
      count: 12,
    },
    {
      title: t("approved"),
      count: 38,
    },
    {
      title: t("total-entries"),
      count: 50,
      link: true,
    },
  ];

  let adminData = [
    {
      title: t("federal-entities"),
      count: 13,
    },
    {
      title: t("local-firms"),
      count: 20,
    },
    {
      title: t("law-firms"),
      count: 38,
    },
  ];
  return (
    // lg:bg-[linear-gradient(50deg,#022EE4_0%,#FFC99D_50%,#022EE4_108%)]
    <motion.div
      className="w-full flex   justify-center w-full rounded-lg overflow-hidden  ltr:bg-[linear-gradient(50deg,#FFC99D_0%,#022EE4_108%)] rtl:bg-[linear-gradient(-50deg,#FFC99D_0%,#022EE4_108%)] p-[1px] [&>div]:p-3 md:[&>div]:p-5 lg:flex-row flex-col"
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ delay: delay, duration: 0.5, ease: "easeInOut" }}
    >
      {userSession?.user.role === "admin" ? (
        <div className="flex-1 grid grid-cols-1 md:flex gap-2 md:gap-3">
          {adminData.map((item, index) => (
            <div
              key={index}
              className="flex flex-1 items-center justify-start md:flex-col flex-row gap-3 md:gap-0 text-center md:justify-center md:px-2 md:py-8 px-4 py-3 relative [&:before]:content-[''] [&:before]:absolute [&:before]:inset-0 [&:before]:bg-white/10 [&:before]:overflow-hidden [&:before]:rounded-[calc(0.75rem-1px)]"
            >
              <NumberCard title={item.title} count={item.count} size={"lg"} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-[calc(0.75rem-1px)] overflow-hidden flex items-center justify-center ">
          <img
            src="/ministryImg.jpg"
            alt=""
            className=" h-20 md:h-24 xl:h-27 2xl:h-33 w-auto"
          />
        </div>
      )}

      <div className="flex-1 grid grid-cols-2 md:flex gap-2 md:gap-1">
        {data.map((item, index) =>
          item.link ? (
            <Link
              to={"/"}
              key={index}
              className="flex flex-1 items-center justify-between flex-col text-center justify-center px-2 py-8 relative [&:before]:content-[''] [&:before]:absolute [&:before]:inset-0 [&:before]:bg-white/10  hover:[&:before]:scale-105 [&:before]:transition-all [&:before]:duration-300 [&:before]:overflow-hidden [&:before]:rounded-[calc(0.75rem-1px)]"
            >
              <NumberCard title={item.title} count={item.count} />
              {i18n.language === "en" ? (
                <ArrowUp className="absolute top-2 right-2  rotate-45 xl:size-5 2xl:size-7 size-6" />
              ) : (
                <ArrowUpLeft className="absolute top-2 left-2 rotate--45 xl:size-5 2xl:size-7 size-6" />
              )}
            </Link>
          ) : (
            <div
              key={index}
              className="flex flex-1 items-center justify-center flex-col text-center "
            >
              <NumberCard title={item.title} count={item.count} />
            </div>
          ),
        )}
      </div>
    </motion.div>
  );
}

function NumberCard({
  title,
  count,
  size,
}: {
  title: string;
  count: number;
  size?: "lg" | "sm";
}) {
  const countValue = useMotionValue(0);
  const springValue = useSpring(countValue, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  const rounded = useTransform(springValue, (latest) => Math.round(latest));

  useEffect(() => {
    const dynamicDuration = Math.min(Math.max(Math.log10(count) * 0.8, 0.8), 3);
    const controls = animate(countValue, count, {
      duration: dynamicDuration,
    });
    return controls.stop;
  }, [count, countValue]);
  return (
    <>
      <motion.span className=" font-semibold text-[3rem] md:text-6xl  2xl:text-8xl leading-[90%]">
        {rounded}
      </motion.span>
      <span
        className={cn(
          " font-regular  2xl:text-[1.3rem] text-[1rem] leading-[100%]",
          size === "lg" && "2xl:text-[1.5rem] text-[1.4rem]",
        )}
      >
        {title}
      </span>
    </>
  );
}

function PerformingEntitiesCard({
  delay,
  title,
}: {
  delay: number;
  title: string;
}) {
  const { t, i18n } = useTranslation();
  const userSession = useAtomValue(userSessionAtom);
  const [theme, setTheme] = useState("all");

  const data = [
    {
      name: t("ministry-of-health"),
      value: 80,
    },
    {
      name: t("ministry-of-health"),
      value: 75,
    },
    {
      name: t("ministry-of-health"),
      value: 60,
    },
    {
      name: t("ministry-of-health"),
      value: 62,
      visibility: true,
    },
    {
      name: t("ministry-of-health"),
      value: 45,
    },
    {
      name: t("ministry-of-health"),
      value: 35,
    },
    {
      name: t("ministry-of-health"),
      value: 25,
    },
    {
      name: t("ministry-of-health"),
      value: 20,
    },
    {
      name: t("ministry-of-health"),
      value: 15,
    },
    {
      name: t("ministry-of-health"),
      value: 9,
    },
  ];
  return (
    <div className="w-full flex flex-col gap-4 lg:gap-3 flex-1">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: delay, duration: 0.5, ease: "easeInOut" }}
      >
        <div className="flex justify-between flex-wrap gap-2 md:gap-4 items-center">
          <div className="md:flex-1 w-full">
            <SectionTitle size="small">
              <span>{title} </span>
            </SectionTitle>
          </div>

          {userSession?.user.role === "admin" && (
            <div className="flex gap-2 justify-end w-full md:w-auto">
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className=" w-auto text-[var(--textColor)] inputStyle border-none rounded-none focus:outline-none  gap-2 min-w-[150px] max-w-[300px] [&>span]:truncate">
                  <SelectValue className="" placeholder="All Entities" />
                </SelectTrigger>

                <SelectContent position={"item-aligned"}>
                  <SelectItem className="text-[1.1rem] " value="all">
                    All Entities
                  </SelectItem>
                  <SelectItem className="text-[1.1rem] " value="entitie1">
                    Entitie 1
                  </SelectItem>
                  <SelectItem className="text-[1.1rem] " value="entitie2">
                    Entitie 2
                  </SelectItem>
                  <SelectItem className="text-[1.1rem] " value="entitie3">
                    Entitie 3
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </motion.div>
      <BarChart data={data} />
    </div>
  );
}
