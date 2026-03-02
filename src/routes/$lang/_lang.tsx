import AppHeader from "@/components/layouts/AppHeader";
import GlobalError from "@/components/layouts/GlobalError";
import NotFoundLayout from "@/components/layouts/NotFoundLayout";
import i18n from "@/lang";
import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/_lang")({
  component: RouteComponent,
  notFoundComponent: NotFoundLayout,
  errorComponent: GlobalError,
  beforeLoad: async ({ params }) => {
    const lang = params.lang;
    i18n.changeLanguage(lang);
    if (lang === "ar") {
      document.dir = "rtl";
    } else {
      document.dir = "ltr";
    }
  },
});

function RouteComponent() {
  const { href } = useLocation();

  const componentsAnimationDelay = () => {
    const isRoot = href === "/en" || href === "/ar";
    return {
      header: isRoot ? 2.4 : 0.4,
      shareFeedback: isRoot ? 2.6 : 0.3,
      aiChatbot: isRoot ? 2.7 : 0.6,
      chapterNav: isRoot ? 2.8 : 0.5,
    };
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <AppHeader delay={componentsAnimationDelay().header} />
      <main className="flex-1 relative w-full flex flex-col overflow-hidden min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
