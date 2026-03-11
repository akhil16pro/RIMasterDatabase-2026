import AppHeader from "@/components/layouts/AppHeader";
import { apiClient } from "@/api";
import RoteError from "@/components/layouts/RoteError";
import RouteLoader from "@/components/layouts/RouteLoader";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import i18n from "@/lang";
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

  const [isLoading, setIsLoading] = useState(true);
  let error = false;
  const [isRefetching, setIsRefetching] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setIsRefetching(false);
    }, 800);
  }, []);

  const data = {
    title:
      i18n.language === "ar"
        ? "مكتب الاستخبارات التنظيمية"
        : "Regulatory Intelligence Office",
    subtitle:
      i18n.language === "ar"
        ? "المعلومات التنظيمية في حكومة دولة الإمارات العربية المتحدة"
        : "Regulatory Intelligence in the Government of the United Arab Emirates",
    description:
      i18n.language === "ar"
        ? "<p>أنشأت حكومة دولة الإمارات العربية المتحدة مكتب الاستخبارات التنظيمية لتصميم وإدارة نظام تشريعي ذكي ومتكامل يُعيد تعريف آلية سنّ القوانين في الدولة. ويعتمد هذا النظام على نهجٍ يرتكز على الذكاء الاصطناعي، مُمثلاً نموذجاً مُستقبلياً للحوكمة، يجمع بين الذكاء البشري وكفاءة الذكاء الاصطناعي لإنتاج تشريعات تُسهم في تحسين جودة الحياة في جميع أنحاء الإمارات.</p><p>سيعتمد المكتب على تقنيات مُتقدمة لتحليل القوانين القائمة، والكشف عن الثغرات التشريعية، واقتراح تعديلات قائمة على البيانات استناداً إلى أفضل الممارسات العالمية، وصياغة وتحديث اللوائح. كما سيُحاكي المكتب أثر القوانين قبل إصدارها، لضمان فعاليتها وكفاءتها واستجابتها للتغيرات المجتمعية والتكنولوجية.</p><p>ومن خلال هذه المبادرات، يضمن المكتب أن تصبح التشريعات أكثر مرونة واستجابة، مع تقليل التعقيد والتناقضات القانونية. كما يُعزز التوازن الأمثل بين التنظيم والابتكار، بما يتماشى مع متطلبات العصر الرقمي.</p><p>سيحظى مكتب الاستخبارات التنظيمية بدعم فريق من مصممي الأنظمة التشريعية - خبراء في البيانات التشريعية، ومتخصصين في الذكاء الاصطناعي، ومحللين، ومجتمع الاستخبارات التنظيمية الأوسع - الذين يعملون معًا على هندسة النظام التشريعي بأكمله. وسيوجهون عمل وكلاء الذكاء الاصطناعي المتخصصين المسؤولين عن المهام التشغيلية.</p>"
        : "<p>The Regulatory Intelligence Office was established by the UAE Government to design and manage a smart and integrated legislative system that redefines how laws are created in the country. This system is based on an AI-first approach, representing the next-generation model of governance—merging human intelligence with the efficiency of artificial intelligence to produce legislation that enables a better quality of life across the UAE.</p><p>The office will rely on advanced technologies to analyze existing laws, detect legislative gaps, propose data-driven amendments based on global best practices, and draft and update regulations. It will also simulate the impact of laws before they are issued, ensuring they are effective, efficient, and responsive to societal and technological changes.</p><p>Through these initiatives, the office ensures that legislation becomes more agile and responsive while reducing complexity and legal inconsistencies. It also promotes a healthy balance between regulation and innovation, aligned with the demands of the digital age.</p><p>The Regulatory Intelligence Office will be supported by a team of “Legislative System Designers”—experts in legislative data, AI specialists, analysts, and the broader regulatory intelligence community—who collaboratively engineer the entire legislative ecosystem. They will guide the work of specialized AI agents responsible for operational tasks.</p>",
  };

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
          <AppHeader delay={2.4} />
          <HomeBanner data={data} />
        </div>
      )}
    </AnimatePresence>
  );
}

function HomeBanner({ data }: { data: any }) {
  const { t } = useTranslation();
  const { scrollY } = useScroll();

  const heroTranslateY = useTransform(scrollY, [0, 380], [0, -70]);
  const heroScale = useTransform(scrollY, [0, 380], [1, 0.8]);
  const heroOpacity = useTransform(scrollY, [0, 380], [1, 0]);

  const moreCircle = useTransform(scrollY, [0, 480], [0, 360], {
    clamp: false,
  });
  return (
    <section
      className="w-full h-auto relative xl:pt-[30vh] lg:pt-[25vh] md:pt-[20vh] pt-[25vh] "
      id="home-banner"
    >
      <motion.div
        initial={{ opacity: 0, y: 0, scale: 1.4 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 0, scale: 1.4 }}
        transition={{ duration: 1, type: "linear", delay: 0.2 }}
        // style={{ y: cityTranslateY, scale: cityScale, opacity: cityOpacity }}
        className="fixed top-0 left-0 w-full h-screen mask-t-from-50% [&:after]:content-[''] [&:after]:absolute [&:after]:inset-0 [&:after]:bg-black/10 pointer-events-none"
      >
        {/* [&:after]:content-[''] [&:after]:absolute [&:after]:bottom-[-2px] [&:after]:left-0 [&:after]:w-full [&:after]:h-[50%] [&:after]:bg-gradient-to-b [&:after]:from-transparent [&:after]:to-primary  [&:before]:content-[''] [&:before]:absolute [&:before]:top-[-2px] [&:before]:left-0 [&:before]:w-full [&:before]:h-[50%] [&:before]:bg-gradient-to-t [&:before]:from-transparent [&:before]:to-bg  */}
        <picture className="w-full h-full">
          <source srcSet={"/homeBg.webp"} type="image/webp" />
          <source srcSet={"/homeBg.png"} type="image/png" />
          <img
            src={"/homeBg.png"}
            alt="Home Banner City"
            className="w-full h-full object-cover mask-b-from-50%"
          />
        </picture>
        {/* <img
          src={"/homeBg.png"}
          alt="Home Banner City"
          className="w-full h-full object-cover mask-b-from-50%"
        /> */}
      </motion.div>
      <div className="relative w-full  flex items-center justify-center">
        <motion.div
          // style={{ y: heroTranslateY, scale: heroScale, opacity: heroOpacity }}
          className="container mx-auto relative z-10 "
        >
          <div className="block xl:min-w-[68%] xl:max-w-[68%] lg:min-w-[75%] lg:max-w-[75%] md:min-w-[85%] md:max-w-[85%] min-w-[90%] max-w-[90%] relative m-auto">
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
                  className={cn(
                    "md:text-[6rem] lg:text-[8rem] xl:text-[9rem] text-6xl font-bold relative flex flex-wrap items-center justify-center gap-4 leading-[95%]",
                  )}
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
                  className={cn(
                    "text-[1.8rem] md:text-[2.2rem] lg:text-[2.45rem] xl:text-[2.7rem] font-regular mt-[1rem] md:mt-[2rem] lg:mt-[3rem] text-text/80 relative block bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent md:px-[15%]",
                    i18n.language === "ar"
                      ? "rtl:leading-[130%]"
                      : "ltr:leading-[100%]",
                  )}
                >
                  {data?.subtitle}
                </motion.h3>
              ) : null}
            </motion.div>
            {data?.description ? (
              <div className="flex flex-col relative ">
                <motion.div
                  initial={{ opacity: 0, y: 50, scaleY: 1.1, skewY: 2 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1, skewY: 0 }}
                  exit={{ opacity: 0, y: 50, scaleY: 1.1, skewY: 2 }}
                  transition={{ duration: 1.2, delay: 1.8 }}
                  className="text-content-area text-center mt-[2rem] lg:mt-[3rem] [&>p]:text-2xl"
                  dangerouslySetInnerHTML={{ __html: data?.description }}
                ></motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 150 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 2 }}
                  className="moreWrap flex items-center justify-center py-5 sticky bottom-0 [&:after]:content-[''] [&:after]:absolute [&:after]:bottom-[-2px] [&:after]:left-[50%] [&:after]:translate-x-[-50%] [&:after]:w-[100vw] [&:after]:h-[100%] [&:after]:bg-gradient-to-b [&:after]:from-transparent [&:after]:to-primary [&:after]:z-[-1] "
                >
                  <a
                    href="#"
                    className="more relative text-[1.3rem] font-regular"
                  >
                    <span className="absolute top-[50%] ltr:left-0 rtl:right-0 translate-y-[-50%] bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent">
                      {t("scroll")}
                    </span>
                    <motion.div
                      className="iconBox w-[4rem] aspect-square"
                      style={{ rotate: moreCircle }}
                    >
                      <svg
                        className="w-full h-auto"
                        width="74"
                        height="74"
                        viewBox="0 0 74 74"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="37"
                          cy="37"
                          r="33"
                          stroke="url(#paint0_linear_133_77)"
                          strokeWidth="8"
                          strokeDasharray="2 4"
                        />
                        <defs>
                          <linearGradient
                            id="paint0_linear_133_77"
                            x1="67.7639"
                            y1="44.7234"
                            x2="4"
                            y2="44.7234"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#03CBFF" />
                            <stop
                              offset="1"
                              stopColor="white"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  </a>
                </motion.div>
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
