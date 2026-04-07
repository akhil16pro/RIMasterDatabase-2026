// import GlobalError from "@/components/layouts/GlobalError";
import NotFoundLayout from "@/components/layouts/NotFoundLayout";
import i18n from "@/lang";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/_lang")({
  component: RouteComponent,
  notFoundComponent: NotFoundLayout,
  // errorComponent: GlobalError,
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
  return (
    <>
      <main className="flex flex-col min-h-screen rlative relative w-full flex flex-col overflow-clip min-h-screen">
        <Outlet />
      </main>

      <div className="absolute w-0 h-0 pointer-events-none">
        <svg width="0" height="0">
          <linearGradient
            id="button_linear"
            x1="46.3737"
            y1="29.617"
            x2="-4.96361e-07"
            y2="29.617"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#022EE4" />
            <stop offset="1" stopColor="#03CBFF" />
          </linearGradient>

          <linearGradient
            id="button_linear_red"
            x1="24.2998"
            y1="3.79999"
            x2="-6.20019"
            y2="22.3"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F07067" />
            <stop offset="1" stopColor="#FFC99D" />
          </linearGradient>

          <linearGradient
            id="button_linear_green"
            x1="24.2998"
            y1="3.79999"
            x2="-6.20019"
            y2="22.3"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#15bf94" />
            <stop offset="1" stopColor="#abe0d3" />
          </linearGradient>

          <linearGradient
            id="button_linear_amber"
            x1="24.2998"
            y1="3.79999"
            x2="-6.20019"
            y2="22.3"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#f5b002" />
            <stop offset="1" stopColor="#fde68a" />
          </linearGradient>

          <linearGradient
            id="dashboard_linear"
            x1="23.1869"
            y1="14.8085"
            x2="-2.48181e-07"
            y2="14.8085"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#022EE4" />
            <stop offset="1" stopColor="#03CBFF" />
          </linearGradient>

          <linearGradient
            id="LastLoginLine"
            x1="34.5"
            y1="3"
            x2="-5"
            y2="23.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#022EE4" />
            <stop offset="1" stopColor="#FFC99D" />
          </linearGradient>
        </svg>
      </div>
    </>
  );
}
