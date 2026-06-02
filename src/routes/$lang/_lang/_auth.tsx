import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { getDefaultStore } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { apiClient } from "@/api";
import { NAV_CONFIG, APP_ROLES } from "@/lib/navigation";
import { toast } from "@/lib/toast";
import Cookies from "js-cookie";

// const store = getDefaultStore();

export const Route = createFileRoute("/$lang/_lang/_auth")({
  beforeLoad: async ({ params, context }) => {
    const { queryClient } = context;
    const store = getDefaultStore();

    let userSession = store.get(userSessionAtom);

    const triggerAuthFailure = (message?: string) => {
      if (message) toast.error(message);

      // 1. Clean up what we can synchronously outside React context
      Cookies.remove("loggedin");
      store.set(userSessionAtom, null);
      queryClient.clear(); // Safe to do because queryClient is passed via route context!

      // 2. Halt the routing execution immediately and redirect
      throw redirect({
        to: "/$lang/login",
        params: { lang: params.lang },
      });
    };

    // console.log(userSession, "userSession");

    const now = Date.now();
    // 15 minutes * 60 seconds * 1000 milliseconds
    const TOKEN_LIMIT = 15 * 60 * 1000;

    // Silent refresh on every page load to guarantee safety & session freshness
    try {
      const refreshTokenResponse = await queryClient.fetchQuery({
        queryKey: ["refreshToken", params.lang],
        queryFn: () => apiClient.post(`${params.lang}/refresh`).json<any>(),
        staleTime: TOKEN_LIMIT,
      });
      if (refreshTokenResponse?.access_token) {
        const updatedSession = {
          ...refreshTokenResponse,
          accessToken: refreshTokenResponse.access_token,
          lang: params.lang,
          lastVerified: Date.now(),
        };
        store.set(userSessionAtom, updatedSession);
        userSession = updatedSession;
      } else {
        triggerAuthFailure("Invalid refresh response structure");
      }
    } catch (e) {
      console.error("Token refresh during auth guard failed", e);
      triggerAuthFailure();
    }

    try {
      const response = await queryClient.fetchQuery({
        queryKey: ["userInfo", params.lang],
        queryFn: () => apiClient.get(`${params.lang}/get_userinfo`).json<any>(),
        staleTime: Infinity,
      });

      const apiUserData = response?.data;

      if (apiUserData) {
        const updatedSession = {
          ...userSession,
          ...apiUserData,
          lang: params.lang,
          // lastVerified: Date.now(),
        };

        if (JSON.stringify(userSession) !== JSON.stringify(updatedSession)) {
          store.set(userSessionAtom, updatedSession);
          userSession = updatedSession;
        }
      }
    } catch (e) {
      console.error("Auth hydration error", e);
      triggerAuthFailure("Session expired. Please log in again.");
    }

    const checkRole = APP_ROLES.includes(userSession?.user?.roles);

    if (!userSession?.accessToken || !checkRole) {
      // store.set(userSessionAtom, null);
      // Cookies.remove("loggedin");
      // throw redirect({
      //   to: "/$lang/login",
      //   params: { lang: params.lang },
      // });
      triggerAuthFailure("Unauthorized or Invalid user role");
    }

    const userRole = userSession?.user?.roles;
    const pathname = location.pathname;

    const currentPath = params.lang
      ? pathname.replace(`/${params.lang}`, "")
      : pathname;

    const activeRequirement = NAV_CONFIG.find((item) => {
      return currentPath.startsWith(item.href);
    });

    if (activeRequirement) {
      const roleToVerify = Array.isArray(userRole) ? userRole[0] : userRole;

      const hasPermission = activeRequirement.roles.includes(roleToVerify);

      if (!hasPermission) {
        console.warn(
          `Access Denied: ${roleToVerify} cannot access ${pathname}`,
        );

        triggerAuthFailure("You do not have permission to view this page.");
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
