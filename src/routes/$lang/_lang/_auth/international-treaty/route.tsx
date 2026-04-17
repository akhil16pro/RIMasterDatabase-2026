import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/_lang/_auth/international-treaty")(
  {
    component: () => <Outlet />,
    staticData: {
      breadcrumb: (params: any) => ({
        key: "international-treaty",
        path: `/${params.lang}/international-treaty`,
      }),
    },
  },
);
