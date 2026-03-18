import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { getDefaultStore } from "jotai";
import { userSessionAtom } from "@/store/atoms";
// Get the store instance
const store = getDefaultStore();

export const Route = createFileRoute("/$lang/_lang/_auth")({
  // The Auth Guard logic goes here ONE TIME
  beforeLoad: async ({ location, params }) => {
    let userSession = store.get(userSessionAtom);

    // Initial hydration fallback for Jotai + TanStack Router
    if (!userSession && typeof window !== "undefined") {
      const stored = localStorage.getItem("auth-session");
      if (stored) {
        try {
          userSession = JSON.parse(stored);
        } catch (e) {
          // parse error
        }
      }
    }

    console.log(userSession);

    if (!userSession?.accessToken) {
      throw redirect({
        to: "/$lang/login",
        params: {
          lang: params.lang,
        },
        // search: {
        //   redirect: location.href,
        // },
      });
    }
  },
  component: AuthLayoutComponent,
});

function AuthLayoutComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
