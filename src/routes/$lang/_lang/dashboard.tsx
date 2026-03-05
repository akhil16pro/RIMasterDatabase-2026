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

import { ArrowUp } from "lucide-react";
import { useEffect } from "react";
import { SectionTitle } from "@/components/ui/sectionTitle";
import BarChart from "@/components/ui/BarChart";
export const Route = createFileRoute("/$lang/_lang/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t, i18n } = useTranslation();

  let isLoading = false;
  let error = false;
  let isRefetching = false;
  const data = {
    title: "Ministry of Health",
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
          className="flex flex-col items-center justify-center w-full h-full flex-1 md:p-5 p-2"
        >
          <section className="w-full flex-1 relative mainWrapper ">
            <DashboardSidebar delay={0} />

            <div className="contentBox">
              <DashboardTopbar delay={0} title={data.title} lastLogin={true} />
              <MinistryCard delay={0.2} />
              <PerformingEntitiesCard delay={0.4} />
            </div>
          </section>
        </div>
      )}
    </AnimatePresence>
  );
}

function MinistryCard({ delay }: { delay: number }) {
  let data = [
    {
      title: "Submitted",
      count: 50,
    },
    {
      title: "Draft",
      count: 12,
    },
    {
      title: "Approved",
      count: 38,
    },
    {
      title: "Total entries",
      count: 50,
      link: true,
    },
  ];
  return (
    <motion.div
      className="w-full flex   justify-center w-full rounded-lg overflow-hidden lg:bg-[linear-gradient(50deg,#022EE4_0%,#FFC99D_50%,#022EE4_108%)] bg-[linear-gradient(50deg,#FFC99D_0%,#022EE4_108%)] p-[1px] [&>div]:p-5 lg:flex-row flex-col"
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ delay: delay, duration: 0.5, ease: "easeInOut" }}
    >
      <div className="flex-1 bg-white rounded-[calc(0.75rem-1px)] overflow-hidden flex items-center justify-center ">
        <img
          src="/ministryImg.jpg"
          alt=""
          className=" h-20 md:h-24 xl:h-27 2xl:h-33 w-auto"
        />
      </div>
      <div className="flex-1 grid grid-cols-2 md:flex gap-2 md:gap-1">
        {data.map((item, index) =>
          item.link ? (
            <Link
              to={"/"}
              key={index}
              className="flex flex-1 items-center justify-between flex-col text-center justify-center px-2 py-8 relative [&:before]:content-[''] [&:before]:absolute [&:before]:inset-0 [&:before]:bg-white/10  hover:[&:before]:scale-105 [&:before]:transition-all [&:before]:duration-300 [&:before]:overflow-hidden [&:before]:rounded-[calc(0.75rem-1px)]"
            >
              <NumberCard title={item.title} count={item.count} />
              <ArrowUp className="absolute top-2 right-2 rotate-45 xl:size-5 2xl:size-7 size-6" />
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

function NumberCard({ title, count }: { title: string; count: number }) {
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
      <span className=" font-regular  2xl:text-[1.3rem] text-[1rem] leading-[100%]">
        {title}
      </span>
    </>
  );
}

function PerformingEntitiesCard({ delay }: { delay: number }) {
  const data = [
    {
      name: "Ministry of Health",
      value: 80,
    },
    {
      name: "Ministry of Health",
      value: 75,
    },
    {
      name: "Ministry of Health Ministry of Health",
      value: 60,
    },
    {
      name: "Ministry of Health",
      value: 62,
      visibility: true,
    },
    {
      name: "Ministry of Health",
      value: 45,
    },
    {
      name: "Ministry of Health",
      value: 35,
    },
    {
      name: "Ministry of Health",
      value: 25,
    },
    {
      name: "Ministry of Health",
      value: 20,
    },
    {
      name: "Ministry of Health",
      value: 15,
    },
    {
      name: "Ministry of Health",
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
        <SectionTitle size="small">
          <span>Top 10 Performing Entities (by contribution) </span>
        </SectionTitle>
      </motion.div>
      <BarChart data={data} />
    </div>
  );
}
