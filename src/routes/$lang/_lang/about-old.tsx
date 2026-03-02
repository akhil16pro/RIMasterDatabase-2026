import RoutesBanner from '@/components/layouts/RoutesBanner'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api'
import RouteLoader from '@/components/layouts/RouteLoader'
import RoteError from '@/components/layouts/RoteError'
import { AnimatePresence } from 'motion/react'
import SectionSubtitle from '@/components/ui/SectionSubtitle'

export const Route = createFileRoute('/$lang/_lang/about-old')({
  component: RouteComponent,
})

function RouteComponent() {

  const { t, i18n } = useTranslation()

  const { data, isLoading, error, isRefetching } = useQuery({
    queryKey: ['about', i18n.language],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60 * 24,
    enabled: true,
    queryFn: async () => {
      try{
        const res = await apiClient.get( i18n.language + '/about').json()
        // console.log('ABOUT_DATA', res?.data)
        return res?.data
      }catch(error) {
        console.log('ABOUT_DATA_ERROR', error)
        return null
      }
    },
  })


  return (
    <AnimatePresence mode={'wait'}>
      {
        ( isLoading || isRefetching ) ? <RouteLoader key="about-loader" /> : 
        error ? <RoteError key="about-error" /> : 
        <div key="about-content" className="flex flex-col items-center justify-center w-full h-full flex-1">
          <RoutesBanner 
            image="/about-banner.png"
            title={data?.introduction?.title}
            description={data?.introduction?.subtitle}
          />
          <section className="w-full overflow-hidden relative pb-20">
            <div className="stopColor mx-auto md:px-0 px-5">
              <SectionSubtitle title={data?.introduction?.short_description} description={data?.introduction?.description}/>
            </div>
          </section>
      </div>
      }
    </AnimatePresence>
    
  )
}
