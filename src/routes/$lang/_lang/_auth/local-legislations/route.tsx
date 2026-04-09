import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/_lang/_auth/local-legislations")({
  staticData: {
    breadcrumb: (params: any) => ({
      key: "local_legislations",
      path: `/${params.lang}/local-legislations`,
    }),
  },
  component: () => <Outlet />,
});
