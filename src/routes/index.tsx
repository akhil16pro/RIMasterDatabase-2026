import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  beforeLoad: async () => redirect({ to: '/en' })
})

function RouteComponent() {
  return <></>
}
