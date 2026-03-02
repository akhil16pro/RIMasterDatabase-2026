import { apiClient } from '@/api'
import RoutesBanner from '@/components/layouts/RoutesBanner'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { AnimatePresence } from 'motion/react'
import RouteLoader from '@/components/layouts/RouteLoader'
import RoteError from '@/components/layouts/RoteError'
import SectionSubtitle from '@/components/ui/SectionSubtitle'
import parse from 'html-react-parser'
import { motion } from 'motion/react'
import SVGBorders from '@/components/ui/SVGBorders'
import { Activity } from 'react'

export const Route = createFileRoute('/$lang/_lang/glossary')({
  component: RouteComponent,
})

function RouteComponent() {

  const { t, i18n } = useTranslation()

  const { data, isLoading, error, isRefetching, isFetching } = useQuery({
    queryKey: ['glossary', i18n.language],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60 * 24,
    enabled: true,
    queryFn: async () => {
      try{
        const res = await apiClient.get( i18n.language + '/glossary').json()
        // console.log('GLOSSARY_DATA', res?.data)
        return res?.data
      }catch(error) {
        console.log('GLOSSARY_DATA_ERROR', error)
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
                  <SectionSubtitle title={data?.introduction?.description} description={null}/>
                  :
                  null
                }

                <Activity mode={data?.points?.length > 1 ? 'visible' : 'hidden'}>
                  <div className="w-full my-15 grid md:grid-cols-2 gap-8 relative p-10">
                    <SVGBorders />
                  
                    {
                      data?.points?.map((item, index) => (
                        <motion.div 
                        initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
                        whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
                        transition={{ duration: 1, delay: 0.6}}
                        viewport={{ once: true, amount: 0.1 }}
                        key={index} className="relative w-full block p-5">
                          <h3 className="text-2xl font-bold bg-linear-to-r from-[#FFFFFF] to-[#03CBFF] bg-clip-text text-transparent inline-block ">{item.title}</h3>
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

          <section className="w-full overflow-hidden relative flex items-center justify-center">
            <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, type: 'tween'}}
            className="absolute top-0 left-0 w-full h-full">
              <img src={'/glossary-section-bg.png'} alt="Routes Banner" className="w-full h-full object-cover opacity-50" />
              <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-bg via-transparent to-bg pointer-events-none z-0" />
            </motion.div>

            <div className="container  md:px-0 px-5 mx-auto relative z-10 flex items-center justify-center text-center flex-col gap-6 py-30">
              {
                data?.introduction?.second_title ? 
                <motion.h2 
                initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
                whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
                transition={{ duration: 1, delay: 0.6}}
                viewport={{ once: true, amount: 0.5 }}
                className="text-6xl font-bold block relative">{data?.introduction?.second_title}</motion.h2>
                :
                null
              }
              {
                data?.introduction?.second_description ?
                <motion.p 
                initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
                whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
                transition={{ duration: 1, delay: 0.6}}
                viewport={{ once: true, amount: 0.5 }}
                className="text-3xl font-medium bg-linear-to-r from-[#FFFFFF] to-[#03CBFF] bg-clip-text text-transparent inline-block relative max-w-4xl mx-auto" dangerouslySetInnerHTML={{ __html: data?.introduction?.second_description }}></motion.p>
                :
                null
              }
           
            </div>
          </section>

          <section className="w-full min-h-screen overflow-hidden relative">
            <div className="container mx-auto md:px-0 px-5 ">
              <Activity mode={data?.objectives?.length > 1 ? 'visible' : 'hidden'}>

                <div className="w-full mt-10 mb-25 grid md:grid-cols-2 gap-8 relative p-10">
                  <SVGBorders />
                  {
                    data?.objectives?.map((item, index) => (
                      <motion.div 
                      initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
                      whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
                      exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
                      transition={{ duration: 1, delay: 0.6}}
                      viewport={{ once: true, amount: 0.1 }}
                      key={index} className="relative w-full block p-5">
                        <h3 className="text-2xl font-bold bg-linear-to-r from-[#FFFFFF] to-[#03CBFF] bg-clip-text text-transparent inline-block ">{item.title}</h3>
                        <div className="relative block text-content-area mt-2">
                        {parse(item?.description)}
                        </div>
                      </motion.div>
                    ))
                  }
                </div>
              </Activity>

            </div>
          </section>

        </div>
      }
      </AnimatePresence>
    </div>
  )
}
