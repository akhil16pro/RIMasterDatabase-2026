import { routeTree } from './routeTree.gen'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NotFoundLayout from '@/components/layouts/NotFoundLayout'


const queryClient = new QueryClient()
// Router
const router = createRouter({
    routeTree,
    defaultNotFoundComponent: NotFoundLayout,
    context: {
        queryClient: queryClient,
    },
    scrollRestoration: true,
    scrollToTopSelectors: [() => document.getElementById('root')],
})

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute={['class', 'data-theme']} defaultTheme={'system'} >
                <RouterProvider router={router} key="app-router" />
            </ThemeProvider>
        </QueryClientProvider>
    )
}
