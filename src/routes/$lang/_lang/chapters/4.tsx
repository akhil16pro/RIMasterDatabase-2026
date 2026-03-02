import RoutesBanner from '@/components/layouts/RoutesBanner'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api'
import { AnimatePresence } from 'motion/react'
import RouteLoader from '@/components/layouts/RouteLoader'
import RoteError from '@/components/layouts/RoteError'
import { useTranslation } from 'react-i18next'
import SVGBorders from '@/components/ui/SVGBorders'
import SectionSubtitle from '@/components/ui/SectionSubtitle'
import { motion } from 'motion/react'
import BottomSummary from '@/components/ui/BottomSummary'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { ScrollArea } from '@/components/ui/scroll-area'

export const Route = createFileRoute('/$lang/_lang/chapters/4')({
  component: RouteComponent,
})

function RouteComponent() {

  const { i18n } = useTranslation()
  const { data, isLoading, error, isRefetching, isFetching } = useQuery({
    queryKey: ['chapter-4', i18n.language],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60 * 24,
    enabled: true,
    queryFn: async () => {
      try {
        const res = await apiClient.get(i18n.language + '/chapter-4').json()
        console.log('CHAPTER_4_DATA', res?.data)
        return res?.data
      } catch (error) {
        console.log('CHAPTER_4_DATA_ERROR', error)
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
                  image="/chapter-4-banner.png"
                  title={data?.introduction?.title}
                  description={data?.introduction?.subtitle}
                  no={'04'}
                />

                <section className="w-full overflow-hidden relative pb-10 md:pb-14 xl:pb-[5rem]">
                  <div className="container mx-auto md:px-0 px-5">
                    {
                      data?.introduction?.description ?
                        <SectionSubtitle title={data?.introduction?.description} description={data?.introduction?.description_2} topDescription={data?.introduction?.short_description} />
                        :
                        null
                    }
                  </div>
                </section>

                <Objective data={data} />
                <Layer1 data={data} />
                <Layer2 data={data} />
                <Layer3 data={data} />
                {
                    data?.summary?.title ?
                    <BottomSummary data={data} image="/ch3summary.png" />
                    :
                    null
                  }
              </div>
        }
      </AnimatePresence>
    </div>
  )
}


function Objective({ data }: { data: any }) {
  const { t } = useTranslation();
  return (
    <section className='relative block w-full overflow-hidden py-20'>
      <div className='container mx-auto md:px-0 px-5'>
        <motion.h2
          initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
          whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true, amount: 0.1 }}
          className='text-3xl text-center max-w-4xl mx-auto' dangerouslySetInnerHTML={{ __html: data?.introduction?.second_description }} />
        <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-5'>
          {data.objectives.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
              whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
              transition={{ duration: 1, delay: 0.6 + (index * 0.05) }}
              viewport={{ once: true, amount: 0.1 }}
              className='border rounded-xl bg-text/15 flex flex-col gap-4 p-4 justify-center text-center items-center min-h-[250px]' key={index}>
              <div className="w-20 h-20 relative overflow-hidden">
                <img src={item.chapter4_image} alt={item.title} className='w-full h-full object-contain' />
              </div>
              <div className='flex flex-col gap-2 text-center mt-4'>
                <div className='text-2xl font-secondary opacity-90'>{item.title}</div>
                <div className='text-3xl font-bold'>{item.subtitle}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Layer1({ data }: { data: any }) {

  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState(null)

  const handleModalOpan = (data: any) => {
    setOpenModal(true)
    setModalData(data)
  }

  return (
    <section className='relative block w-full overflow-hidden py-20'>
      <div className='container mx-auto md:px-0 px-5'>
        <div className='relative grid gap-12 lg:grid-cols-2 items-center px-8  py-18 global-text-area-trim'>
          <SVGBorders delay={4} />
          <div className='flex flex-col gap-5'>
            <div>
              <div className='heading-section flex gap-6 mb-5'>
                <div className='w-[72px]'>
                  <img src="/foundation.svg" alt={data.layer1.title} className='w-full object-cover' />
                </div>
                <div className='flex flex-col gap-2'>
                  <h1 className='text-4xl bg-linear-to-r from-[#FFFFFF] to-[#03CBFF] bg-clip-text text-transparent'>{data.layer1.title} </h1>
                  <h3 className='text-2xl'>{data.layer1.subtitle} </h3>
                </div>
              </div>
              <div className='text-xl text-content-area' dangerouslySetInnerHTML={{ __html: data.layer1.description }} />
            </div>
            <button
              type='button'
              onClick={() => handleModalOpan(data?.layer1)}
              className="inline-flex items-center leading-relaxed gap-2 text-sm underline underline-offset-8 cursor-pointer "
            >
              <img src="/readmorebullet.svg" alt="Read More" />
              {t("read-more")}
            </button>
          </div>
          <img src="/foundation.png" alt={data.layer1.subtitle} className='mix-blend-screen max-h-[500px] object-cover mx-auto' />
        </div>
      </div>
      <Dialog open={openModal} onOpenChange={setOpenModal} >
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

function Layer2({ data }: { data: any }) {

  const { t } = useTranslation()


  return (
    <section className='relative block w-full overflow-hidden py-20'>
      <div className='container mx-auto relative'>
        <div className='hidden lg:block'>
          <SVGBorders delay={4} />
        </div>
        <div>
          <div className='heading-section flex gap-6 mb-5 justify-center'>
            <div className='w-[72px]'>
              <img src="/thebrain.svg" alt={"brain"} className='w-full object-cover' />
            </div>
            <div className='flex flex-col gap-2'>
              <h1 className='text-4xl bg-linear-to-r from-[#FFFFFF] to-[#03CBFF] bg-clip-text text-transparent'>{t("layer2_heading")}</h1>
              <h3 className='text-2xl'>{t("layer2_subheading")}</h3>
            </div>
          </div>
          <p className='text-3xl text-center'>{data.layer1?.layer2_title}</p>
        </div>
        <div className='flex-col items-center min-h-[650px] hidden lg:flex'>
          <div className='relative'>
            <div className="absolute left-0 inset-y-0 -translate-x-24 flex flex-col justify-center gap-12 items-end pointer-events-none">
              <div className='relative left-0 -top-1/4 -translate-x-0 flex items-center'>
                <div className='relative'>
                  <img src='/ch1arrow.svg' alt="arrow1" className="pointer-events-none" />
                  <div className='absolute -left-60 -top-1 rtl:-top-4 rtl:-left-64 bottom-0 w-full '>
                    <h2 className='text-3xl font-semibold'>{data.layer2[0]?.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: data.layer2[0]?.description }} />
                  </div>
                </div>
              </div>
              <div className='absolute left-0 top-1/2 rtl:top-3/4  bottom-0 translate-x-0 flex items-center'>
                <div className='relative'>
                  <img src='/ch1arrow.svg' alt="arrow1" className="pointer-events-none scale-y-[-1]" />
                  <div className='absolute -left-60 top-8 bottom-0 w-full'>
                    <h2 className='text-3xl font-semibold'>{data.layer2[1]?.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: data.layer2[1]?.description }} />
                  </div>
                </div>
              </div>
            </div>
            <img src="/Brain.png" alt={data.layer2.subtitle} className='mix-blend-screen max-h-[500px] object-cover' />
            <div className='absolute right-0 top-1/4 translate-x-24 flex items-center'>
              <div className='relative'>
                <img src='/ch1arrow.svg' alt="arrow1" className="pointer-events-none scale-x-[-1]" />
                <div className='absolute -right-64 -top-3 bottom-0 w-full'>
                  <h2 className='text-3xl font-semibold'>{data.layer2[2]?.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: data.layer2[2]?.description }} />
                </div>
              </div>
            </div>
            <div className='absolute right-0 top-1/2 bottom-0 translate-x-24 flex items-center'>
              <div className='relative'>
                <img src='/ch1arrow.svg' alt="arrow1" className="pointer-events-none scale-x-[-1] scale-y-[-1]" />
                <div className='absolute -right-62 top-8 bottom-0 w-full'>
                  <h2 className='text-3xl font-semibold'>{data.layer2[3]?.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: data.layer2[3]?.description }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='text-content-area block w-full text-xl text-center max-w-5xl mx-auto' dangerouslySetInnerHTML={{ __html: data.layer1?.layer2_description }}>
        </div>

      </div>
      <div className='lg:hidden mt-5 container mx-auto md:px-0 px-5'>
        <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 max-w-5xl mx-auto '>
          {data.layer2.map((l2: any, index: Number) => (
            <motion.div
              initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
              whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
              transition={{ duration: 1, delay: 0.6 + (index * 0.05) }}
              viewport={{ once: true, amount: 0.1 }}
              className='border rounded-xl bg-text/15 flex flex-col gap-4 p-4 justify-center text-center items-center min-h-[250px]' key={index}>
              <div className='flex flex-col gap-2 text-center mt-4'>
                <div className='text-2xl font-secondary opacity-90'>{l2.title}</div>
                <div dangerouslySetInnerHTML={{ __html: l2.description }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

  )
}

function Layer3({ data }: { data: any }) {

  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState(null)
  const { t } = useTranslation()

  const handleModalOpen = (data: any) => {
    setModalData(data)
    setShowModal(true)
  }


  return (
    <section className='relative block w-full overflow-hidden py-20'>
      <div className='container mx-auto md:px-0 px-5 relative'>
        <div className='relative grid gap-12 lg:grid-cols-2 items-center px-8  py-18 global-text-area-trim'>
          <SVGBorders delay={4} />
          <img src="/nervoussystem.png" alt={data.layer3.subtitle} className='mix-blend-screen max-h-[500px] object-cover mx-auto' />
          <div className='flex flex-col gap-5'>
            <div>
              <div className='heading-section flex gap-6 mb-5 '>
                <div className='w-[72px]'>
                  <img src="/nervoussystemheader.svg" alt={data.layer3.title} className='w-full object-cover' />
                </div>
                <div className='flex flex-col gap-2'>
                  <h1 className='text-4xl bg-linear-to-r from-[#FFFFFF] to-[#03CBFF] bg-clip-text text-transparent'>{data.layer3.title} </h1>
                  <h3 className='text-2xl'>{data.layer3.subtitle} </h3>
                </div>
              </div>
              <div className='text-xl text-content-area' dangerouslySetInnerHTML={{ __html: data.layer3.description }} />
            </div>
            <button
              type='button'
              onClick={() => handleModalOpen(data?.layer3)}
              className="inline-flex items-center leading-relaxed gap-2 text-sm underline underline-offset-8 cursor-pointer "
            >
              <img src="/readmorebullet.svg" alt="Read More" />
              {t("read-more")}
            </button>
          </div>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal} >
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

function Summary({ data }: { data: any }) {
  return (
    <section className='py-10 md:py-14 xl:py-[5rem]'>
      <div className='relative md:px-0 px-5 max-h-screen'>
        <img src="/ch3summary.png" alt="ch5summary" className='object-cover w-full' />
        <div className='md:absolute md:bottom-0 md:left-1/2 md:-translate-x-1/2 bg-[rgba(27,37,103,0.2)] backdrop-blur-[26.3px]  lg:max-w-4xl py-5 px-8 min-h-[300px] rounded-xl flex flex-col gap-4 justify-center'>
          <h2 className='text-4xl text-center bg-linear-to-br from-[#FFFFFF] to-[#03CBFF] bg-clip-text text-transparent'>
            {data.summary.title}
          </h2>
          <div className='text-center text-xl' dangerouslySetInnerHTML={{ __html: data.summary.description }} />
        </div>
      </div>
    </section>
  )
}

