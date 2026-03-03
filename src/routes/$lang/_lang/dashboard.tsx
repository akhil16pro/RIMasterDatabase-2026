import { createFileRoute } from '@tanstack/react-router'

import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api'
import RouteLoader from '@/components/layouts/RouteLoader'
import RoteError from '@/components/layouts/RoteError'
import { DefaultButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from 'motion/react'

import { Link } from "@tanstack/react-router";
import DashboardSidebar from "@/components/layouts/DashboardSidebar";
export const Route = createFileRoute('/$lang/_lang/dashboard')({
    component: RouteComponent,
})

function RouteComponent() {
    const { t, i18n } = useTranslation()

    let isLoading = false;
    let error = false;
    let isRefetching = false;
    const data = {
        title: "RI Unified Master Database",
        loginTitle: "Login/Sign up",

    }

    return (
        <AnimatePresence mode={'wait'}>
            {
                (isLoading || isRefetching) ? <RouteLoader key="dashboard-loader" /> :
                    error ? <RoteError key="dashboard-error" /> :
                        <div key="dashboard-content" className="flex flex-col items-center justify-center w-full h-full flex-1 p-10">

                            <section className="w-full relative mainWrapper ">
                                <DashboardSidebar delay={0} />
                            </section>
                        </div>
            }
        </AnimatePresence>
    )
}
