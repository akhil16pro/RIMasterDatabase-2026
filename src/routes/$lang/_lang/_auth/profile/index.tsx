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
import { toast } from "sonner";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import { Plus, RefreshCw, Camera } from "lucide-react";
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
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userSession = useAtomValue(userSessionAtom);

  const [profileImage, setProfileImage] = useState(userSession?.user?.photo);

  const form = useForm({
    defaultValues: {
      emailId: userSession?.user?.email,
      phone: userSession?.user?.phone,
      entity: userSession?.user?.entity_title,
      emirate: userSession?.user?.userEmirateName,
      current_password: "",
      password: "",
      password_confirmation: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const res = await apiClient
          .post(i18n.language + "/profile/update", {
            json: {
              current_password: value.current_password,
              password: value.password,
              password_confirmation: value.password_confirmation,
            },
          })
          .json();

        console.log("PROFILE_DATA", res);

        if (res?.status) {
          toast.success(res?.message || t("success"));
          form.reset();
          setTimeout(() => {
            navigate({
              to: `/${i18n.language}/profile/update`,
            });
          }, 1500);
        }
      } catch (error) {
        console.error("Profile update error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsImageUploading(true);
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("photo", file);
      console.log("FILE", file);
      setProfileImage(URL.createObjectURL(file));
      setTimeout(() => {
        setIsImageUploading(false);
      }, 1000);
    }
  };

  return (
    <DashboardLayout isLoading={false} title={t("my_profile")}>
      <div className="grid lg:grid-cols-[400px_2fr] grid-cols-1 bg-[linear-gradient(270deg,rgba(2,46,228,0.07)_0%,rgba(255,201,157,0.07)_100%)] rounded-xl overflow-hidden">
        <div className="flex bg-[linear-gradient(100deg,#FFC99D_-20%,#022EE4_120%)] rounded-xl overflow-hidden ">
          <div className="flex flex-col items-center w-full px-5 md:px-[20%] py-5  md:py-10 lg:pt-[4rem] lg:pb-4">
            <Avatar size="lg">
              <AvatarImage
                src={profileImage}
                alt={userSession?.user?.name}
                className=""
                isloading={isImageUploading}
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
        </div>
        <div className="flex p-5 md:p-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-10 md:gap-15 w-full"
          >
            <div className="flex flex-col gap-7 w-full">
              <div className="font-medium text-[1.8rem] md:text-[2rem] xl:text-[2.25rem] relative text-black ltr:leading-[100%] rtl:leading-[120%] font-semibold">
                {t("user_details")}
              </div>
              <form.Field
                name="emailId"
                children={(field) => (
                  <div className="flex flex-col relative ">
                    <Input
                      id="emailId"
                      name="emailId"
                      disabled={true}
                      readOnly={true}
                      value={field.state.value}
                      label={t("email_id")}
                    />
                  </div>
                )}
              />
              <form.Field
                name="emirate"
                children={(field) => (
                  <div className="flex flex-col relative ">
                    <Input
                      id="emirate"
                      name="emirate"
                      disabled={true}
                      readOnly={true}
                      value={field.state.value}
                      label={t("emirate")}
                    />
                  </div>
                )}
              />
              <form.Field
                name="phone"
                children={(field) => (
                  <div className="flex flex-col relative ">
                    <Input
                      id="phone"
                      name="phone"
                      disabled={true}
                      readOnly={true}
                      value={field.state.value}
                      label={t("phone")}
                    />
                  </div>
                )}
              />
              <form.Field
                name="entity"
                children={(field) => (
                  <div className="flex flex-col relative ">
                    <Input
                      id="entity"
                      name="entity"
                      disabled={true}
                      readOnly={true}
                      value={field.state.value}
                      label={t("entity")}
                    />
                  </div>
                )}
              />
            </div>
            <div className="flex flex-col gap-7 w-full">
              <div className="font-medium text-[1.8rem] md:text-[2rem] xl:text-[2.25rem] relative text-black ltr:leading-[100%] rtl:leading-[120%] font-semibold">
                {t("update_password")}
              </div>
              <form.Field
                name="current_password"
                validators={{
                  onSubmit: ({ value }) => {
                    if (!value) return t("password_required");
                  },
                }}
                children={(field) => (
                  <div className="flex flex-col relative ">
                    <Input
                      id="current_password"
                      name="current_password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="password"
                      label={t("current_password")}
                      className=""
                      error={field.state.meta.errors.length > 0 ? true : false}
                      errorMessage={t(field.state.meta.errors[0])}
                    />
                  </div>
                )}
              />
              <form.Field
                name="password"
                validators={{
                  onSubmit: ({ value }) => {
                    if (!value) return t("password_required");

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
                      error={field.state.meta.errors.length > 0 ? true : false}
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
                      ? t("password_required")
                      : value?.length < 8
                        ? t("password_must_be_at_least_8_characters")
                        : value !== fieldApi.form.getFieldValue("password")
                          ? t("passwords_do_not_match")
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
                      error={field.state.meta.errors.length > 0 ? true : false}
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

              <div className="flex gap-2 ">
                <DefaultButton
                  title={t("save")}
                  size="lg"
                  variant="dark"
                  type="submit"
                  onClick={form.handleSubmit}
                  icon={<Plus className="size-5" />}
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
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
