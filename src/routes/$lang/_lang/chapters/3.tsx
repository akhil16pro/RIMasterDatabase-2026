import { apiClient } from '@/api'
import RoteError from '@/components/layouts/RoteError'
import RouteLoader from '@/components/layouts/RouteLoader'
import RoutesBanner from '@/components/layouts/RoutesBanner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import SectionSubtitle from '@/components/ui/SectionSubtitle'
import SVGBorders from '@/components/ui/SVGBorders'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import BottomSummary from '@/components/ui/BottomSummary'
import { ScrollArea } from '@/components/ui/scroll-area'


export const Route = createFileRoute('/$lang/_lang/chapters/3')({
  component: RouteComponent,
})

function RouteComponent() {

  const { i18n } = useTranslation()
  const { data, isLoading, error, isRefetching, isFetching } = useQuery({
    queryKey: ['chapter-3', i18n.language],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60 * 24,
    enabled: true,
    queryFn: async () => {
      try {
        const res = await apiClient.get(i18n.language + '/chapter-3').json()
        console.log('CHAPTER_3_DATA', res?.data)
        return res?.data
      } catch (error) {
        console.log('CHAPTER_3_DATA_ERROR', error)
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
                  image="/chapter-3-banner.png"
                  title={data?.introduction?.title}
                  description={data?.introduction?.subtitle}
                  no={'03'}
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


                {/* <Objectives data={data} /> */}

                <BottomSummary data={data} image="/ch3summary.png" className="pt-20 md:pt-15">
                  <Skills data={data} />
                </BottomSummary>


              </div>
        }
      </AnimatePresence>
    </div>
  )
}


function Skills({ data }: { data: any }) {
  return (
    // <section className='py-10 md:py-14 xl:py-[5rem]'>
    <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 relative w-full mb-30'>
      {data.skills.map((skill: any, index: Number) => (
       <SkillsItem skill={skill} index={index} key={'skill-' + index}/>
      ))}
    </div>
    // </section>
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
          skill.skill_image ?
            <div className="w-18 h-18 overflow-hidden border-none outline-none p-1 mb-2">
              <img src={skill.skill_image} alt="" className='w-full h-full object-contain' />
            </div>
            :
            null
        }

        <h3 className='text-2xl font-semibold bg-linear-to-r from-[#FFFFFF] to-[#03CBFF] bg-clip-text text-transparent inline-block'>{skill.title}</h3>
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
              <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr] gap-3 md:gap-5 items-center">
                {
                  skill?.skill_image ?
                    <div className="w-18 h-18 overflow-hidden border-none outline-none p-1 mb-2">
                      <img src={skill.skill_image} alt="" className='w-full h-full object-contain' />
                    </div>
                    :
                    null
                }
                <div className="">
                  <DialogTitle>{skill?.title}</DialogTitle>
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

function Objectives({ data }: { data: any }) {

  const { t } = useTranslation();

  const [open, setOpen] = useState(false)
  const [modalData, setModalData] = useState(null)

  const handleModalOpen = (data) => {
    setOpen(true)
    setModalData(data)
  }

  return (
    <section className='relative block w-full overflow-hidden'>

      <div className="container mx-auto md:px-0 px-5">
        {data.objectives.map((obj : any, index : Number) => (
          <div className='py-10 md:py-14 xl:py-[5rem]' key={'334-objective-' + index}>
            <div className={`relative grid grid-cols-1 ${obj.length > 1 ? "lg:grid-cols-2" : "lg:grid-cols-1"}  gap-12 px-8  py-18`}>
              <SVGBorders delay={0.4} />

              {obj.length > 1 && (<div className="hidden lg:block absolute left-1/2 top-0 h-full w-px bg-white/20 -translate-x-1/2 py-5" />)}
              {obj.map((i :any, idx:Number) => (
                <motion.article
                  initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
                  whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                  viewport={{ once: true, amount: 0.1 }}
                  className='flex flex-col justify-between global-text-area-trim' key={'key-objective-' + idx}>
                  <div key={idx} >
                    <div>
                      <h2 className="text-4xl font-semibold mb-4 bg-linear-to-r from-[#FFFFFF] to-[#03CBFF] bg-clip-text text-transparent inline-block w-auto">
                        {i?.title}
                      </h2>
                      <div className="text-xl leading-relaxed mb-4 font-secondary [&_p]:text-text/80 text-content-area" dangerouslySetInnerHTML={{ __html: i?.short_description }} />
                    </div>
                   
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen} >
        <DialogContent className="md:min-w-200 lg:min-w-255 lg:max-w-255 flex flex-col sm:max-w-xl overflow-y-auto  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <DialogHeader>
            <DialogTitle>{modalData?.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="relative w-full block text-content-area max-h-[80vh]">
            <div className="leading-relaxed text-xl [&_p]:!ml-0 text-content-area" dangerouslySetInnerHTML={{ __html: modalData?.description }} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </section>
  )
}