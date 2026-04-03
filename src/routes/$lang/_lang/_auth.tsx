import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { getDefaultStore } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { apiClient } from "@/api";

const store = getDefaultStore();

export const Route = createFileRoute("/$lang/_lang/_auth")({
  beforeLoad: async ({ params, context }) => {
    const { queryClient } = context;
    const store = getDefaultStore();

    let userSession = store.get(userSessionAtom);

    try {
      const response = await queryClient.fetchQuery({
        queryKey: ["userInfo", params.lang],
        queryFn: () => apiClient.get(`${params.lang}/get_userinfo`).json<any>(),
        staleTime: 0, // Force a fetch to ensure data is fresh
      });

      const apiUserData = response?.data;

      if (apiUserData) {
        const stored =
          typeof window !== "undefined"
            ? localStorage.getItem("auth-session")
            : null;
        const parsedSession = stored ? JSON.parse(stored) : {};

        const updatedSession = {
          ...parsedSession,
          ...apiUserData,
          lang: params.lang,
        };

        if (JSON.stringify(userSession) !== JSON.stringify(updatedSession)) {
          store.set(userSessionAtom, updatedSession);
          userSession = updatedSession;

          localStorage.setItem("auth-session", JSON.stringify(updatedSession));
        }
        // console.log(apiUserData, "apiUserData");
      }
    } catch (e) {
      console.error("Auth hydration error", e);
      userSession = null;
    }

    console.log(userSession, "userSession");

    if (!userSession?.accessToken) {
      throw redirect({
        to: "/$lang/login",
        params: { lang: params.lang },
      });
    }
  },
  component: () => <Outlet />,
});
