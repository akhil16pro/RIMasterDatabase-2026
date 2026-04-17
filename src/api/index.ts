// @/api.ts
import i18n from "@/lang";
import ky from "ky";
import { toast } from "@/lib/toast";
import Cookies from "js-cookie";

const apiClient = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  hooks: {
   beforeRequest: [
      (request) => {
        request.headers.set('accept-language', i18n.language);
        const accessToken = Cookies.get("auth_token");
        if (accessToken) {
          request.headers.set('Authorization', `Bearer ${accessToken}`);
        }
      }
    ],
   afterResponse: [
      async (request, options, response) => {
        if (!response.ok) {
          try {
            const errorData = await response.json();
             if (errorData?.errors && typeof errorData.errors === 'object' && !Array.isArray(errorData.errors)) {
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

        if (response.status === 401) {
           Cookies.remove("auth_token");
           sessionStorage.removeItem("auth-session");
           // window.location.href = `/${i18n.language}/login`;
        }

      }
    ]
  },
  retry: {
    limit: 3,
    methods: ['get', 'post', 'put', 'delete'],
    statusCodes: [408, 500, 502, 503, 504]
  },
});

export { apiClient };