import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api";
import { DefaultButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import DashboardLayout from "@/components/layouts/DashboardLayout";

import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { useNavigate } from "@tanstack/react-router";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "@/lib/toast";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import { Plus, RefreshCw, Camera, KeySquare } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useMobile } from "@/hooks/use-mobile";
import { useMemo } from "react";
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

export const Route = createFileRoute("/$lang/_lang/_auth/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userSession = useAtomValue(userSessionAtom);

  const [profileImage, setProfileImage] = useState(userSession?.user?.photo);

  const form = useForm({
    defaultValues: {
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const res = await apiClient
          .post(i18n.language + "/change-password", {
            json: {
              old_password: value.old_password,
              new_password: value.new_password,
              new_password_confirmation: value.new_password_confirmation,
            },
          })
          .json();

        console.log("PROFILE_DATA", res);

        if (res?.status) {
          toast.success(res?.message || t("success"));
          form.reset();
          // setTimeout(() => {
          //   navigate({
          //     to: `/${i18n.language}/profile`,
          //   });
          // }, 1500);
        }
      } catch (error) {
        console.error("Profile update error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: uploadImage, isPending: isImageUploading } = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiClient
        .post(i18n.language + `/update-profile-image`, {
          headers: {
            "Content-Type": undefined,
          },
          body: formData,
        })
        .json<any>();
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["userInfo", i18n.language],
      });
      toast.success(t("profile_image_updated_successfully"));
      router.invalidate();
    },
    onError: (error) => {
      console.error("Upload failed", error);
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("photo", file);
      uploadImage(formData);
    }
  };

  const profileAnimation = useMemo(() => {
    return {
      initial: {
        opacity: 0,
        ...(isMobile
          ? { y: -50, scale: 1.2, clipPath: "inset(0 0 100% 0)" }
          : i18n.language === "ar"
            ? { clipPath: "inset(0 0 0 100%)", scale: 1.2 }
            : { clipPath: "inset(0 100% 0 0)", scale: 1.2 }),
      },
      animate: {
        opacity: 1,
        ...(isMobile
          ? { y: 0, scale: 1, clipPath: "inset(0 0 0 0)" }
          : { clipPath: "inset(0 0 0 0)", scale: 1 }),
      },
    };
  }, [isMobile, i18n.language]);

  return (
    <DashboardLayout isLoading={false} title={t("my_profile")}>
      <div className="grid lg:grid-cols-[400px_2fr] grid-cols-1 bg-[linear-gradient(270deg,rgba(2,46,228,0.07)_0%,rgba(255,201,157,0.07)_100%)] rounded-xl overflow-hidden">
        <motion.div
          key={`${isMobile}-${i18n.language}`}
          initial={profileAnimation.initial}
          animate={profileAnimation.animate}
          transition={{
            delay: 0.1,
            // duration: 1,
            type: "spring",
            stiffness: 30,
          }}
          className="flex bg-[linear-gradient(100deg,#FFC99D_-20%,#022EE4_120%)] rounded-xl overflow-hidden "
        >
          <div className="flex flex-col items-center w-full px-5 md:px-[20%] py-5  md:py-10 lg:pt-[4rem] lg:pb-4">
            <Avatar size="lg">
              <AvatarImage
                src={profileImage}
                alt={userSession?.user?.name}
                className=""
                isLoading={isImageUploading}
              />
              <AvatarFallback className="rounded-[5px]  ">
                {userSession?.user?.first_name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
              <div
                className="absolute bottom-3 ltr:right-3 rtl:left-3 w-11 h-11 rounded-full  flex items-center justify-center bg-[linear-gradient(270deg,rgba(2,46,228,0.7)_0%,rgba(255,201,157,0.7)_100%)] cursor-pointer group hover:scale-110 transition-all duration-200"
                onClick={() => document.getElementById("imageUpload")?.click()}
              >
                <Camera className="size-6 text-white group-hover:scale-80 transition-all duration-200 pointer-events-none" />
              </div>
              <input
                type="file"
                id="imageUpload"
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
              />
            </Avatar>
            <div className="flex flex-col items-center mt-3 text-center">
              <h1 className="text-4xl font-semibold text-white ">
                {userSession?.user?.name}
              </h1>
              <p className="text-xl text-white ">
                {userSession?.user?.designation}
              </p>
            </div>
          </div>
        </motion.div>
        <div className="flex p-5 md:p-10">
          <div className="flex flex-col gap-10 md:gap-15 w-full">
            <motion.div
              key={`formBox1-${i18n.language}`}
              initial={{
                y: 50,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{
                delay: 0,
                duration: 0.5,
                type: "spring",
                stiffness: 50,
              }}
              className="flex flex-col gap-7 w-full"
            >
              <div className="font-medium text-[1.8rem] md:text-[2rem] xl:text-[2.25rem] relative text-black ltr:leading-[100%] rtl:leading-[120%] font-semibold">
                {t("user_details")}
              </div>
              <Input
                id="emailId"
                name="emailId"
                disabled={true}
                readOnly={true}
                value={userSession?.user?.email}
                label={t("email_id")}
              />
              <Input
                id="emirate"
                name="emirate"
                disabled={true}
                readOnly={true}
                value={userSession?.user?.userEmirateName}
                label={t("emirate")}
              />
              <Input
                id="phone"
                name="phone"
                disabled={true}
                readOnly={true}
                value={userSession?.user?.phone}
                label={t("phone")}
              />
              <Input
                id="entity"
                name="entity"
                disabled={true}
                readOnly={true}
                value={userSession?.user?.entity_title}
                label={t("entity")}
              />
            </motion.div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="w-full"
            >
              <motion.div
                key={`formBox2-${i18n.language}`}
                initial={{
                  y: 50,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                transition={{
                  delay: 0.3,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 50,
                }}
                className="flex flex-col gap-7 w-full"
              >
                <div className="font-medium text-[1.8rem] md:text-[2rem] xl:text-[2.25rem] relative text-black ltr:leading-[100%] rtl:leading-[120%] font-semibold">
                  {t("update_password")}
                </div>
                <form.Field
                  name="old_password"
                  validators={{
                    onSubmit: ({ value }) => {
                      if (!value) return t("password_required");
                    },
                  }}
                  children={(field) => (
                    <div className="flex flex-col relative ">
                      <Input
                        id="old_password"
                        name="old_password"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="password"
                        label={t("current_password")}
                        className=""
                        error={
                          field.state.meta.errors.length > 0 ? true : false
                        }
                        errorMessage={t(field.state.meta.errors[0])}
                      />
                    </div>
                  )}
                />
                <form.Field
                  name="new_password"
                  validators={{
                    onChange: ({ value }) => {
                      if (
                        value.length <
                        Number(import.meta.env?.PASSWORDLIMITE || 8)
                      )
                        return t(
                          `password_must_be_at_least_${Number(import.meta.env?.PASSWORDLIMITE || 8)}_characters`,
                        );
                      if (!/[a-z]/.test(value) || !/[A-Z]/.test(value))
                        return t("password_must_include_mixed_case");
                      if (!/[0-9]/.test(value))
                        return t("password_must_include_numbers");
                      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
                        return t("password_must_include_symbols");
                    },
                    onSubmit: ({ value }) => {
                      if (!value) return t("password_required");
                      if (
                        value.length <
                        Number(import.meta.env?.PASSWORDLIMITE || 8)
                      )
                        return t(
                          `password_must_be_at_least_${Number(import.meta.env?.PASSWORDLIMITE || 8)}_characters`,
                        );
                      if (!/[a-z]/.test(value) || !/[A-Z]/.test(value))
                        return t("password_must_include_mixed_case");
                      if (!/[0-9]/.test(value))
                        return t("password_must_include_numbers");
                      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
                        return t("password_must_include_symbols");

                      const result = zxcvbn(value);
                      if (result.score < 3) {
                        return result.feedback.warning
                          ? t(result.feedback.warning)
                          : t("password_is_too_weak");
                      }
                      return null;
                    },
                  }}
                  children={(field) => {
                    const strength = zxcvbn(field.state.value || "");
                    return (
                      <div className="flex flex-col relative ">
                        <Input
                          id="new_password"
                          name="new_password"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          type="password"
                          label={t("new_password")}
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
                                strength.score <= 1
                                  ? "bg-red-500"
                                  : strength.score === 2
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                              style={{
                                width: `${(strength.score + 1) * 20}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
                <form.Field
                  name="new_password_confirmation"
                  validators={{
                    onChange: ({ value, fieldApi }) => {
                      if (!value) return t("password_required");
                      if (
                        value !== fieldApi.form.getFieldValue("new_password")
                      ) {
                        return t("passwords_do_not_match");
                      }
                      return null;
                    },
                  }}
                  children={(field) => {
                    const strength = zxcvbn(field.state.value || "");
                    return (
                      <div className="flex flex-col relative ">
                        <Input
                          id="new_password_confirmation"
                          name="new_password_confirmation"
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
                                strength.score <= 1
                                  ? "bg-red-500"
                                  : strength.score === 2
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                              style={{
                                width: `${(strength.score + 1) * 20}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }}
                />

                <div className="flex gap-2 ">
                  <DefaultButton
                    title={t("update_password")}
                    size="lg"
                    variant="dark"
                    type="submit"
                    onClick={form.handleSubmit}
                    icon={<KeySquare className="size-5" />}
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                  />
                  <DefaultButton
                    title={t("cancel")}
                    size="lg"
                    variant="default"
                    type="button"
                    onClick={() => form.reset()}
                    icon={<RefreshCw className="size-5" />}
                  />
                </div>
              </motion.div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
