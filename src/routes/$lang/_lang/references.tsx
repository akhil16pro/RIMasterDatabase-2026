import { apiClient } from '@/api'
import RoutesBanner from '@/components/layouts/RoutesBanner'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { AnimatePresence } from 'motion/react'
import RouteLoader from '@/components/layouts/RouteLoader'
import RoteError from '@/components/layouts/RoteError'
import SectionSubtitle from '@/components/ui/SectionSubtitle'
import parse from 'html-react-parser'
import { motion } from 'motion/react'
import SVGBorders from '@/components/ui/SVGBorders'
import { Activity } from 'react'

export const Route = createFileRoute('/$lang/_lang/references')({
  component: RouteComponent,
})

function RouteComponent() {

  const { t, i18n } = useTranslation()
  const router = useRouter()

  const { data, isLoading, error, isRefetching, isFetching } = useQuery({
    queryKey: ['references', i18n.language],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60 * 24,
    enabled: true,
    queryFn: async () => {
      try{
        const res = await apiClient.get( i18n.language + '/references').json()
        console.log('REFERENCES_DATA', res?.data)
        return res?.data
      }catch(error) {
        console.log('REFERENCES_DATA_ERROR', error)
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
            image="/glossary-banner.png"
            title={data?.introduction?.title}
          />

          <section className="w-full overflow-hidden relative">
            <div className="container mx-auto md:px-0 px-5">
              <div className="stopColor mx-auto md:px-0 px-5">
                {
                  data?.introduction?.description ? 
                  <SectionSubtitle title={data?.introduction?.description} />
                  :
                  null
                }

                <Activity mode={data?.objectives?.length > 1 ? 'visible' : 'hidden'}>
                  <div className="w-full my-15 grid md:grid-cols-2 gap-8 relative p-0 md:p-10">
                    <SVGBorders />
                  
                    {
                      data?.objectives?.map((item: any, index: number) => (
                        <motion.div 
                        initial={{ opacity: 0, y: 50, scaleY: 1.1 }}
                        whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: 50, scaleY: 1.1 }}
                        transition={{ duration: 1, delay: 0.6}}
                        viewport={{ once: true, amount: 0.05 }}
                        key={index} className="relative w-full block md:p-5 p-6">
                          <h3 className="text-4xl font-bold bg-linear-to-r from-[#FFFFFF] to-[#03CBFF] bg-clip-text text-transparent inline-block ">{item.title}</h3>
                          <div className="relative block text-content-area mt-2">
                          {parse(item?.description)}
                          </div>
                        </motion.div>
                      ))
                    }
                  </div>
                </Activity>

              </div>
            </div>
          </section>

        </div>
      }
      </AnimatePresence>
    </div>
  )
}
