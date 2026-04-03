import { AnimatePresence } from "motion/react";
import RouteLoader from "@/components/layouts/RouteLoader";
import RoteError from "@/components/layouts/RoteError";
import DashboardSidebar from "@/components/layouts/DashboardSidebar";
import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import DashboardTopbar from "@/components/layouts/DashboardTopbar";
import { useTranslation } from "react-i18next";

export default function DashboardLayout({
  isLoading,
  isRefetching,
  error,
  children,
  title,
  lastLogin = false,
  campaign,
}: {
  isLoading: boolean;
  isRefetching: boolean;
  error: any;
  title: string;
  lastLogin?: boolean;
  campaign?: string;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const userSession = useAtomValue(userSessionAtom);
  return (
    <>
      {isLoading || isRefetching || !userSession?.accessToken ? (
        <RouteLoader key="dashboard-loader" />
      ) : error ? (
        <RoteError key="dashboard-error" />
      ) : (
        <AnimatePresence>
          <div
            key="dashboard-content"
            className="flex flex-col items-center justify-center w-full h-full flex-1 mainBody "
          >
            <section className="w-full flex-1 relative mainWrapper ">
              <DashboardSidebar delay={0} />
              <div className="contentBox">
                <DashboardTopbar
                  delay={0}
                  title={title}
                  lastLogin={lastLogin}
                  campaign={campaign}
                />
                {children}
              </div>
            </section>
          </div>
        </AnimatePresence>
      )}
    </>
  );
}
