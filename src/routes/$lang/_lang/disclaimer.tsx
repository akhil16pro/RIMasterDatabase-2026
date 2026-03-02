import RoutesBanner from '@/components/layouts/RoutesBanner'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api'
import RouteLoader from '@/components/layouts/RouteLoader'
import RoteError from '@/components/layouts/RoteError'
import { AnimatePresence, motion } from 'motion/react'
import SectionSubtitle from '@/components/ui/SectionSubtitle'

export const Route = createFileRoute('/$lang/_lang/disclaimer')({
  component: RouteComponent,
})

function RouteComponent() {

  const { t, i18n } = useTranslation()
  const router = useRouter()

  const { data, isLoading, error, isRefetching } = useQuery({
    queryKey: ['disclaimer', i18n.language],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60 * 24,
    enabled: true,
    queryFn: async () => {
      try{
        const res = await apiClient.get( i18n.language + '/disclaimer').json()
        console.log('DISCLAIMER_DATA', res?.data)
        return res?.data
      }catch(error) {
        console.log('DISCLAIMER_DATA_ERROR', error)
        return null
      }
    },
  })

  return (
    <AnimatePresence mode={'wait'}>
      {
        ( isLoading || isRefetching ) ? <RouteLoader key="disclaimer-loader" /> : 
        error ? <RoteError key="disclaimer-error" /> : 
        <div key="disclaimer-content" className="flex flex-col items-center justify-center w-full h-full flex-1">
          <RoutesBanner 
            image="/about-banner.png"
            title={data?.introduction?.title}
          />
          <section className="w-full overflow-hidden relative pb-20">
            <div className="stopColor mx-auto md:px-0 px-5">
              <SectionSubtitle title={data?.introduction?.short_description} description={data?.introduction?.description}/>

              <motion.div
                initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
                whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
                transition={{ duration: 1, delay: 0.6 }}
                viewport={{ once: true, amount: 0.1 }}
                className='relative w-full flex items-center justify-center'
              >
                <div className="relative h-25 w-auto inline-block mt-8 invert-100">
                  <img src={i18n.language === 'en' ? '/GSOC-09.svg' : '/GSOC-04.svg'} alt="disclaimer-title" className='object-contain w-auto h-full' />
                </div>
                
              </motion.div>
            </div>
          </section>
      </div>
      }
    </AnimatePresence>
    
  )
}
