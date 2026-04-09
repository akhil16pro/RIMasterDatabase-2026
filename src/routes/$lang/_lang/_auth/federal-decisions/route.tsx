import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/_lang/_auth/federal-decisions")({
  component: () => <Outlet />,
  staticData: {
    breadcrumb: (params: any) => ({
      key: "federal_decisions",
      path: `/${params.lang}/federal-decisions`,
    }),
  },
});
