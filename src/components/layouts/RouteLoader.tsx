import { motion } from "motion/react";

export default function RouteLoader() {
  return (
    <motion.div 
    initial={{ opacity: 0, scale: 1.2 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.2 }}
    transition={{ duration: 0.6, type: 'tween'}}
    className="w-full h-full flex items-center justify-center fixed top-0 left-0 z-9999 bg-bg">
      <div className="w-30 h-30 inline-flex items-center justify-center">
        <img src="/loading-icon.svg" alt="loading" className="w-full h-full object-cover" />
      </div>
    </motion.div>
  )
}
