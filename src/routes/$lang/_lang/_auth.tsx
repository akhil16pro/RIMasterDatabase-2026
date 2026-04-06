import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { getDefaultStore } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { apiClient } from "@/api";
import { NAV_CONFIG } from "@/lib/navigation";

// const store = getDefaultStore();

export const Route = createFileRoute("/$lang/_lang/_auth")({
  beforeLoad: async ({ params, context }) => {
    const { queryClient } = context;
    const store = getDefaultStore();

    let userSession = store.get(userSessionAtom);

    const now = Date.now();
    const DAY_IN_MS = 86400000;

    if (
      userSession?.lastVerified &&
      now - userSession.lastVerified > DAY_IN_MS
    ) {
      store.set(userSessionAtom, null);
      localStorage.removeItem("auth-session");
      throw redirect({
        to: "/$lang/login",
        params: { lang: params.lang },
      });
    }

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
          lastVerified: Date.now(),
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

    // console.log(userSession, "userSession");

    if (!userSession?.accessToken) {
      throw redirect({
        to: "/$lang/login",
        params: { lang: params.lang },
      });
    }

    /**
     * Map your URL segments to the keys in APP_PERMISSIONS.
     * This logic checks if the current URL contains a restricted keyword.
     */
    const userRole = userSession?.user?.roles;
    const pathname = location.pathname;

    const currentPath = params.lang
      ? pathname.replace(`/${params.lang}`, "")
      : pathname;

    const activeRequirement = NAV_CONFIG.find((item) => {
      // Matches if the current simplified path starts with the config href
      // e.g., "/dashboard" matches item.href === "/dashboard"
      return currentPath.startsWith(item.href);
    });

    if (activeRequirement) {
      const roleToVerify = Array.isArray(userRole) ? userRole[0] : userRole;

      const hasPermission = activeRequirement.roles.includes(roleToVerify);

      if (!hasPermission) {
        console.warn(
          `Access Denied: ${roleToVerify} cannot access ${pathname}`,
        );

        // Redirect to a safe "Entry" page or Login
        throw redirect({
          to: "/$lang/login", // Or a generic landing page
          params: { lang: params.lang },
        });
      }
    }

    // console.log({
    //   currentPath,
    //   userRole,
    //   activeRequirementRoles: activeRequirement?.roles,
    //   match: activeRequirement?.roles.includes(userRole),
    // });
  },
  component: () => <Outlet />,
});
