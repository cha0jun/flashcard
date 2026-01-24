import { createRootRoute, Outlet, useNavigate, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Sidebar } from '../components/layout/Sidebar.tsx'
import { useAuth } from '../hooks/useAuth'
import { useEffect } from 'react'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    const { user, loading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

    useEffect(() => {
        if (!loading && !user && !isAuthPage) {
            navigate({ to: '/login' })
        }
    }, [user, loading, isAuthPage, navigate])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-brand-200 rounded-full mb-4"></div>
                    <div className="h-4 w-24 bg-slate-200 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            {user && !isAuthPage && <Sidebar />}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <Outlet />
            </main>
            {import.meta.env.DEV && (
                <TanStackRouterDevtools />
            )}
        </div>
    )
}
