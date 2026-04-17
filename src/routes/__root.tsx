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
import { settingsAtom } from "@/store/atoms";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundLayout,
  // errorComponent: GlobalError,
});

function RootComponent() {
  const { t, i18n } = useTranslation();
  const setSettings = useSetAtom(settingsAtom);

  const { data: globalData, isLoading } = useQuery({
    queryKey: ["global-init", i18n.language],
    staleTime: Infinity,
    queryFn: async () => {
      const [settingsRes, transRes] = await Promise.allSettled([
        apiClient.get(`${i18n.language}/settings`).json(),
        apiClient.get(`${i18n.language}/get-translation`).json(),
      ]);

      const settings =
        settingsRes.status === "fulfilled" ? settingsRes.value?.data : null;
      const translations =
        transRes.status === "fulfilled"
          ? transRes.value?.data?.translations
          : null;

      if (settings) setSettings(settings);
      if (translations) {
        i18n.addResourceBundle(
          i18n.language,
          "translation",
          translations,
          true,
          true,
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
      <Toaster
        position={i18n.language === "ar" ? "bottom-left" : "bottom-right"}
      />
    </React.Fragment>
  );
}
