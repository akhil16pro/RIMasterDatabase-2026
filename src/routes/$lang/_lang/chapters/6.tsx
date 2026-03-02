import RoutesBanner from '@/components/layouts/RoutesBanner'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api'
import { AnimatePresence, motion } from 'motion/react'
import RouteLoader from '@/components/layouts/RouteLoader'
import RoteError from '@/components/layouts/RoteError'
import SVGBorders from '@/components/ui/SVGBorders'
import { useTranslation } from 'react-i18next'
import SectionSubtitle from '@/components/ui/SectionSubtitle'
import BottomSummary from '@/components/ui/BottomSummary'

export const Route = createFileRoute('/$lang/_lang/chapters/6')({
  component: RouteComponent,
})

function RouteComponent() {

  const { i18n } = useTranslation()
  const { data, isLoading, error, isRefetching, isFetching } = useQuery({
    queryKey: ['chapter-6', i18n.language],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60 * 24,
    enabled: true,
    queryFn: async () => {
      try{
        const res = await apiClient.get( i18n.language + '/chapter-6').json()
        return res?.data
      } catch (error) {
        console.log('CHAPTER_6_DATA_ERROR', error)
        return null
      }
    },
  })

  return (
    <div className="relative block w-full min-h-screen">
      <AnimatePresence mode={'wait'}>
        {
          ( isLoading || isRefetching || isFetching ) ? <RouteLoader key="about-loader" /> :
            error ? <RoteError key="about-error" /> :
              <div key="about-content" className="flex flex-col items-center justify-center w-full h-full flex-1">
                <RoutesBanner
                  image="/chapter-6-banner.png"
                  title={data?.introduction?.title}
                  description={data?.introduction?.subtitle}
                  no={'06'}
                />

                {
                  data?.introduction?.short_description ?
                  <section className="w-full overflow-hidden relative pb-10 md:pb-14 xl:pb-[5rem]">
                    <div className="container mx-auto md:px-0 px-5">
                      <SectionSubtitle title={data?.introduction?.short_description} description={data?.introduction?.description}/>
                    </div>
                  </section>
                  :
                  null
                }

                <Circle data={data} />
                <Objectives data={data} />
                {
                  data?.summary?.title ?
                  <BottomSummary data={data} image="/ch6summary.png" />
                  :
                  null
                }
              </div>
        }
      </AnimatePresence>
    </div>
  )
}


function Circle({ data }: { data: any }) {

  const { t } = useTranslation()

  return (
    <section className='py-14 md:py-16 xl:py-[8rem] w-full hidden lg:block'>
        <div className='flex flex-col items-center justify-center min-h-[600px]'>
          <div className='relative'>
            <div className='absolute left-0 top-1/6 -translate-x-20'>
              <div className='relative w-36'>
                <img src='/ch1arrow.svg' alt="arrow1" className="pointer-events-none " />
                <div className='absolute -translate-x-7/5 -top-3'>
                  <h2 className='text-3xl'>{t("ideation")}</h2>
                </div>
              </div>
            </div>
            <div className='absolute left-0 top-3/4 bottom-0 -translate-x-24'>
              <div className='relative w-36'>
                <img src='/ch1arrow.svg' alt="arrow1" className="pointer-events-none scale-y-[-1]" />
                <div className='absolute -translate-x-5/4 top-4 bottom-0 w-full'>
                  <h2 className='text-3xl font-semibold'>{t("continuous-monitoring")}</h2>
                </div>
              </div>
            </div>
            <img src="/ch6circle.png" alt={"circle"} className='mix-blend-screen max-h-[500px] object-cover' />


            <div className='absolute right-0 top-0 '>
              <div className='relative w-36'>
                <img src='/ch1arrow.svg' alt="arrow1" className="pointer-events-none scale-x-[-1]" />
                <div className='absolute translate-x-6/5 rtl:translate-x-3/4 -top-4 bottom-0 w-full'>
                  <h2 className='text-3xl font-semibold'>{t("evaluation")}</h2>
                </div>
              </div>
            </div>
            <div className='absolute right-0 top-1/2 bottom-0 translate-x-28'>
              <div className='relative w-36'>
                <img src='/ch1arrow.svg' alt="arrow1" className="pointer-events-none scale-x-[-1] " />
                <div className='absolute translate-x-6/5 rtl:translate-x-3/4 -top-2 bottom-0 w-full'>
                  <h2 className='text-3xl font-semibold'>{t("prototyping")}</h2>
                </div>
              </div>
            </div>

            <div className='absolute right-0 top-[95%] bottom-0 -translate-x-10'>
              <div className='relative w-36'>
                <img src='/ch1arrow.svg' alt="arrow1" className="pointer-events-none scale-x-[-1]  scale-y-[-1]" />
                <div className='absolute translate-x-6/5 rtl:translate-x-3/4 -top-2 bottom-0 w-full'>
                  <h2 className='text-3xl font-semibold'>{t("approval")}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  )
}

function Objectives({ data }: { data: any }) {

  return (
    <section className='relative block w-full overflow-hidden py-20'>
      <div className='container mx-auto md:px-0 px-5'>
      {data.objectives.map((item, index) => (
        <motion.div
        initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
        whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
        exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
        transition={{ duration: 1, delay: 0.6 + (index * 0.05)}}
        viewport={{ once: true, amount: 0.1 }}
        className='py-10 md:py-14 xl:py-[5rem]' key={index}>
          <div className={`relative grid grid-cols-1 ${item.length > 1 ? "lg:grid-cols-2" : "lg:grid-cols-1"}  gap-12 px-8  py-18`}>
            <SVGBorders delay={0.4} />

            {item.length > 1 && (<div className="hidden lg:block absolute left-1/2 top-0 h-full w-px bg-white/20 -translate-x-1/2 py-5" />)}
            {item.map((i, idx) => (
              <article className='flex flex-col justify-between' key={idx}>
                <div>
                  <div>
                    <h2 className="text-4xl font-semibold mb-4 bg-linear-to-r from-[#FFFFFF] to-[#03CBFF] bg-clip-text text-transparent">
                      {i?.title}
                    </h2>
                    <div className="text-xl leading-relaxed text-white/80 mb-4 text-content-area" dangerouslySetInnerHTML={{ __html: i?.description }} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </motion.div>
      ))}
      </div>
    </section>  
  )
}
