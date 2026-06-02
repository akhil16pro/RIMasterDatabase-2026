import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { apiClient } from "@/api";
import { getDefaultStore, useSetAtom } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { redirect } from "@tanstack/react-router";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
const store = getDefaultStore();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function checkActiveSession(params: any) {
  let userSession = store.get(userSessionAtom);
  const isLoggedIn = Cookies.get("loggedin") === "true";

  if (!userSession?.accessToken && isLoggedIn) {
    try {
      console.log("Checking if active session exists via token refresh...");
      const refreshResponse = await apiClient
        .post(`${params.lang}/refresh`)
        .json<any>();

      if (refreshResponse?.access_token) {
        const updatedSession = {
          ...refreshResponse,
          accessToken: refreshResponse.access_token,
          lang: params.lang,
          lastVerified: Date.now(),
        };
        store.set(userSessionAtom, updatedSession);
        userSession = updatedSession;
      }
    } catch (e) {
      Cookies.remove("loggedin");
      console.log("No active session cookie found.");
    }
  }

  if (userSession?.accessToken) {
    throw redirect({
      to: `/${params.lang}/dashboard`,
    });
  }
}

export function useLogoutUser() {
  const { i18n } = useTranslation();
  const setUserSession = useSetAtom(userSessionAtom);
  const queryClient = useQueryClient();
  const router = useRouter();

  const logout = async () => {
    Cookies.remove("loggedin");
    setUserSession(null);
    queryClient.clear();

    await router.navigate({
      to: "/$lang/login",
      params: { lang: i18n.language },
    });
  };

  return logout;
}
