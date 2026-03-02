import i18n from "@/lang";
import ky from "ky";

const apiClient = ky.create({
    prefixUrl: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    retry: {
        limit: 3,
        methods: ['get', 'post', 'put', 'delete'],
        statusCodes: [408, 500, 502, 503, 504]
    },
})

export {
    apiClient,
}