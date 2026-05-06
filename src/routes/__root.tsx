import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import NotFoundLayout from "@/components/layouts/NotFoundLayout";
import { apiClient } from "@/api";
import { Toaster } from "@/components/ui/sonner";
import "lenis/dist/lenis.css";
import { useTranslation } from "react-i18next";
// import GlobalError from "@/components/layouts/GlobalError";
import { atom, useSetAtom, useAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { settingsAtom } from "@/store/atoms";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundLayout,
  // errorComponent: GlobalError,
});

function RootComponent() {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useAtom(settingsAtom);

  const { data: globalData, isLoading } = useQuery({
    queryKey: ["globalInfo", i18n.language],
    staleTime: Infinity,
    queryFn: async () => {
      const [settingsRes, transRes] = await Promise.allSettled([
        apiClient.get(`${i18n.language}/settings`).json(),
        apiClient.get(`${i18n.language}/get-translation`).json(),
      ]);

      const settingsData =
        settingsRes.status === "fulfilled"
          ? settingsRes.value?.data?.settings
          : null;
      const translations =
        transRes.status === "fulfilled"
          ? transRes.value?.data?.translations
          : null;

      if (settingsData) setSettings(settingsData);
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
      <title>{settings?.title || t("logo-text")}</title>
      <Outlet />
      <Toaster
        position={i18n.language === "ar" ? "bottom-left" : "bottom-right"}
      />
    </React.Fragment>
  );
}
