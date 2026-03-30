import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { getDefaultStore } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { apiClient } from "@/api";

const store = getDefaultStore();

export const Route = createFileRoute("/$lang/_lang/_auth")({
  beforeLoad: async ({ params, context }) => {
    const { queryClient } = context;
    let userSession = store.get(userSessionAtom);

    // Initial hydration fallback
    const needsRefresh = !userSession || userSession.lang !== params.lang;

    if (needsRefresh && typeof window !== "undefined") {
      const stored = localStorage.getItem("auth-session");
      if (stored) {
        try {
          const parsedSession = JSON.parse(stored);

          const data = await queryClient.fetchQuery({
            queryKey: ["userInfo", params.lang],
            queryFn: () =>
              apiClient.get(`${params.lang}/get_userinfo`).json<any>(),
            staleTime: 0,
          });

          const updatedSession = {
            ...parsedSession,
            ...data,
            lang: params.lang,
          };
          store.set(userSessionAtom, updatedSession);
          userSession = updatedSession;
        } catch (e) {
          userSession = null;
          console.error("Auth hydration error", e);
        }
      }
    }

    if (!userSession?.accessToken) {
      throw redirect({
        to: "/$lang/login",
        params: { lang: params.lang },
      });
    }
  },
  component: () => <Outlet />,
});
