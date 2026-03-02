import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";

export default function AppFooter() {

  const { t, i18n } = useTranslation();

  return (
    <motion.footer 
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.5 }}
    viewport={{ once: true, amount: 'some' }}
    className="relative w-full block py-5 pt-10 md:pb-10 pb-25">
      <div className="container mx-auto md:px-0 px-5">
        <ul className="flex mb-4 items-center justify-center gap-5">
          <li>
            <Link to={'/' + i18n.language + '/glossary'} className="hover:underline">{t('glossary')}</Link>
          </li>
          <li>
            <Link to={'/' + i18n.language + '/references'} className="hover:underline">{t('references')}</Link>
          </li>
          <li>
            <Link to={'/' + i18n.language + '/disclaimer'} className="hover:underline">{t('disclaimer')}</Link>
          </li>
        </ul>
        <p className="text-center text-lg text-text/75 md:px-5 px-16 w-full block">
        {i18n.language === 'en' ? 'Copyright © 2026 The General Secretariat of the Cabinet, All Rights Reserved' : 'حقوق النشر © 2026 الأمانة العامة لمجلس الوزراء، جميع الحقوق محفوظة'}
        </p>
      </div>
    </motion.footer>
  )
}
