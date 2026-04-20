import { useEffect, useRef, useState, type FormEvent } from "react";
// import ReCAPTCHA from "react-google-recaptcha";
// import RoutesBanner from '@/components/layouts/RoutesBanner'
import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api";
import RouteLoader from "@/components/layouts/RouteLoader";
import RoteError from "@/components/layouts/RoteError";
import { DefaultButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react";

import { Link } from "@tanstack/react-router";
import { toast } from "@/lib/toast";
import Cookies from "js-cookie";

import { useSetAtom, useAtomValue, getDefaultStore } from "jotai";
import { userSessionAtom, settingsAtom } from "@/store/atoms";

import { useForm } from "@tanstack/react-form";

// const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
// Get the store instance
const store = getDefaultStore();

export const Route = createFileRoute("/$lang/_lang/login")({
  component: RouteComponent,

  beforeLoad: async ({ location, params }) => {
    let userSession = store.get(userSessionAtom);
    const token = Cookies.get("auth_token");
    if (token || userSession?.accessToken) {
      throw redirect({
        to: `/${params.lang}/dashboard`,
      });
    }
  },
});

function RouteComponent() {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const setUserSession = useSetAtom(userSessionAtom);

  const settings = useAtomValue(settingsAtom);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        // const currentCaptchaToken = await recaptchaRef.current?.executeAsync();
        // if (!currentCaptchaToken) {
        //   toast.error("Failed to verify reCAPTCHA. Please try again.", {
        //     position: "bottom-center",
        //   });
        //   return;
        // }

        const res = await apiClient
          .post(i18n.language + "/login", {
            json: {
              email: value.email,
              password: value.password,
              // captchaToken: currentCaptchaToken,
            },
          })
          .json<any>();

        // console.log("LOGIN_DATA", res);

        if (res?.status) {
          loginDir(res);
        }

        // form.reset();
      } catch (error) {
        console.error("Request failed:", error);

        // recaptchaRef.current?.reset();
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const loginDir = (res: any) => {
    Cookies.set("auth_token", res?.access_token, {
      secure: true,
      sameSite: "strict",
      expires: 1,
    });
    setUserSession({
      accessToken: res?.access_token,
      user: res?.user,
    });
    // Navigate to the protected route
    navigate({
      to: `/${i18n.language}/dashboard`,
    });
  };

  let isLoading = false;
  let error = false;
  let isRefetching = false;

  return (
    <AnimatePresence mode={"wait"}>
      {isLoading || isRefetching ? (
        <RouteLoader key="login-loader" />
      ) : error ? (
        <RoteError key="login-error" />
      ) : (
        <div
          key="login-content"
          className="flex flex-col items-center justify-center w-full h-full flex-1"
        >
          <section className="w-full relative ">
            <motion.div
              className="container mx-auto relative z-10 flex flex-col items-center justify-center gap-4 md:gap-8"
              initial={{ opacity: 0, y: 100, scaleY: 1.1, skewY: 1.5 }}
              animate={{ opacity: 1, y: 0, scaleY: 1, skewY: 0 }}
              exit={{ opacity: 0, y: 50, scaleY: 1.1, skewY: 1.5 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <img
                src="/loginLogo.svg"
                alt=""
                className=" object-contain xl:h-[5rem] lg:h-[6rem] md:h-[5rem] h-[4rem] w-auto"
              />

              <div className="flex flex-col lg:flex-row rounded-[20px] overflow-hidden  min-h-[75vh] px-5 md:px-0 w-full">
                <Link
                  to={"/" + i18n.language}
                  className="flex-2/4 bg-[linear-gradient(190deg,#020355_-20.47%,#304FD0_90%)] p-10 px-[10%] flex flex-col items-center justify-center md:gap-8 gap-5"
                >
                  <img
                    src={"/logoShape.svg"}
                    alt={settings?.settings?.title || t("logo-text")}
                    className="h-auto object-contain lg:w-[5rem] md:w-[5rem] w-[4rem]"
                  />
                  <div className="font-medium text-[2.2rem] md:text-[2.7rem] lg:text-[2.45rem] text-text/80 relative block bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent  leading-[100%] text-center tracking-[.42px]">
                    {settings?.settings?.title || t("logo-text")}
                  </div>
                </Link>
                <div className="flex-2/3 bg-white p-5 md:p-10 flex flex-col justify-center gap-5">
                  <div className="font-medium text-[1.8rem] md:text-[2.4rem] lg:text-[2.25rem] relative text-black ltr:leading-[100%] rtl:leading-[120%]">
                    {t("login")}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      form.handleSubmit();
                    }}
                    className="flex flex-col gap-7"
                  >
                    <form.Field
                      name="email"
                      validators={{
                        onSubmit: ({ value }) =>
                          !value
                            ? t("email_required")
                            : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                              ? t("email_invalid")
                              : value?.length > 100
                                ? t("email_must_be_less_than_100_characters")
                                : null,
                      }}
                      children={(field) => (
                        <Input
                          id="email"
                          name="email"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          type="email"
                          label={t("email")}
                          className=""
                          error={
                            field.state.meta.errors.length > 0 ? true : false
                          }
                          errorMessage={t(field.state.meta.errors[0])}
                        />
                      )}
                    />

                    <form.Field
                      name="password"
                      validators={{
                        onSubmit: ({ value }) =>
                          !value
                            ? t("password_required")
                            : value?.length < 8
                              ? t("password_must_be_at_least_8_characters")
                              : null,
                      }}
                      children={(field) => (
                        <Input
                          id="password"
                          name="password"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          type="password"
                          label={t("password")}
                          className=""
                          error={
                            field.state.meta.errors.length > 0 ? true : false
                          }
                          errorMessage={t(field.state.meta.errors[0])}
                        />
                      )}
                    />

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

                    {/* <div className="flex justify-center w-full">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={RECAPTCHA_SITE_KEY} // Replace with your actual Invisible Site Key
                        size="invisible"
                      />
                    </div> */}

                    <DefaultButton
                      title={t("login")}
                      size="lg"
                      variant="dark"
                      type="submit"
                      onClick={form.handleSubmit}
                      disabled={isSubmitting}
                      isLoading={isSubmitting}
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
