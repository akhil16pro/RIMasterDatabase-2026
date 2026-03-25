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
import { settingsAtom } from "@/routes/__root";
import { useAtomValue } from "jotai";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/$lang/_lang/forgot-password")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t, i18n } = useTranslation();
  const settings = useAtomValue(settingsAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const res = await apiClient
          .post(i18n.language + "/forgot-password", {
            json: {
              email: value.email,
            },
          })
          .json();

        // form.reset();
      } catch (error) {
        if (error?.name === "HTTPError") {
          try {
            const errorData = await error?.response?.json();

            if (errorData?.status) {
              toast.success(errorData?.message);
              form.reset();
              setTimeout(() => {
                navigate({
                  to: `/${i18n.language}/login`,
                });
              }, 1000);
            } else {
              toast.error(errorData?.message || t("error-occurred"));
            }
          } catch (parseError) {
            toast.error(t("error-occurred"));
          }
        } else {
          // 3. Handle network errors or syntax errors
          console.error("Generic Error:", error);
          toast.error(t("error-occurred"));
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

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
              className="container mx-auto relative z-10 "
              initial={{ opacity: 0, y: 100, scaleY: 1.1, skewY: 1.5 }}
              animate={{ opacity: 1, y: 0, scaleY: 1, skewY: 0 }}
              exit={{ opacity: 0, y: 50, scaleY: 1.1, skewY: 1.5 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="flex flex-col lg:flex-row rounded-[20px] overflow-hidden  min-h-[75vh] px-5 md:px-0">
                <Link
                  to={"/" + i18n.language}
                  className="flex-2/4 bg-[linear-gradient(190deg,#020355_-20.47%,#304FD0_90%)] p-10 px-[10%] flex flex-col items-center justify-center md:gap-8 gap-5"
                >
                  <img
                    src={"/logoShape.svg"}
                    alt="Regulatory Intelligence Logo"
                    className="h-auto object-contain lg:w-[5rem] md:w-[5rem] w-[4rem]"
                  />
                  <div className="font-medium text-[2.2rem] md:text-[2.7rem] lg:text-[2.45rem]    text-text/80 relative block bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent  leading-[100%] text-center tracking-[.42px]">
                    {settings?.settings?.title || t("logo-text")}
                  </div>
                </Link>
                <div className="flex-2/3 bg-white p-5 md:p-10 flex flex-col justify-center gap-5">
                  <div className="font-medium text-[1.8rem] md:text-[2.4rem] lg:text-[2.25rem] relative text-black ltr:leading-[100%] rtl:leading-[120%]">
                    {t("forgot_password")}
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
                            ? t("email-required")
                            : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                              ? t("email-invalid")
                              : value?.length > 100
                                ? t("email-must-be-less-than-100-characters")
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

                    <div className="relative flex items-center gap-2">
                      <label className="text-[1.2rem] text-black font-secondary">
                        {t("already_have_an_account")}
                      </label>
                      <Link
                        to={"/" + i18n.language + "/login"}
                        className="text-[1.2rem] text-black font-secondary underline text-secondary hover:text-primary transition-colors duration-300"
                      >
                        <span>{t("login")}</span>
                      </Link>
                    </div>
                    <DefaultButton
                      title={t("submit")}
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
