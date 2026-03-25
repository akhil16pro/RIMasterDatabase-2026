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
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";
import { redirect } from "@tanstack/react-router";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";

type PasswordResetSearch = {
  code?: string;
};

const options = {
  translations: zxcvbnCommonPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.commonDictionary,
  },
};
zxcvbnOptions.setOptions(options);

export const Route = createFileRoute("/$lang/_lang/reset-password")({
  validateSearch: (search: Record<string, unknown>): PasswordResetSearch => {
    return {
      code: search.code as string | undefined,
    };
  },

  beforeLoad: async ({ params, search }) => {
    if (!search.code) {
      throw redirect({
        to: "/$lang/login",
        params: { lang: params.lang },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { t, i18n } = useTranslation();
  const settings = useAtomValue(settingsAtom);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      password: "",
      password_confirmation: "",
      code: Route.useSearch().code,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const res = await apiClient
          .post(i18n.language + "/reset-password", {
            json: {
              password: value.password,
              password_confirmation: value.password_confirmation,
              code: value.code,
            },
          })
          .json();

        // console.log("RESET_DATA", res);

        if (res?.status) {
          toast.success(res?.message || t("success"));
          form.reset();
          setTimeout(() => {
            navigate({
              to: `/${i18n.language}/login`,
            });
          }, 1000);
        } else {
          toast.error(res?.message || t("error-occurred"));
        }
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
                    {t("reset_password")}
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
                      name="password"
                      validators={{
                        onSubmit: ({ value }) => {
                          if (!value) return t("password-required");

                          const result = zxcvbn(value);

                          if (result.score < 3) {
                            return result.feedback.warning
                              ? t(result.feedback.warning)
                              : t("password-is-too-weak");
                          }

                          return null;
                        },
                      }}
                      children={(field) => (
                        <div className="flex flex-col relative ">
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
                          {field.state.value && (
                            <div className=" absolute inset-0 overflow-hidden opacity-50 flex items-end pointer-events-none">
                              <div
                                className={`h-[2px] transition-all duration-300 ${
                                  zxcvbn(field.state.value).score <= 1
                                    ? "bg-red-500"
                                    : zxcvbn(field.state.value).score === 2
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                                style={{
                                  width: `${(zxcvbn(field.state.value).score + 1) * 20}%`,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    />
                    <form.Field
                      name="password_confirmation"
                      validators={{
                        onSubmit: ({ value, fieldApi }) =>
                          !value
                            ? t("password-required")
                            : value?.length < 8
                              ? t("password-must-be-at-least-8-characters")
                              : value !==
                                  fieldApi.form.getFieldValue("password")
                                ? t("passwords-do-not-match")
                                : null,
                      }}
                      children={(field) => (
                        <div className="flex flex-col relative ">
                          <Input
                            id="password_confirmation"
                            name="password_confirmation"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type="password"
                            label={t("confirm_password")}
                            className=""
                            error={
                              field.state.meta.errors.length > 0 ? true : false
                            }
                            errorMessage={
                              field.state.meta.errors[0]
                                ? t(field.state.meta.errors[0] as string)
                                : ""
                            }
                          />
                          {field.state.value && (
                            <div className=" absolute inset-0 overflow-hidden opacity-50 flex items-end pointer-events-none">
                              <div
                                className={`h-[2px] transition-all duration-300 ${
                                  zxcvbn(field.state.value).score <= 1
                                    ? "bg-red-500"
                                    : zxcvbn(field.state.value).score === 2
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                                style={{
                                  width: `${(zxcvbn(field.state.value).score + 1) * 20}%`,
                                }}
                              />
                            </div>
                          )}
                        </div>
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
