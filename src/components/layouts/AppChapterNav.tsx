import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { FileText, Home, PenTool } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";

export default function AppChapterNav({ delay }: { delay: number }) {

    const { t, i18n } = useTranslation()

    const chapters = useMemo(()=> [
        {
          id: 1,
          title: t('home'),
          icon: <Home size={18}/>,
          href: '/' + i18n.language,
        },
        {
          id: 8,
          title: t('glossary'),
          icon: <FileText size={18}/>,
          href: '/' + i18n.language + '/glossary',
       },
        {
          id: 2,
          title: t('chapter'),
          href: '/' + i18n.language + '/chapters/1',
        },
        {
          id: 3,
          title: t('chapter'),
          href: '/' + i18n.language + '/chapters/2',
        },
        {
          id: 4,
          title: t('chapter'),
          href: '/' + i18n.language + '/chapters/3',
        },
        {
          id: 5,
          title: t('chapter'),
          href: '/' + i18n.language + '/chapters/4',
        },
        {
          id: 6,
          title: t('chapter'),
          href: '/' + i18n.language + '/chapters/5',
        },
        {
          id: 7,
          title: t('chapter'),
          href: '/' + i18n.language + '/chapters/6',
        },
        {
          id: 9,
          title: t('references'),
          icon: <PenTool size={18}/>,
          href: '/' + i18n.language + '/references',
        }
    ], [i18n.language])

    if(isMobile) return (
      <motion.div 
      initial={{ y: 100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.6, delay: delay }}
      className="fixed  bottom-0 left-0 w-full h-14 bg-black/65 backdrop-blur-sm border-t border-text/10 z-99">
        <nav className="relative block pointer-events-auto w-full h-full">
            <ul className="flex w-full h-full">
                {
                    chapters.map((chapter, index) => <MobileChapterNavItem key={'chapter-nav-item-' + chapter.id} chapter={chapter} index={index} />)
                }
            </ul>
        </nav>
      </motion.div>
    )

    return (
        <motion.div 
        className="fixed  bottom-0 ltr:right-0 rtl:left-0 z-50 p-5 flex flex-col gap-3 h-full justify-center  pointer-events-none" 
        initial={{ x: 100, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        exit={{ x: 100, opacity: 0 }}
        transition={{ duration: 0.6, delay: delay }}>
        <nav className="relative inline-block pointer-events-auto">
            <ul className="flex flex-col gap-3 items-end">
                {
                    chapters.map((chapter, index) => <ChapterNavItem key={'chapter-nav-item-' + chapter.id} chapter={chapter} index={index} />)
                }
            </ul>
        </nav>
        </motion.div>
    )
}


function ChapterNavItem({ chapter, index }: { chapter: any, index: number }) {

  const [isHover, setIsHover] = useState(false);

  const no = ()=> {
    return (index - 1) > 9 ? index  : '0' + (index - 1)
  }

  return (
      <motion.li 
      onHoverStart={()=> setIsHover(true)}
      onHoverEnd={()=> setIsHover(false)}
      transition={{ duration: 0.3, visualDuration: 0.2, bounce: 0.2,}}
      className="w-auto h-9 relative block">
          <Link 
          to={chapter.href}
          activeOptions={{ exact: true }}
          className={cn('inline-flex items-center justify-center w-full h-full rounded-lg bg-text/15 backdrop-blur-sm border border-text/10 text-secondary overflow-hidden relative [&.active]:text-text [&.active_.active-bg]:opacity-100 [&.hover-active]:text-text [&.hover-active_.hover-active-bg]:opacity-100', isHover ? 'active' : '')}
          >
          <span className="active-bg absolute left-0 top-0 w-full h-full bg-linear-to-br from-secondary to-primary z-0 transition-all duration-200 opacity-0"></span>
          {
            chapter.icon ? <span className="relative z-5 w-9 h-9 flex items-center justify-center">{chapter.icon}</span> : <span className="text-lg font-medium relative z-5 w-9 h-9 flex items-center justify-center">{no()}</span>
          }
          {
            !isMobile ? 
            <motion.span 
              key={chapter.title}
              initial={{ opacity: 0, x: 50,  width: 0 }} 
              animate={{ opacity: 1, x: 0,  width: isHover ? 120 : 0 }} 
              exit={{ opacity: 0, x: 50, width: 0, transition: {delay: 0 } }} 
              transition={{ duration: 0.2, delay: 0.05 }}
              layout
              className="relative inline-bloct text-text overflow-hidden whitespace-nowrap">
                {chapter.title}
            </motion.span> 
            :
            null
          }
          
          </Link>
      </motion.li>
  )
  
}

function MobileChapterNavItem({ chapter, index }: { chapter: any, index: number }) {

  const no = ()=> {
    return (index - 1) > 9 ? index  : '0' + (index - 1)
  }

  return (
    <li className="w-atuo flex-1 h-full relative block">
      <Link to={chapter.href} activeOptions={{ exact: true }} className="inline-flex items-center justify-center w-full h-full [&.active_.active-bg]:opacity-100">

        <span className="active-bg absolute left-0 top-0 w-full h-full bg-linear-to-br from-secondary to-primary z-0 transition-all duration-200 opacity-0"></span>
      
        {chapter.icon ? <span className="relative z-5 w-10 h-10 flex items-center justify-center">{chapter.icon}</span> : <span className="text-xl font-medium relative z-5 w-10 h-10 flex items-center justify-center">{no()}</span>}
      </Link>
    </li>
  )
}