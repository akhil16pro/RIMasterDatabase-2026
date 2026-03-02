import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import NotFoundLayout from '@/components/layouts/NotFoundLayout'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api'
import { Toaster } from "@/components/ui/sonner"
import 'lenis/dist/lenis.css'
import { useTranslation } from 'react-i18next'
import GlobalError from '@/components/layouts/GlobalError'
import { atom, useSetAtom } from 'jotai'

export const settingsAtom = atom(null)

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundLayout,
  errorComponent: GlobalError
})

function RootComponent() {
  const { i18n } = useTranslation()
  const setSettings = useSetAtom(settingsAtom)
  const context = useQuery({
    queryKey: ['settings', i18n.language],
    staleTime: Infinity,
    enabled: true,
    queryFn: async () => {
      try{
        const res = await apiClient.get( i18n.language + '/settings').json()
        // console.log('SETTINGS_DATA', res?.data)
        setSettings(res?.data)
        return res?.data
      }catch(error) {
        console.log('SETTINGS_DATA_ERROR', error)
        return null
      }
    },
  })
  

  return (
    <React.Fragment>
      <title>{i18n.language === 'en' ? 'UAE Regulatory Intelligence' : 'الذكاء التشريعي – الإمارات العربية المتحدة'}</title>
      <Outlet />
      <Toaster />
    </React.Fragment>
  )
}
