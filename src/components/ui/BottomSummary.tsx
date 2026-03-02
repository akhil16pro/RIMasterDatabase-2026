import { cn } from '@/lib/utils'
import { motion } from 'motion/react'

export default function BottomSummary({data, children, image, className}: {data: any, children: React.ReactNode, image: string, className?: string}) {
  return (
    <section className={cn('relative block w-full pb-20 pt-100 overflow-hidden', className)}>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <img src={image} alt="city-image" className='object-cover w-full h-full opacity-50' />
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-bg via-transparent to-bg pointer-events-none z-0" />
        </div>
        <div className='relative container mx-auto flex flex-col gap-15 items-center justify-center w-full h-full md:px-0 px-5'>
            {children}
            <motion.div 
            initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
            whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
            transition={{ duration: 1, delay: 0.6}}
            viewport={{ once: true, amount: 0.1 }}
            className='relative bg-text/8 backdrop-blur-lg max-w-5xl md:p-15 p-8 rounded-xl flex flex-col gap-4 items-center justify-center'>
                
                {
                    data?.summary?.title ?
                    <motion.h2 
                    initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
                    whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
                    exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
                    transition={{ duration: 1, delay: 0.6}}
                    viewport={{ once: true, amount: 0.1 }}
                    className="text-5xl font-bold bg-linear-to-r from-[#FFFFFF] to-[#03CBFF] bg-clip-text text-transparent inline-block relative w-auto">
                        {data?.summary?.title}
                    </motion.h2>
                    :
                    null
                }
   
                {
                    data?.summary?.description ?
                    <motion.div 
                    initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
                    whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
                    exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
                    transition={{ duration: 1, delay: 0.6}}
                    viewport={{ once: true, amount: 0.1 }}
                    className='text-center text-xl font-secondary text-text/90' dangerouslySetInnerHTML={{ __html: data?.summary?.description }} />
                    :
                    null
                }        
                
            </motion.div>
        </div>
    </section>
  )
}
