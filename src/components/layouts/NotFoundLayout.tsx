import { Link, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { DefaultButton } from "../ui/buttons";
import { ArrowLeft, ArrowRight } from "lucide-react";
import i18n from "@/lang";
import { motion } from "motion/react";
import Lottie from "lottie-react";
import notFoundAnimation from "@/assets/animations/404Animation.json";
import { userSessionAtom } from "@/store/atoms";
import { useAtomValue } from "jotai";

export default function NotFoundLayout() {
  const { t, i18n } = useTranslation();
  const userSession = useAtomValue(userSessionAtom);
  const router = useRouter();
  const goHome = () => {
    router.history.back();
    // if (userSession?.accessToken) {
    //   router.navigate({
    //     to: "/" + i18n.language + "/dashboard",
    //   });
    // } else {
    //   router.navigate({
    //     to: "/" + i18n.language,
    //   });
    // }
  };
  return (
    <div className="flex flex-col items-center justify-center h-full w-full flex-1 p-5 md:p-10 fixed top-0 left-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50, scaleY: 1.1 }}
        animate={{ opacity: 1, y: 0, scaleY: 1 }}
        exit={{ opacity: 0, y: 50, scaleY: 1.1 }}
        transition={{ duration: 0.4, delay: 0.3, type: "tween" }}
        className="relative z-10 flex flex-col items-center justify-center w-full xl:max-w-2xl mx-auto text-center bg-text/10 p-10 rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden"
      >
        {/* <motion.div
          initial={{ opacity: 0, y: 50, scaleY: 1.1 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: 50, scaleY: 1.1 }}
          transition={{ duration: 0.4, delay: 0.3, type: "tween" }}
          className="block w-full flex items-center justify-center"
        >
          <span className="text-[15vw] leading-none font-bold opacity-30">
            404
          </span>
        </motion.div> */}
        <motion.div
          initial={{ opacity: 0, y: 50, scaleY: 1.1 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: 50, scaleY: 1.1 }}
          transition={{ duration: 0.4, delay: 0.3, type: "tween" }}
          className="flex w-full flex items-center justify-center mb-6"
        >
          <Lottie
            animationData={notFoundAnimation}
            loop={true}
            className="w-full h-full max-w-[500px]"
          />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30, scaleY: 1.1 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: 30, scaleY: 1.1 }}
          transition={{ duration: 0.4, delay: 0.4, type: "tween" }}
          className="md:text-5xl text-3xl font-bold text-white"
        >
          {t("page-not-found")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30, scaleY: 1.1 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: 30, scaleY: 1.1 }}
          transition={{ duration: 0.4, delay: 0.6, type: "tween" }}
          className="md:text-2xl text-xl mt-4 font-secondary font-weight-400 text-text/75 max-w-md mx-auto"
        >
          {t("page-not-found-description")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30, scaleY: 1.1 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: 30, scaleY: 1.1 }}
          transition={{ duration: 0.4, delay: 0.8, type: "tween" }}
          className="w-full flex items-center justify-center mt-4 md:mt-7"
        >
          <Link onClick={goHome} className="inline-block">
            <DefaultButton
              type="button"
              title={t("back-to-home")}
              icon={
                i18n.dir() === "rtl" ? (
                  <ArrowRight className="w-4 h-4" />
                ) : (
                  <ArrowLeft className="w-4 h-4" />
                )
              }
              variant="dark"
            />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
