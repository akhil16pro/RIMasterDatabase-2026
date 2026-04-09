import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/_lang/_auth/local-legislations")({
  component: () => <Outlet />,
  staticData: {
    breadcrumb: (params: any) => {
      return {
        key: "local_decisions",
        path: `/${params.lang}/local-decisions`,
      };
    },
  },
});
