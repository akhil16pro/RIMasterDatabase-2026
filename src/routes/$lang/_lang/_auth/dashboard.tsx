import { createFileRoute } from "@tanstack/react-router";

import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api";

// import { DefaultButton } from "@/components/ui/buttons";
// import { Input } from "@/components/ui/input";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

import { Link } from "@tanstack/react-router";

import DashboardLayout from "@/components/layouts/DashboardLayout";

import { ArrowUp, ArrowUpLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/ui/sectionTitle";
import BarChart from "@/components/ui/BarChart";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/Select";
import { cn } from "@/lib/utils";

import { useAtomValue } from "jotai";
import { userSessionAtom, settingsAtom } from "@/store/atoms";

import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useCallback } from "react";

export const Route = createFileRoute("/$lang/_lang/_auth/dashboard")({
  component: RouteComponent,
  staticData: {
    breadcrumb: (params: any) => {
      return {
        key: "dashboard",
        path: `/${params.lang}/dashboard`,
      };
    },
  },
});

function RouteComponent() {
  const { t, i18n } = useTranslation();
  const settings = useAtomValue(settingsAtom);
  const userSession = useAtomValue(userSessionAtom);

  const { data, isLoading, error, isRefetching } = useQuery({
    queryKey: ["dashboard", i18n.language, userSession?.accessToken],
    enabled: !!userSession?.accessToken,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60 * 24,
    queryFn: async () => {
      try {
        const res = await apiClient
          .get(i18n.language + "/dashboard", {
            headers: {
              Authorization: `Bearer ${userSession?.accessToken}`,
            },
          })
          .json();
        // console.log("DASHBOARD_DATA", res?.data);
        return res?.data;
      } catch (error) {
        console.log("DASHBOARD_DATA_ERROR", error);
        return null;
      }
    },
  });

  return (
    <DashboardLayout
      isLoading={isLoading}
      isRefetching={isRefetching}
      error={error}
      title={
        userSession?.user?.roles?.includes("admin")
          ? settings?.title || t("overview")
          : userSession?.user?.entity_title
      }
      lastLogin={true}
    >
      <MinistryCard delay={0.2} data={data} />
      <PerformingEntitiesCard data={data} delay={0.4} />
    </DashboardLayout>
  );
}

function MinistryCard({
  delay,
  data,
  entityImg,
}: {
  delay: number;
  data: any;
  entityImg: string;
}) {
  const { t, i18n } = useTranslation();
  const userSession = useAtomValue(userSessionAtom);

  return (
    // lg:bg-[linear-gradient(50deg,#022EE4_0%,#FFC99D_50%,#022EE4_108%)]
    <motion.div
      className="w-full flex justify-center w-full rounded-lg overflow-hidden  ltr:bg-[linear-gradient(50deg,#FFC99D_0%,#022EE4_108%)] rtl:bg-[linear-gradient(-50deg,#FFC99D_0%,#022EE4_108%)] p-[1px] [&>div]:p-3 md:[&>div]:p-5 lg:flex-row flex-col text-white"
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ delay: delay, duration: 0.5, ease: "easeInOut" }}
    >
      {userSession?.user?.roles?.includes("admin") ? (
        <div className="flex-1 grid grid-cols-1 md:flex gap-2 md:gap-3">
          {data?.adminData?.map((item, index) => (
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
            src={userSession?.user?.entity_image || "/entityPlaceholder.png"}
            alt={userSession?.user?.entity_title}
            className=" h-20 md:h-24 xl:h-27 2xl:h-33 w-auto aspect-[4/2] object-contain"
          />
        </div>
      )}

      <div className="flex-1 grid grid-cols-2 md:flex gap-2 md:gap-1">
        {data?.glossaryData?.map((item, index) =>
          item.link ? (
            <Link
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

function PerformingEntitiesCard({ delay, data }: { delay: number; data: any }) {
  const { t, i18n } = useTranslation();
  const userSession = useAtomValue(userSessionAtom);
  // const [theme, setTheme] = useState("all");
  const [entity, setEntity] = useState([]);
  const [category, setCategory] = useState(1);
  const [entityType, setEntityType] = useState(null);
  const queryClient = useQueryClient();

  const { data: barData, isLoading } = useQuery({
    queryKey: [
      "dashboardGraphData",
      entity,
      category,
      entityType,
      i18n.language,
    ],
    queryFn: async () => {
      const res = await apiClient
        .post(i18n.language + "/get_usergraph_data", {
          json: {
            entity_id: entity,
            type_of_category: category,
            entity_type_id: entityType,
          },
        })
        .json<any>();

      return res?.data;
    },
  });

  const isAdmin = userSession?.user?.roles?.includes("admin");

  const { data: entityData } = useQuery({
    queryKey: ["dashboardEntityData", entityType, i18n.language],
    queryFn: async () => {
      const res = await apiClient
        .get(i18n.language + `/get_entity_by_type/${entityType}`)
        .json<any>();

      // console.log(res?.data, "ENTITY DATA");
      return res?.data;
    },
    enabled: !!entityType,
  });

  const entityChange = useCallback((value: any) => {
    setEntityType(value);
    setEntity([]);
  }, []);
  // useEffect(() => {
  //   if (entityType !== null) {
  //     queryClient.invalidateQueries({
  //       queryKey: ["dashboardEntityData", entityType, i18n.language],
  //     });
  //   }
  // }, [entityType, i18n.language, queryClient]);

  return (
    <div className="w-full flex flex-col gap-4 lg:gap-3 flex-1">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: delay, duration: 0.5, ease: "easeInOut" }}
      >
        <div className="flex justify-between flex-wrap gap-2 md:gap-4 items-center">
          <div className="flex">
            <SectionTitle size="small">
              <span>{t("top_performing_entities")}</span>
            </SectionTitle>
          </div>

          <div className="flex flex-wrap gap-4 justify-end   md:flex-1 w-full md:w-auto">
            {data?.categories && (
              <div className="flex w-full md:w-auto min-w-[200px]">
                <Select
                  value={category?.toString()}
                  onValueChange={(e) => {
                    // console.log("category", e);
                    setCategory(e);
                  }}
                >
                  <SelectTrigger
                    // label={t("category")}
                    hasValue={!!category}
                  >
                    <SelectValue placeholder={t("select_category")} />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.categories?.map((item: any) => (
                      <SelectItem
                        key={`category-${item.value}`}
                        value={item.value.toString()}
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {data?.entityTypes && (
              <div className="flex w-full md:w-auto min-w-[200px]">
                <Select
                  value={entityType ? entityType?.toString() : ""}
                  onValueChange={(val) => {
                    entityChange(val);
                  }}
                >
                  <SelectTrigger
                    // label={t("entity_types")}
                    hasValue={!!entityType}
                    onClear={() => setEntityType(null)}
                  >
                    <SelectValue placeholder={t("select_entity_type")} />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.entityTypes?.map((item: any) => (
                      <SelectItem
                        key={`entity_type-${item.value}`}
                        value={item.value.toString()}
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {entityData?.entities && (
              <div className="flex w-full md:w-auto">
                <MultiSelect
                  options={entityData?.entities}
                  onValueChange={setEntity}
                  defaultValue={entity}
                  responsive={{
                    mobile: { maxCount: 1, compactMode: true },
                    tablet: { maxCount: 1, compactMode: true },
                    desktop: { maxCount: 1, compactMode: true },
                  }}
                  placeholder={t("all_entity")}
                  searchPlaceholder={t("search_entity")}
                  hideSelectAll={true}
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
      <BarChart data={barData?.entityData} isLoading={isLoading} />
    </div>
  );
}
