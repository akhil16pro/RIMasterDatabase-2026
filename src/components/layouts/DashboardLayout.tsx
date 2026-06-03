import { motion, AnimatePresence } from "motion/react";
import RouteLoader from "@/components/layouts/RouteLoader";
import RoteError from "@/components/layouts/RoteError";
import DashboardSidebar from "@/components/layouts/DashboardSidebar";
import { useAtomValue } from "jotai";
import { userSessionAtom } from "@/store/atoms";
import DashboardTopbar from "@/components/layouts/DashboardTopbar";
import { useTranslation } from "react-i18next";
import Lottie from "lottie-react";
import docLoading from "@/assets/animations/loading2.json";
import { useMatches, useParams, useSearch } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
export default function DashboardLayout({
  isLoading = false,
  isRefetching = false,
  error = false,
  children,
  title,
  lastLogin = false,
  campaign = [],
}: {
  isLoading?: boolean;
  isRefetching?: boolean;
  error?: any;
  title?: string;
  lastLogin?: boolean;
  campaign?: string[];
  children: React.ReactNode;
}) {
  const { t, i18n } = useTranslation();
  const userSession = useAtomValue(userSessionAtom);

  // const navigate = useNavigate();
  // const router = useRouter();
  // const location = useLocation();

  // const pathSegments = location.pathname.split("/").filter(Boolean);
  // const isInnerPage = pathSegments.length > 2;

  // const goBack = () => {
  //   router.history.back();
  // };
  return (
    <>
      {!userSession?.accessToken ? (
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
              <div className="contentBox relative">
                <Breadcrumbs />

                {/* {isInnerPage && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: i18n.language === "ar" ? 10 : -10,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: i18n.language === "ar" ? 10 : -10 }}
                    transition={{ duration: 0.4, type: "tween" }}
                    className=" flex absolute top-0 ltr:left-0 rtl:right-0  h-full  w-[calc(var(--sidePadd)-4px)]  cursor-pointer hover:bg-muted-foreground/10 transition-all duration-300 group opacity-0 hover:opacity-100"
                    onClick={goBack}
                  >
                    <div className="sticky top-0 h-[100vh] w-full flex items-center justify-center">
                      {i18n.language === "ar" ? (
                        <ChevronRight className="size-4 group-hover:scale-120 transition-all duration-300" />
                      ) : (
                        <ChevronLeft className="size-4 group-hover:scale-120 transition-all duration-300" />
                      )}
                    </div>
                  </motion.div>
                )} */}
                {isLoading || isRefetching ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 1.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 0.4, type: "tween" }}
                    className="flex w-full h-full flex items-center justify-center "
                  >
                    <Lottie
                      animationData={docLoading}
                      loop={true}
                      className="size-25 opacity-70"
                    />
                  </motion.div>
                ) : (
                  <>
                    <DashboardTopbar
                      delay={0}
                      title={title}
                      lastLogin={lastLogin}
                      campaign={campaign}
                    />
                    {children}
                  </>
                )}
              </div>
            </section>
          </div>
        </AnimatePresence>
      )}
    </>
  );
}

export function Breadcrumbs() {
  const { t } = useTranslation();
  const matches = useMatches();
  const params = useParams({ strict: false });
  const search = useSearch({ strict: false });

  const breadcrumbs = matches
    .filter((match) => match.staticData?.breadcrumb)
    .flatMap((match) => {
      const result = (match.staticData.breadcrumb as Function)(params, search);
      return Array.isArray(result) ? result : [result];
    });

  return (
    breadcrumbs.length > 1 && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          delay: 0.4,
          duration: 0.5,
          ease: "easeInOut",
        }}
        className="breadcrumbsWrap w-full hidden md:flex [&:empty]:hidden  absolute top-0 ltr:left-0 rtl:right-0 "
      >
        <nav className=" flex  text-sm text-gray-600 bg-muted py-1 px-[var(--sidePadd)]">
          {breadcrumbs.map((bc, index) => (
            <div key={bc.path} className="flex items-center">
              {index < breadcrumbs.length - 1 ? (
                <>
                  <Link to={bc.path} className="hover:text-blue-600 ">
                    {t(bc.key)}
                  </Link>
                  <span className="mx-2">/</span>
                </>
              ) : (
                <span>{t(bc.key)}</span>
              )}
            </div>
          ))}
        </nav>
      </motion.div>
    )
  );
}
