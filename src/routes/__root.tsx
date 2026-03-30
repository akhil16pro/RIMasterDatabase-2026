import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import NotFoundLayout from "@/components/layouts/NotFoundLayout";
import { apiClient } from "@/api";
import { Toaster } from "@/components/ui/sonner";
import "lenis/dist/lenis.css";
import { useTranslation } from "react-i18next";
// import GlobalError from "@/components/layouts/GlobalError";
import { atom, useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";

export const settingsAtom = atom(null);

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundLayout,
  // errorComponent: GlobalError,
});

function RootComponent() {
  const { t, i18n } = useTranslation();
  const setSettings = useSetAtom(settingsAtom);
  // const { data, isLoading, error, isRefetching } = useQuery({
  //   queryKey: ["settings", i18n.language],
  //   staleTime: Infinity,
  //   enabled: true,
  //   queryFn: async () => {
  //     try {
  //       const res = await apiClient.get(i18n.language + "/settings").json();
  //       // console.log("SETTINGS_DATA", res?.data);
  //       setSettings(res?.data);
  //       return res?.data;
  //     } catch (error) {
  //       console.log("SETTINGS_DATA_ERROR", error);
  //       return null;
  //     }
  //   },
  // });

  const { data: globalData, isLoading } = useQuery({
    queryKey: ["global-init", i18n.language],
    staleTime: Infinity,
    queryFn: async () => {
      const [settingsRes, transRes] = await Promise.all([
        apiClient.get(`${i18n.language}/settings`).json(),
        apiClient.get(`${i18n.language}/get-translation`).json(),
      ]);

      const settings = settingsRes?.data;
      const translations = transRes?.data?.translations;

      setSettings(settings);
      // console.log(settings, "settings");
      // console.log(translations, "translations");

      if (translations) {
        i18n.addResourceBundle(
          i18n.language,
          "translation",
          translations,
          true, // deep merge
          true, // overwrite
        );
      }

      return { settings, translations };
    },
  });

  if (isLoading) {
    return null;
  }

  return (
    <React.Fragment>
      <title>{globalData?.settings?.title || t("logo-text")}</title>
      <Outlet />
      <Toaster />
    </React.Fragment>
  );
}
