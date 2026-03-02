import { apiClient } from "@/api";
import RoteError from "@/components/layouts/RoteError";
import RouteLoader from "@/components/layouts/RouteLoader";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useMemo, useRef } from "react";
import parse from "html-react-parser";
import { Circle } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import { isMobile } from "react-device-detect";

import HomeData from "@/store/home.json";

export const Route = createFileRoute("/$lang/_lang/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { i18n } = useTranslation();

  // const { data, isLoading, error, isRefetching } = useQuery({
  //   queryKey: ['home', i18n.language],
  //   refetchOnMount: true,
  //   refetchOnWindowFocus: true,
  //   staleTime: 1000 * 60 * 60 * 24,
  //   enabled: true,
  //   queryFn: async () => {
  //     try {
  //       const res = await apiClient.get(i18n.language + '/home').json()
  //       console.log('HOME_DATA', res?.data)
  //       return res?.data
  //     } catch (error) {
  //       console.log('HOME_DATA_ERROR', error)
  //       return null
  //     }
  //   },
  // })

  let isLoading = false;
  let error = false;
  let isRefetching = false;

  const data = HomeData;

  return (
    <AnimatePresence mode={"wait"}>
      {isLoading || isRefetching ? (
        <RouteLoader key="about-loader" />
      ) : error ? (
        <RoteError key="about-error" />
      ) : (
        <div
          key="home-content"
          className="flex flex-col items-center justify-center w-full min-h-screen flex-1"
        >
          <HomeBanner data={data} />
        </div>
      )}
    </AnimatePresence>
  );
}

function HomeBanner({ data }: { data: any }) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 380], [1, 0]);
  const translateY = useTransform(scrollY, [0, 380], [0, -180]);
  const cityTranslateY = useTransform(scrollY, [0, 380], [0, -120]);
  const cityScale = useTransform(scrollY, [0, 380], [1, 1.15]);
  const cityOpacity = useTransform(scrollY, [180, 480], [1, 0]);

  const heroTranslateY = useTransform(scrollY, [0, 380], [0, -70]);
  const heroScale = useTransform(scrollY, [0, 380], [1, 0.8]);
  const heroOpacity = useTransform(scrollY, [0, 380], [1, 0]);

  return (
    <section
      className="w-full h-auto relative pt-[30vh] pb-10"
      id="home-banner"
    >
      <motion.div
        initial={{ opacity: 1, y: 0, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 120, scale: 1.15 }}
        transition={{ duration: 1.2, type: "tween", delay: 1.5 }}
        // style={{ y: cityTranslateY, scale: cityScale, opacity: cityOpacity }}
        className="absolute top-0 left-0 w-full h-screen mask-t-from-50%"
      >
        {/* [&:after]:content-[''] [&:after]:absolute [&:after]:bottom-[-2px] [&:after]:left-0 [&:after]:w-full [&:after]:h-[50%] [&:after]:bg-gradient-to-b [&:after]:from-transparent [&:after]:to-primary  [&:before]:content-[''] [&:before]:absolute [&:before]:top-[-2px] [&:before]:left-0 [&:before]:w-full [&:before]:h-[50%] [&:before]:bg-gradient-to-t [&:before]:from-transparent [&:before]:to-bg  */}

        <img
          src={"/homeBg.png"}
          alt="Home Banner City"
          className="w-full h-full object-cover mask-b-from-50%"
        />
      </motion.div>
      <div className="relative w-full  flex items-center justify-center">
        <motion.div
          // style={{ y: heroTranslateY, scale: heroScale, opacity: heroOpacity }}
          className="container mx-auto relative z-10 "
        >
          <div className="block md:min-w-[68%] md:max-w-[68%] min-w-[90%] max-w-[90%] relative m-auto">
            <motion.div
              layout
              initial={{
                clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
              }}
              animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
              exit={{ clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)" }}
              transition={{ duration: 1, delay: 1.2 }}
              className="flex flex-col items-center justify-center text-center"
            >
              {data?.title ? (
                <motion.h1
                  style={{
                    y: heroTranslateY,
                    scale: heroScale,
                    opacity: heroOpacity,
                  }}
                  transition={{
                    duration: 0.8,
                    type: "tween",
                    ease: "easeOut",
                    delay: 0.8,
                  }}
                  className="md:text-[8rem] xl:text-[9rem] text-5xl font-bold relative flex flex-wrap items-center justify-center gap-4 leading-[95%]"
                >
                  <span className="inline-block relative">{data?.title}</span>
                </motion.h1>
              ) : null}
              {data?.subtitle ? (
                <motion.h3
                  layout
                  initial={{ opacity: 0, y: 50, scaleY: 1.1, skewY: 2 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1, skewY: 0 }}
                  exit={{ opacity: 0, y: 50, scaleY: 1.1, skewY: 2 }}
                  transition={{ duration: 1.2, delay: 1.5 }}
                  className="text-[2.45rem] xl:text-[2.7rem] font-regular mt-[3rem] text-text/80 relative block bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent px-[15%] leading-[100%]"
                >
                  {data?.subtitle}
                </motion.h3>
              ) : null}
            </motion.div>
            {data?.description ? (
              <motion.div
                initial={{ opacity: 0, y: 50, scaleY: 1.1, skewY: 2 }}
                animate={{ opacity: 1, y: 0, scaleY: 1, skewY: 0 }}
                exit={{ opacity: 0, y: 50, scaleY: 1.1, skewY: 2 }}
                transition={{ duration: 1.2, delay: 1.8 }}
                className="text-content-area text-center mt-[3rem] [&>p]:text-2xl"
                dangerouslySetInnerHTML={{ __html: data?.description }}
              ></motion.div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
