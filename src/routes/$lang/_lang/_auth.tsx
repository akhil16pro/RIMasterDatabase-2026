import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { getDefaultStore } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import { apiClient } from "@/api";
import { NAV_CONFIG, APP_ROLES } from "@/lib/navigation";
import { toast } from "@/lib/toast";

// const store = getDefaultStore();

export const Route = createFileRoute("/$lang/_lang/_auth")({
  beforeLoad: async ({ params, context }) => {
    const { queryClient } = context;
    const store = getDefaultStore();

    let userSession = store.get(userSessionAtom);

    // console.log(userSession, "userSession");

    const now = Date.now();
    // 15 minutes * 60 seconds * 1000 milliseconds
    const TOKEN_LIMIT = 15 * 60 * 1000;

    // Silent refresh on every page load to guarantee safety & session freshness
    if (
      !userSession?.accessToken ||
      now - (userSession?.lastVerified || 0) > TOKEN_LIMIT
    ) {
      try {
        console.log(
          "No in-memory session or session expired, attempting token refresh...",
        );
        const refreshResponse = await apiClient
          .post(`${params.lang}/refresh`, {
            credentials: "include",
          })
          .json<any>();

        console.log(refreshResponse, "refreshResponse");
        if (refreshResponse?.access_token) {
          const updatedSession = {
            ...refreshResponse,
            accessToken: refreshResponse.access_token,
            lang: params.lang,
            lastVerified: Date.now(),
          };
          store.set(userSessionAtom, updatedSession);
          userSession = updatedSession;
        } else {
          throw new Error("Invalid refresh response structure");
        }
      } catch (e) {
        console.error("Token refresh during auth guard failed:", e);
        store.set(userSessionAtom, null);
        throw redirect({
          to: "/$lang/login",
          params: { lang: params.lang },
        });
      }
    }

    try {
      const response = await queryClient.fetchQuery({
        queryKey: ["userInfo", params.lang],
        queryFn: () => apiClient.get(`${params.lang}/get_userinfo`).json<any>(),
        staleTime: 0, // Force a fetch to ensure data is fresh
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
      userSession = null;
    }

    const checkRole = APP_ROLES.includes(userSession?.user?.roles);

    if (!checkRole) {
      toast.error("Unauthorized or Invalid user role");
    }

    if (!userSession?.accessToken || !checkRole) {
      store.set(userSessionAtom, null);
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
      return currentPath.startsWith(item.href);
    });

    if (activeRequirement) {
      const roleToVerify = Array.isArray(userRole) ? userRole[0] : userRole;

      const hasPermission = activeRequirement.roles.includes(roleToVerify);

      if (!hasPermission) {
        console.warn(
          `Access Denied: ${roleToVerify} cannot access ${pathname}`,
        );

        throw redirect({
          to: "/$lang/login",
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
