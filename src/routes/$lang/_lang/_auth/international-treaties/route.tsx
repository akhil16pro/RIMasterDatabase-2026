import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/$lang/_lang/_auth/international-treaties",
)({
  component: () => <Outlet />,
  staticData: {
    breadcrumb: (params: any) => ({
      key: "international_treaties",
      path: `/${params.lang}/international-treaties`,
    }),
  },
});
