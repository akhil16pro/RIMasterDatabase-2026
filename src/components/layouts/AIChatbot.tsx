import { settingsAtom } from "@/routes/__root";
import { useAtomValue } from "jotai";
import { Bot } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";


export default function AIChatbot({ delay }: { delay: number }) {

  const { t, i18n } = useTranslation();
  const [isHover, setIsHover] = useState(false);
  const settings = useAtomValue(settingsAtom)

  return (
    <motion.div 
    className="fixed md:bottom-0 bottom-20 ltr:right-0 rtl:left-0 z-50 p-5 flex flex-col gap-3" 
    initial={{ y: 100, opacity: 0, scale: 0.6 }} 
    animate={{ y: 0, opacity: 1, scale: 1 }} 
    exit={{ y: 100, opacity: 0, scale: 0.6 }}
    transition={{ duration: 0.6, delay: delay }}
    style={{ opacity: 1, y: 0}}
    >
       <motion.button
        whileHover={{ scale: 1.1, opacity: 0.75, width: i18n.language === 'en' ? 120 : 180 }}
        whileTap={{ scale: 0.95, opacity: 0.65 }}
        type="button"
        layout
        onHoverStart={()=> setIsHover(true)}
        onHoverEnd={()=> setIsHover(false)}
        onClick={()=> {
          if(settings?.settings?.chatboat_link) {
            window.open(settings?.settings?.chatboat_link, '_blank', 'noopener,noreferrer');
          }
        }}
        className="px-2 inline-flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary text-text cursor-pointer text-base overflow-hidden relative gap-2"
        >
         <Bot />
         {
          isHover ? <motion.span layout className="relative inline-bloct text-text">{t('ri-chatbot')}</motion.span> : null
         }
        </motion.button>
    </motion.div>
  )
}
