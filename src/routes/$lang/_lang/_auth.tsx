import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/_lang/_auth")({
  // The Auth Guard logic goes here ONE TIME
  beforeLoad: async ({ location, params }) => {
    const token = localStorage.getItem("auth_token"); // Adjust appropriately

    if (!token) {
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
