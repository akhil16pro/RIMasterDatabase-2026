import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import NotFoundLayout from "@/components/layouts/NotFoundLayout";
import { apiClient } from "@/api";
import { Toaster } from "@/components/ui/sonner";
import "lenis/dist/lenis.css";
import { useTranslation } from "react-i18next";
import GlobalError from "@/components/layouts/GlobalError";
import { atom, useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";

export const settingsAtom = atom(null);

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundLayout,
  errorComponent: GlobalError,
});

function RootComponent() {
  const { i18n } = useTranslation();
  const setSettings = useSetAtom(settingsAtom);
  const { data, isLoading, error, isRefetching } = useQuery({
    queryKey: ["settings", i18n.language],
    staleTime: Infinity,
    enabled: true,
    queryFn: async () => {
      try {
        const res = await apiClient.get(i18n.language + "/settings").json();
        // console.log("SETTINGS_DATA", res?.data);
        setSettings(res?.data);
        return res?.data;
      } catch (error) {
        console.log("SETTINGS_DATA_ERROR", error);
        return null;
      }
    },
  });

  return (
    <React.Fragment>
      <title>
        {data?.settings?.title ? data?.settings?.title : "RI Master Database"}
      </title>
      <Outlet />
      <Toaster />
    </React.Fragment>
  );
}
