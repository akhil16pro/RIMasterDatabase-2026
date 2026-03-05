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
export const Route = createFileRoute("/$lang/_lang/glossary")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t, i18n } = useTranslation();

  let isLoading = false;
  let error = false;
  let isRefetching = false;
  const data = {
    title: "Glossary",
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
              <DashboardTopbar
                delay={0}
                title={data.title}
                timeCounter={true}
              />
            </div>
          </section>
        </div>
      )}
    </AnimatePresence>
  );
}
