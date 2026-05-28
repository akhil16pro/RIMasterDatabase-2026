// @/api.ts
import i18n from "@/lang";
import ky from "ky";
import { toast } from "@/lib/toast";
import { getDefaultStore } from "jotai";
import { userSessionAtom } from "@/store/atoms";

let refreshPromise: Promise<any> | null = null;
let isRefreshing = false;
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
        const store = getDefaultStore();

        if (request.url.includes("/refresh")) {
          if (response.status === 401) {
            store.set(userSessionAtom, null);
          }
          return;
        }

        //  401 Handling
        if (response.status === 401) {
          try {
            const userSession = store.get(userSessionAtom);

            // Prevent multiple refresh calls
            if (!isRefreshing) {
              isRefreshing = true;

              refreshPromise = apiClient
                .post(`${i18n.language}/refresh`)
                .json<any>()
                .finally(() => {
                  refreshPromise = null;
                  isRefreshing = false;
                });
            }

            const refreshResponse = await refreshPromise;

            if (refreshResponse?.access_token) {
              store.set(userSessionAtom, {
                ...userSession,
                accessToken: refreshResponse.access_token,
                lastVerified: Date.now(),
                user: refreshResponse.user || userSession?.user,
              });

              const newRequest = request.clone();

              newRequest.headers.set(
                "Authorization",
                `Bearer ${refreshResponse.access_token}`,
              );

              return apiClient(newRequest);
            }

            throw new Error("Invalid refresh response");
          } catch (err) {
            console.error("Refresh failed", err);
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
    limit: 0,
    // methods: ["get"],
    // statusCodes: [408, 500, 502, 503, 504],
  },
});

export { apiClient };
