import RoutesBanner from '@/components/layouts/RoutesBanner'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api'
import { AnimatePresence } from 'motion/react'
import RouteLoader from '@/components/layouts/RouteLoader'
import RoteError from '@/components/layouts/RoteError'
import SVGBorders from '@/components/ui/SVGBorders'
import { useTranslation } from 'react-i18next'
import { useMemo, useState } from 'react'
import SectionSubtitle from '@/components/ui/SectionSubtitle'
import { motion } from 'motion/react'
import BottomSummary from '@/components/ui/BottomSummary'
import SVGWorlMap from '@/components/layouts/SVGWorlMap'
import ChapterMapBox from '@/components/layouts/ChapterMapBox'

export const Route = createFileRoute('/$lang/_lang/chapters/1')({
  component: RouteComponent,
})


function RouteComponent() {

  const { i18n } = useTranslation()
  const { data, isLoading, error, isRefetching, isFetching } = useQuery({
    queryKey: ['chapter-1', i18n.language],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60 * 24,
    enabled: true,
    queryFn: async () => {
      try {
        const res = await apiClient.get(i18n.language + '/chapter-1').json()
        // console.log('CHAPTER_1_DATA', res?.data)
        return res?.data
      } catch (error) {
        console.log('CHAPTER_1_DATA_ERROR', error)
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
                  image="/chapter-1-banner.png"
                  title={data?.introduction?.title}
                  description={data?.introduction?.subtitle}
                  no={'01'}
                />

                {
                  data?.introduction?.short_description ?
                    <section className="w-full overflow-hidden relative pb-10 md:pb-14 xl:pb-[5rem]">
                      <div className="container mx-auto md:px-0 px-5">
                        <SectionSubtitle 
                        title={data?.introduction?.short_description} 
                        description={data?.introduction?.description} 
                        />
                      </div>
                    </section>
                    :
                    null
                }

                <SVGWorlMap data={data} />
                {/* <ChapterMapBox data={data} /> */}
                <CountryListing data={data} />
                <Description2 data={data} />
                {data.summary &&
                  <BottomSummary data={data} image="/ch1summarybg.png" />
                }
              </div>

        }
      </AnimatePresence>
    </div>
  )
}


// function CoreTechnologies() {
//   return (
//     <section className='py-10 md:py-14 xl:py-[5rem]'>
//       <div className="mx-auto w-full items-center gap-8">
//         <div className='relative flex flex-col justify-center'>
//           <img src="/core-technologies.png" alt="coreTechnologies" className="max-w-[420px] object-cover" />
//           <div className='absolute top-20 bottom-0 -left-20 '>
//             <div className='relative'>
//               <img src='/ch1arrow.svg' alt="arrow1" className="pointer-events-none" />
//               <span className="text-sm lg:text-base absolute -left-34 top-0 right-0">Artificial Intelligence (AI)</span>
//             </div>
//           </div>
//           <div className='absolute top-20 bottom-0 -right-30'>
//             <div className='relative'>
//               <img src='/ch1arrow.svg' alt="arrow2" className="pointer-events-none scale-x-[-1]" />
//               <span className="text-sm lg:text-base absolute left-0 top-0 -right-96">Artificial Intelligence (AI)</span>
//             </div>
//           </div>
//           <div className='absolute bottom-24 -left-24 '>
//             <div className='relative'>
//               <img src='/ch1arrow.svg' alt="arrow3" className="pointer-events-none scale-y-[-1]" />
//               <span className="text-sm lg:text-base absolute -left-34 top-10 bottom-0 right-0">Artificial Intelligence (AI)</span>
//             </div>
//           </div>
//           <div className='absolute bottom-20 -right-30'>
//             <div className=''>
//               <img src='/ch1arrow.svg' alt="arrow4" className="pointer-events-none scale-x-[-1] scale-y-[-1] " />
//               <span className="text-sm lg:text-base">Artificial Intelligence (AI)</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }


function CountryListing({ data }: { data: any }) {

  const [active, setActive] = useState(null);
  const {i18n} = useTranslation()


  return (
    <section className='py-14 md:py-16 xl:py-[8rem] w-full md:hidden h-auto'>
      <div className=' container mx-auto md:px-0 px-5'>
        <motion.div 
        initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
        whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
        exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
        transition={{ duration: 1, delay: 0.7}}
        viewport={{ once: true, amount: 0.1 }}
        className="block w-full text-lg font-regular mb-8 text-center" >
            <p className="relative w-full text-center text-2xl font-secondary max-w-4xl mx-auto" >
                {i18n.language === 'en' ? <span>The following section presents an overview of selected countries and their national initiatives in this domain. <strong>Examples of Global Intelligent Lawmaking Practices</strong></span> : <span>نظرة عامة إلى مجموعة مختارة من الدول ومبادراتها الوطنية في هذا المجال</span>}
            </p>
        </motion.div>
        <div className='relative p-10'>
        <SVGBorders delay={0.4}/>
        {data.countries.map((country : any, ci : Number) => (
          <div key={ci} className="mx-2 flex flex-col items-center gap-5 md:px-0 px-5">
            <motion.button
              onTap={() => setActive(active === ci ? null : ci)}
              onBlur={() => setActive(null)}
              className="bg-gradient-to-r from-[#FFFFFF] to-[#F07067] bg-clip-text text-transparent font-semibold text-2xl text-center mb-3"
            >
              {country.title}
            </motion.button>

            <AnimatePresence>
              {active === ci && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 12, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="absolute left-0 right-0 z-20
                           rounded-xl p-4 text-sm text-white
                           bg-gradient-to-tr mt-3 from-[#022EE4] via-[#022EE4] via-[#03CBFF] to-[#03CBFF]"
                >
                  <div className="inline-flex items-center gap-2">
                    <img src={country?.country_image} alt={country?.title} className="w-10" />
                    <h2 className="text-2xl font-bold">{country?.title}</h2>
                  </div>

                  <span
                    className="text-xl"
                    dangerouslySetInnerHTML={{ __html: country?.description }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        </div>
      </div>
    </section>
  )
}


function Circle({ data }: { data: any }) {

  const { t } = useTranslation()

  return (
    <section className='py-14 md:py-16 xl:py-[8rem] w-full'>
      <div className='flex flex-col items-center justify-center min-h-[600px]'>
        <div className='relative'>
          <div className='absolute left-0 top-1/6 -translate-x-20'>
            <div className='relative'>
              <img src='/ch1arrow.svg' alt="arrow1" className="pointer-events-none " />
              <div className='absolute -translate-x-6/5 -top-3'>
                <h2 className='text-3xl'>{t("artificial-intelligence")}</h2>
              </div>
            </div>
          </div>
          <div className='absolute left-0 top-3/5 -translate-x-24'>
            <div className='relative'>
              <img src='/ch1arrow.svg' alt="arrow1" className="pointer-events-none scale-y-[-1]" />
              <div className='absolute -translate-x-4/4 top-8 bottom-0 w-full'>
                <h2 className='text-3xl font-semibold'>{t("advanced-data-analytics")}</h2>
              </div>
            </div>
          </div>

          <div className='relative'>
            <img src="/core-technologies.png" alt={"coretechnologies"} className='mix-blend-screen max-h-[500px] object-cover' />
            <div className='text-4xl text-center absolute left-0 right-0 top-0 bottom-0 flex flex-col items-center justify-center w-52 mx-auto'>
              {t("core-technologies")}
            </div>
          </div>


          <div className='absolute  left-0 translate-x-72 top-1/6 '>
            <div className='relative'>
              <img src='/ch1arrow.svg' alt="arrow1" className="pointer-events-none scale-x-[-1]" />
              <div className='absolute translate-x-62 rtl:translate-x-20 left-0 -top-1 bottom-0 w-full'>
                <h2 className='text-3xl font-semibold'>{t("automation")}</h2>
              </div>
            </div>
          </div>
          {/* <div className='absolute right-0 top-1/2 bottom-0 translate-x-28'>
            <div className='relative'>
              <img src='/ch1arrow.svg' alt="arrow1" className="pointer-events-none scale-x-[-1] " />
              <div className='absolute translate-x-6/5 rtl:translate-x-3/4 -top-2 bottom-0 w-full'>
                <h2 className='text-3xl font-semibold'>Advanced data analytics</h2>
              </div>
            </div>
          </div> */}

          <div className='absolute right-0 top-[60%] translate-x-2/4'>
            <div className='relative'>
              <img src='/ch1arrow.svg' alt="arrow1" className="pointer-events-none scale-x-[-1]  scale-y-[-1]" />
              <div className='absolute translate-x-62 top-8 bottom-0'>
                <h2 className='text-3xl font-semibold'>{t("digitsation")}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Description2({ data }: { data: any }) {

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
    <section className='py-10 md:py-14 xl:py-[5rem]'>
      <div className='relative container mx-auto md:px-0 px-5'>
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
              <div className="relative w-full text-center text-xl opacity-90" dangerouslySetInnerHTML={{ __html: html }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}




