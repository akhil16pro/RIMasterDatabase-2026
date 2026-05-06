import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
export default function AppFooter({ delay }: { delay: number }) {
  const { i18n, t } = useTranslation();
  return (
    <motion.footer
      className="
        bg-primary
        py-2 md:py-6  relative z-50 overflow-hidden"
      initial={{ y: 150, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        transition: { duration: 0.6, type: "tween", delay: delay },
      }}
      transition={{ duration: 0.6, type: "tween", delay: delay }}
    >
      <div className="container mx-auto px-3 md:px-0 relative z-10 ">
        <p className="text-white/75 text-lg  text-center leading-[120%]">
          {t("copyright")}
        </p>
      </div>
    </motion.footer>
  );
}
