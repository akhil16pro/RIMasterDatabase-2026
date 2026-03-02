
import type { ErrorComponentProps } from '@tanstack/react-router'
import { motion } from "motion/react";

function GlobalError({ error, reset }: ErrorComponentProps) {
  return (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5, delay: 0.2, type: 'tween' }}
    className="w-full h-screen overflow-hidden flex flex-col items-center justify-center">

        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
            <img src="/bg-not-found.png" alt="Background Image" className="w-full h-full object-cover z-0 pointer-events-none grayscale-100" />
        </div>

        <div className="relative flex-1 flex flex-col items-center justify-center w-full h-full">
            <div className="flex flex-col items-center justify-center gap-3 p-6 w-100 rounded-4xl glass-bg">

            <div className="relative flex w-full items-center justify-center mb-8 mt-10">

                <div className="h-[15em] w-auto relative overflow-hidden items-center justify-center inline-flex">
                <img src="/app-error.png" alt="Application Error" className="h-full scale-125 w-[80%] opacity-80 dark:invert-0 object-contain" />
                </div>

            </div>

            <h1 className="text-5xl font-medium text-center text-text/75"><span className="text-text">Application</span> <span className="text-red-400">Crashed</span></h1>
            {
                error?.message && 
                <div className="w-full rounded-xl p-3 bg-bg/50 border-2 border-dashed border-text/30 mt-2 mb-4">
                    <p className="text-base font-regular text-red-400/80 w-full text-center">{error?.message}</p>
                </div>
            }
            
        </div>

    </div>

    </motion.div>
  )
}

export default GlobalError