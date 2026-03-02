import { Link, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { DefaultButton } from "../ui/buttons";
import { ArrowLeft } from "lucide-react";
import i18n from "@/lang";
import { motion } from "motion/react";

export default function NotFoundLayout() {

    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center h-full w-full flex-1 p-10 fixed top-0 left-0 overflow-hidden" >
            <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.50, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6, type: 'tween'}}
            className="absolute top-0 left-0 w-full h-full opacity-15" >
                <img src="/about-banner.png" alt="Not Found" className="w-full h-full object-cover" />
            </ motion.div>

            <motion.div 
            initial={{ opacity: 0, y: 50, scaleY: 1.1 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: 50, scaleY: 1.1 }}
            transition={{ duration: 0.4, delay: 0.3, type: 'tween'}}
            className="relative z-10 flex flex-col items-center justify-center max-w-xl mx-auto text-center bg-text/10 p-10 rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden">
                <motion.div 
                 initial={{ opacity: 0, y: 50, scaleY: 1.1 }}
                 animate={{ opacity: 1, y: 0, scaleY: 1 }}
                 exit={{ opacity: 0, y: 50, scaleY: 1.1 }}
                 transition={{ duration: 0.4, delay: 0.3, type: 'tween'}}
                className="block w-full flex items-center justify-center">
                <span className="text-[15vw] leading-none font-bold opacity-30">404</span>
                </motion.div>
                <motion.h1 
                initial={{ opacity: 0, y: 30, scaleY: 1.1 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: 30, scaleY: 1.1 }}
                transition={{ duration: 0.4, delay: 0.4, type: 'tween'}}
                className="text-5xl font-bold">{t('page-not-found')}</motion.h1>
                <motion.p 
                initial={{ opacity: 0, y: 30, scaleY: 1.1 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: 30, scaleY: 1.1 }}
                transition={{ duration: 0.4, delay: 0.6, type: 'tween'}}
                className="text-2xl mt-4 font-secondary font-weight-400 text-text/75 max-w-md mx-auto">{t('page-not-found-description')}</motion.p>
                <motion.div 
                initial={{ opacity: 0, y: 30, scaleY: 1.1 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: 30, scaleY: 1.1 }}
                transition={{ duration: 0.4, delay: 0.8, type: 'tween'}}
                className="w-full flex items-center justify-center mt-7">
                    <Link to={"/" + i18n.language} className="inline-block">
                        <DefaultButton type="button" title={t('back-to-home')} icon={<ArrowLeft className="w-4 h-4" />} variant="dark" />
                    </Link>
                </motion.div>
            </motion.div>
            
        </div>
    )
   
}
