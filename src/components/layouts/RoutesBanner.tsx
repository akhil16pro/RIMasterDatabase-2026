import { useId } from "react"
import { AnimatePresence, motion, useScroll,  useTransform} from "motion/react"
import SVGBorders from "../ui/SVGBorders"

interface RoutesBannerProps {
  image?: string
  title?: string
  description?: string
  no?: string
}

export default function RoutesBanner({
  image,
  title,
  description,
  no,
}: RoutesBannerProps) {

  const id = useId()
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 500], [1, 0])
  const scale = useTransform(scrollY, [0, 500], [1, 1.05])
  const translateY = useTransform(scrollY, [0, 500], [0, -70])

  const heroTranslateY = useTransform(scrollY, [0, 380], [0, -70])
  const heroScale = useTransform(scrollY, [0, 380], [1, 0.8])
  const heroOpacity = useTransform(scrollY, [0, 380], [1, 0])
  

  return (
    <section id={id} className="w-full h-[80dvh] overflow-hidden relative">

      <AnimatePresence mode={'wait'}>
        <motion.div 
        key={'routes-banner'}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 1.2, delay: 0.3, type: 'tween'}}
        style={{ opacity: opacity, y: translateY, scale: scale, transition: {delay: 0} }}
        className="absolute top-0 left-0 w-full h-full">
          {
            image ? <img src={image} alt="Routes Banner" className="w-full h-full object-cover" /> : null
          }
          
          <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-bg via-transparent to-bg pointer-events-none z-0" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-bg via-transparent to-[#00000057] pointer-events-none z-0" />
        </motion.div>
      </AnimatePresence>

      <motion.div 
      style={{ y: heroTranslateY, scale: heroScale, opacity: heroOpacity }}
      className="container mx-auto h-full flex items-center justify-center relative z-10">
          <motion.div 
          layout
          initial={{ opacity: 0, y: 50, scale: 1.05 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 1.05 }}
          transition={{ duration: 0.8, delay: 0.3, type: 'tween'}}
          className="block md:min-w-[45%] md:max-w-[65%] min-w-[80%] max-w-[80%] relative overflow-hidden">
            <SVGBorders />
           
            {
              no ? 
              <motion.div
              layout
              initial={{ opacity: 0, y: 50, scale: 1.05 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 1.05 }}
              transition={{ duration: 0.8, delay: 0.3, type: 'tween'}}
              className="absolute top-0 left-0 md:p-8 p-4 flex items-center justify-center">
                <span className="text-2xl font-medium text-secondary">{no}</span>
              </motion.div>
              :
              null
            }

            <motion.div 
            layout
            initial={{ clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)' }}
            animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
            exit={{ clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)' }}
            transition={{ duration: 0.6, type: 'tween', delay: 0.5}}
            className="flex flex-col items-center justify-center md:px-15 md:py-18 px-10 py-15 text-center">
              {title ? 
                <motion.h1 
                layout
                initial={{ opacity: 0, y: 50, scaleY: 1.2, skewY: 2 }}
                animate={{ opacity: 1, y: 0, scaleY: 1, skewY: 0 }}
                exit={{ opacity: 0, y: 50, scaleY: 1.2, skewY: 2 }}
                transition={{ duration: 0.8, type: 'tween', delay: 0.5}}
                className="md:text-7xl text-4xl font-bold text-center">{title}</motion.h1> 
                : 
                null
              }
              {description ? 
                <motion.p 
                layout 
                initial={{ opacity: 0, y: 60, scaleY: 1.2, skewY: 2 }}
                animate={{ opacity: 1, y: 0, scaleY: 1, skewY: 0 }}
                exit={{ opacity: 0, y: 60, scaleY: 1.2, skewY: 2 }}
                transition={{ duration: 0.8, type: 'tween', delay: 0.7}}
                className="md:text-4xl text-2xl font-regular mt-2 text-secondary">{description}</motion.p> 
                :
                null
              }
            </motion.div> 
          </motion.div>
      </motion.div>
    </section>
  )
}

