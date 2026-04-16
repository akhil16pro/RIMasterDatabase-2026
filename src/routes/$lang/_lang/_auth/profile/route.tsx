import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/_lang/_auth/profile")({
  staticData: {
    breadcrumb: (params: any) => ({
      key: "profile",
      path: `/${params.lang}/profile`,
    }),
  },
  component: () => <Outlet />,
});
