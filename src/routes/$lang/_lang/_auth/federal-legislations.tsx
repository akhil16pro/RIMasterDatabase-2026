import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/_lang/_auth/federal-legislations")(
  {
    component: () => <Outlet />,
    staticData: {
      breadcrumb: (params: any) => {
        return {
          key: "federal_legislations",
          path: `/${params.lang}/federal-legislations`,
        };
      },
    },
  },
);
