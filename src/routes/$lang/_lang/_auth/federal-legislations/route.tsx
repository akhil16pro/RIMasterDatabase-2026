import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/_lang/_auth/federal-legislations")(
  {
    staticData: {
      breadcrumb: (params: any) => ({
        key: "federal_legislations",
        path: `/${params.lang}/federal-legislations`,
      }),
    },
    component: () => <Outlet />,
  },
);
