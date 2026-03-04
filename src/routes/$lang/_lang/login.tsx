// import RoutesBanner from '@/components/layouts/RoutesBanner'
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api";
import RouteLoader from "@/components/layouts/RouteLoader";
import RoteError from "@/components/layouts/RoteError";
import { DefaultButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react";

import { Link } from "@tanstack/react-router";
export const Route = createFileRoute("/$lang/_lang/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  // const { data, isLoading, error, isRefetching } = useQuery({
  //   queryKey: ['about', i18n.language],
  //   refetchOnMount: true,
  //   refetchOnWindowFocus: true,
  //   staleTime: 1000 * 60 * 60 * 24,
  //   enabled: true,
  //   queryFn: async () => {
  //     try{
  //       const res = await apiClient.get( i18n.language + '/about').json()
  //       // console.log('ABOUT_DATA', res?.data)
  //       return res?.data
  //     }catch(error) {
  //       console.log('ABOUT_DATA_ERROR', error)
  //       return null
  //     }
  //   },
  // })

  let isLoading = false;
  let error = false;
  let isRefetching = false;

  const data = {
    title: "RI Unified Master Database",
    loginTitle: "Login/Sign up",
  };

  return (
    <AnimatePresence mode={"wait"}>
      {isLoading || isRefetching ? (
        <RouteLoader key="about-loader" />
      ) : error ? (
        <RoteError key="about-error" />
      ) : (
        <div
          key="about-content"
          className="flex flex-col items-center justify-center w-full h-full flex-1"
        >
          <section className="w-full relative ">
            <motion.div
              className="container mx-auto relative z-10 "
              initial={{ opacity: 0, y: 100, scaleY: 1.1, skewY: 1.5 }}
              animate={{ opacity: 1, y: 0, scaleY: 1, skewY: 0 }}
              exit={{ opacity: 0, y: 50, scaleY: 1.1, skewY: 1.5 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="flex flex-col lg:flex-row rounded-[20px] overflow-hidden  min-h-[75vh] px-5 md:px-0">
                <div className="flex-2/4 bg-[linear-gradient(190deg,#020355_-20.47%,#304FD0_90%)] p-10 px-[10%] flex flex-col items-center justify-center md:gap-8 gap-5">
                  <img
                    src={"/logoShape.svg"}
                    alt="Regulatory Intelligence Logo"
                    className="h-auto object-contain lg:w-[5rem] md:w-[5rem] w-[4rem]"
                  />
                  <div className="font-medium text-[2.2rem] md:text-[2.7rem] lg:text-[2.45rem]    text-text/80 relative block bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent  leading-[100%] text-center tracking-[.42px]">
                    {data.title}
                  </div>
                </div>
                <div className="flex-2/3 bg-white p-5 md:p-10 flex flex-col justify-center gap-5">
                  <div className="font-medium text-[1.8rem] md:text-[2.4rem] lg:text-[2.25rem] relative text-black ">
                    {data.loginTitle}
                  </div>
                  <form action="#" className="flex flex-col gap-7">
                    <Input type="email" placeholder={t("email")} />
                    <Input type="password" placeholder={t("password")} />

                    <div className="relative flex items-center gap-2">
                      <label className="text-[1.2rem] text-black font-secondary">
                        {t("forgot_password")}
                      </label>
                      <Link
                        to={"/" + i18n.language + "/forgot-password"}
                        className="text-[1.2rem] text-black font-secondary underline text-secondary hover:text-primary transition-colors duration-300"
                      >
                        <span>{t("reset")}</span>
                      </Link>
                    </div>
                    <DefaultButton
                      title={t("login")}
                      size="lg"
                      variant="dark"
                      onClick={() => {
                        navigate({
                          to: `/${i18n.language}/dashboard`,
                        });
                      }}
                    />
                  </form>
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      )}
    </AnimatePresence>
  );
}
