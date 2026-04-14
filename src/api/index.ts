// @/api.ts
import i18n from "@/lang";
import ky from "ky";
import { toast } from "sonner";
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
        // If the response is not 2xx
        if (!response.ok) {
          let errorMessage = "error-occurred"; // Default translation key
          
          try {
            const errorData = await response.json();
            // If your API returns { message: "..." }, use it
            if (errorData?.message) {
              errorMessage = errorData.message;
            }
          } catch {
            // Fallback if response isn't JSON
          }

          // Trigger the toast globally
          // i18n.t() will translate the key if it exists in your JSON files
          toast.error(i18n.t(errorMessage));
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