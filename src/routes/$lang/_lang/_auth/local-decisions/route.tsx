import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/_lang/_auth/local-decisions")({
  staticData: {
    breadcrumb: (params: any) => ({
      key: "local_decisions",
      path: `/${params.lang}/local-decisions`,
    }),
  },
  component: () => <Outlet />,
});
