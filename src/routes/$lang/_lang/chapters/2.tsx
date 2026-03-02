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
import { useMemo } from 'react'
import BottomSummary from '@/components/ui/BottomSummary'
import i18n from '@/lang'


export const Route = createFileRoute('/$lang/_lang/chapters/2')({
  component: RouteComponent,
})

function RouteComponent() {


  const { i18n } = useTranslation()
  const { data, isLoading, error, isRefetching, isFetching } = useQuery({
    queryKey: ['chapter-2', i18n.language],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60 * 24,
    enabled: true,
    queryFn: async () => {
      try {
        const res = await apiClient.get(i18n.language + '/chapter-2').json()
        // console.log('CHAPTER_2_DATA', res?.data)
        return res?.data
      } catch (error) {
        console.log('CHAPTER_2_DATA_ERROR', error)
        return null
      }
    },
  })


  return (
    <div className='relative block w-full min-h-screen'>
      <AnimatePresence mode={'wait'}>
        {
          (isLoading || isRefetching || isFetching) ? <RouteLoader key="about-loader" /> :
            error ? <RoteError key="about-error" /> :
              <div key="about-content" className="flex flex-col items-center justify-center w-full h-full flex-1">
                <div className='w-full relative pb-10 md:pb-14 xl:pb-[5rem]'>
                  <RoutesBanner
                    image="/chapter-2-banner.png"
                    title={data?.introduction?.title}
                    description={data?.introduction?.subtitle}
                    no={'02'}
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


                </div>
                <Objective data={data} />
                <section className='relative block w-full overflow-hidden h-250'>
                  <img src="/chapter2cityimage.png" alt="city-image" className='object-cover w-full h-full opacity-50' />
                  <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-bg via-transparent to-bg pointer-events-none z-0" />
                </section>
                <CityImageContent data={data} />
                <UAEPerformance data={data} />
                {
                  data?.summary?.title ?
                  <BottomSummary data={data} image="/ch2summary.png" />
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
  return (
    <section className='relative block w-full overflow-hidden'>
      <div className="container mx-auto md:px-0 px-5">
        <div className='grid gap-6 
                  grid-cols-1 
                  sm:grid-cols-2 
                  lg:grid-cols-4 px-10'>
          {data.objectives.map((obj: any, idx: number) => (
            <motion.div
              initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
              whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
              transition={{ duration: 1, delay: 0.6 + (idx * 0.05) }}
              viewport={{ once: true, amount: 0.1 }}
              key={idx + 'objective-1'}
              className='bg-text/15  max-h-[350px] border rounded-xl px-4 py-8 text-center flex flex-col gap-2'>
              <h2 className='text-8xl bg-linear-to-r from-secondary to-primary bg-clip-text text-transparent font-bold'>
                {`0${idx + 1}`}
              </h2>
              <h3 className='text-2xl'>
                {obj.title}
              </h3>
              <div className='text-nase font-secondary opacity-90' dangerouslySetInnerHTML={{ __html: obj.description }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CityImageContent({ data }: { data: any }) {

  const convertPTagsToDiv = (html: string): string[] => {
    if (!html) return []
    // Convert opening <p> tags (with or without attributes) to <div>
    let converted = html.replace(/<p\s*([^>]*)>/gi, '<div$1>')
    // Convert closing </p> tags to </div>
    converted = converted.replace(/<\/p>/gi, '</div>')
    // Convert self-closing <p /> tags to <div />
    converted = converted.replace(/<p\s*([^>]*)\s*\/>/gi, '<div$1 />')

    // Parse HTML and extract individual div elements
    const parser = new DOMParser()
    const doc = parser.parseFromString(converted, 'text/html')
    const divs = Array.from(doc.body.children)

    // Return array of HTML strings for each div element
    return divs.map(div => div.outerHTML)
  }

  const descriptionContent = useMemo(() => {
    const html = data?.introduction?.description_2
    if (!html) return []
    return convertPTagsToDiv(html)
  }, [data?.introduction?.description_2])

  return (
    <section className='relative block w-full overflow-hidden'>
      <div className='container mx-auto md:px-0 px-5'>
        <div className="relative block max-w-4xl mx-auto text-center p-10">
          <SVGBorders delay={0.4} />
          {descriptionContent.map((html: string, index: number) => (
            <motion.div
              initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
              whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
              transition={{ duration: 1, delay: 0.7 }}
              viewport={{ once: true, amount: 0.1 }}
              className="block w-full text-lg font-regular mb-8 text-text/80" key={index + 'description-2'}>
              <div className="relative w-full text-center text-xl opacity-90 font-secondary" dangerouslySetInnerHTML={{ __html: html }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function UAEPerformance({ data }: { data: any }) {

  const { t } = useTranslation()

  return (
    <section className="w-full min-h-screen overflow-hidden relative pt-50">
      <div className="container mx-auto md:px-0 px-5">

        <motion.h2 
        initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
        whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
        exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
        transition={{ duration: 1, delay: 0.6}}
        viewport={{ once: true, amount: 0.1 }}
        className='text-5xl mb-5 text-center bg-linear-to-br from-[#FFFFFF] to-[#03CBFF] bg-clip-text text-transparent'>
          {t('the-uae-s-performance-across-major-global-indices')}
        </motion.h2>

        <div className='relative block w-full overflow-hidden p-10 mt-8'>
          <SVGBorders delay={0.4} />
          <div className='relative grid gap-10 grid-cols-1 lg:grid-cols-2'>
            {/* <div className="hidden lg:block absolute left-1/2 top-0 h-full w-px bg-white/20 -translate-x-1/2" /> */}
            {Array.isArray(data?.indices) && data?.indices?.map((card: any, index: Number) => (
              <motion.div
                initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
                whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
                transition={{ duration: 1, delay: 0.6 }}
                viewport={{ once: true, amount: 0.1 }}
                key={index + 'card-1'}
                className={`rounded-xl 
                  p-5 
                    grid
                    grid-cols-1
                    ${i18n.language === "en" ? "md:grid-cols-[1fr_auto]" : "md:grid-cols-[auto_1fr]"}
                    items-center
                    gap-6
                    md:gap-8
                    rounded-xl 
                    bg-gradient-to-r
                    from-[#06085D]
                    to-[#6980de36]
                    text-center
                    md:text-left
                  `}>
                <div className={`order-2 ${i18n.language === "ar" ? "md:order-2 text-right" : "md:order-1"}`} >
                  <h2 className='text-2xl font-bold'>{card.title}</h2>
                  <div className='text-base block text-text/90 font-secondary text-secondary [&_p]:text-secondary mt-1' dangerouslySetInnerHTML={{ __html: card.description }} />
                </div>
                <div className={`text-center md:ms-auto order-1 ${i18n.language === "ar" ? "md:order-1" : "md:order-2"}`}>
                  <div className='w-16 h-16 flex items-center justify-center mx-auto text-4xl border font-semibold  border-current rounded-full'>
                    {card.indices_number}
                  </div>
                  <p>{t('globally')}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}

