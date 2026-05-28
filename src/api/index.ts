// @/api.ts
import i18n from "@/lang";
import ky from "ky";
import { toast } from "@/lib/toast";
import { getDefaultStore } from "jotai";
import { userSessionAtom } from "@/store/atoms";

let refreshPromise: Promise<any> | null = null;

const apiClient = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  timeout: 10000,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  hooks: {
    beforeRequest: [
      (request) => {
        request.headers.set("accept-language", i18n.language);
        const store = getDefaultStore();
        const userSession = store.get(userSessionAtom);
        if (userSession?.accessToken) {
          request.headers.set(
            "Authorization",
            `Bearer ${userSession.accessToken}`,
          );
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        // ── 401 Handling ──────────────────────────────────────────
        if (response.status === 401) {
          // Prevent infinite loop if refresh itself returns 401
          if (request.url.includes("/refresh")) {
            const store = getDefaultStore();
            store.set(userSessionAtom, null);
            return;
          }

          try {
            const store = getDefaultStore();
            const userSession = store.get(userSessionAtom);
            const lang = userSession?.lang || i18n.language || "en";

            // Deduplicate concurrent refresh calls
            if (!refreshPromise) {
              refreshPromise = apiClient
                .post(`${lang}/refresh`, { credentials: "include" })
                .json<any>()
                .finally(() => {
                  refreshPromise = null;
                });
            }

            const refreshResponse = await refreshPromise;

            if (refreshResponse?.access_token) {
              const updatedSession = {
                ...(userSession ?? {}),
                accessToken: refreshResponse.access_token,
                lastVerified: Date.now(),
                user: refreshResponse.user || userSession?.user,
              };
              store.set(userSessionAtom, updatedSession);

              // Retry original request with new token
              const newRequest = request.clone();
              newRequest.headers.set(
                "Authorization",
                `Bearer ${refreshResponse.access_token}`,
              );
              return apiClient(newRequest);
            }
          } catch (refreshError) {
            console.error("Token refresh failed", refreshError);
            const store = getDefaultStore();
            store.set(userSessionAtom, null);
            window.location.href = `/${i18n.language}/login`;
            return;
          }
        }

        if (!response.ok) {
          try {
            const errorData = await response.json();
            if (
              errorData?.errors &&
              typeof errorData.errors === "object" &&
              !Array.isArray(errorData.errors)
            ) {
              Object.values(errorData.errors).forEach((messages: any) => {
                if (Array.isArray(messages)) {
                  messages.forEach((msg: string) => {
                    toast.error(i18n.t(msg));
                  });
                }
              });
              return;
            }

            if (Array.isArray(errorData?.errors)) {
              errorData.errors.forEach((error: string) => {
                toast.error(i18n.t(error));
              });
              return;
            }

            if (errorData?.message) {
              toast.error(i18n.t(errorData.message));
              return;
            }
          } catch (e) {
            toast.error(i18n.t("error_occurred"));
          }
        }
      },
    ],
  },
  retry: {
    limit: 3,
    methods: ["get"],
    statusCodes: [408, 500, 502, 503, 504],
  },
});

export { apiClient };
