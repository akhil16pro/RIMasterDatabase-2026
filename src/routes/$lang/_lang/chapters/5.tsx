import RoutesBanner from '@/components/layouts/RoutesBanner'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api'
import { AnimatePresence, motion } from 'motion/react'
import RouteLoader from '@/components/layouts/RouteLoader'
import RoteError from '@/components/layouts/RoteError'
import SVGBorders from '@/components/ui/SVGBorders'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import BottomSummary from '@/components/ui/BottomSummary'
import SectionSubtitle from '@/components/ui/SectionSubtitle'
import { ScrollArea } from '@/components/ui/scroll-area'

export const Route = createFileRoute('/$lang/_lang/chapters/5')({
  component: RouteComponent,
})

function RouteComponent() {

  const { i18n } = useTranslation()
  const { data, isLoading, error, isRefetching, isFetching } = useQuery({
    queryKey: ['chapter-5', i18n.language],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60 * 24,
    enabled: true,
    queryFn: async () => {
      try {
        const res = await apiClient.get(i18n.language + '/chapter-5').json()
        console.log('CHAPTER_5_DATA', res?.data)
        return res?.data
      } catch (error) {
        console.log('CHAPTER_5_DATA_ERROR', error)
        return null
      }
    },
  })

  return (
    <div className="relative block w-full min-h-screen">
      <AnimatePresence mode={'wait'}>
        {
          (isLoading || isRefetching || isFetching) ? <RouteLoader key="about-loader" /> :
            error ? <RoteError key="about-error" /> :
              <div key="about-content" className="flex flex-col items-center justify-center w-full h-full flex-1">
                <RoutesBanner
                  image="/chapter-5-banner.png"
                  title={data?.introduction?.title}
                  description={data?.introduction?.subtitle}
                  no={'05'}
                />

                {
                  data?.introduction?.short_description ?
                    <section className="w-full overflow-hidden relative pb-10 md:pb-14 xl:pb-[5rem]">
                      <div className="container mx-auto md:px-0 px-5">
                        <SectionSubtitle title={data?.introduction?.short_description} description={data?.introduction?.description} />
                      </div>
                    </section>
                    :
                    null
                }

                <Skills data={data} />
                {
                  data?.summary?.title ?
                  <BottomSummary data={data} image="/ch5summary.png" />
                  :
                  null
                }
              </div>
        }
      </AnimatePresence>
    </div>
  )
}


function Skills({ data }: { data: any }) {

  const [open, setOpen] = useState(false)
  const [modalData, setModalData] = useState(null)
  const { t } = useTranslation();

  const handleModalOpen = (i) => {
    setModalData(i)
    setOpen(true)
  }

  return (
    <section className='relative block w-full overflow-hidden py-20'>
      <div className='container mx-auto md:px-0 px-5'>
        <motion.div
          initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
          whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true, amount: 0.1 }}
          className='py-10 global-text-area-trim' >
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12">
            {
              data?.principles?.map((skill, index) => (
                <SkillsItem key={index + 'skills'} skill={skill} index={index} />
              ))
            }
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function SkillsItem({skill, index} : {skill : any, index : Number}){

  const [open, setOpen] = useState(false)
  const {t} = useTranslation()
 
  return (
     <motion.div
        initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
        whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
        exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
        transition={{ duration: 1, delay: 0.6 + (index * 0.05) }}
        viewport={{ once: true, amount: 0.1 }}
        className='flex flex-col gap-2 p-5 border rounded-lg bg-text/8 backdrop-blur-lg'>
        {
          skill?.chapter5_image ?
            <div className="w-18 h-18 overflow-hidden border-none outline-none p-1 mb-2">
              <img src={skill.chapter5_image} alt="" className='w-full h-full object-contain' />
            </div>
            :
            null
        }

        <h3 className='text-3xl font-semibold bg-linear-to-r from-[#FFFFFF] to-[#03CBFF] bg-clip-text text-transparent inline-block'>{skill.title}</h3>
        <h4 className='text-xl [&_p]:text-text/80 text-content-area'>{skill.subtitle}</h4>
        <div className='text-xl font-secondary [&_p]:text-text/80 text-content-area' dangerouslySetInnerHTML={{ __html: skill.short_description }} />
        
        <Dialog open={open} onOpenChange={setOpen} >
          <DialogTrigger asChild>
            <button
              type='button'
              className="inline-flex items-center leading-relaxed gap-2 text-sm underline underline-offset-8 cursor-pointer "
            >
              <img src="/readmorebullet.svg" alt="Read More" />
              {t("read-more")}
            </button>
          </DialogTrigger>
          <DialogContent className="md:min-w-200 lg:min-w-300 lg:max-w-300">
            <DialogHeader>
              <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr] gap-3 md:gap-5">
                {
                  skill?.chapter5_image ?
                    <div className="w-18 h-18 overflow-hidden border-none outline-none p-1 mb-2">
                      <img src={skill.chapter5_image} alt="" className='w-full h-full object-contain' />
                    </div>
                    :
                    null
                }
                <div className="">
                  <DialogTitle>{skill?.title}</DialogTitle>
                  <DialogDescription>{skill?.subtitle}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <ScrollArea className="relative w-full block text-content-area max-h-[50vh] md:max-h-[67.5vh] mb-10">
              <div className="leading-relaxed text-xl [&_p]:!ml-0 text-content-area" dangerouslySetInnerHTML={{ __html: skill?.description }} />
            </ScrollArea>
          </DialogContent>
        </Dialog>

        
      </motion.div>
  )
}