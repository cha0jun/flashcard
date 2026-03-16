import { createRootRoute, Outlet, useNavigate, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Sidebar } from '../components/layout/Sidebar.tsx'
import { useAuth } from '../hooks/useAuth'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

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
            <div className="min-h-screen flex items-center justify-center bg-paper-100 text-ink-500 font-sans">
                <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 animate-spin text-brand-400 mb-4" />
                    <p className="text-sm font-medium text-ink-400">Loading workspace...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-paper-100 text-ink-500 font-sans">
            {user && !isAuthPage && <Sidebar />}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                <Outlet />
            </main>
            {import.meta.env.DEV && (
                <TanStackRouterDevtools />
            )}
        </div>
    )
}
