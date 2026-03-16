import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchDashboardStats } from '../lib/db'
import { supabase } from '../lib/supabase'
import { Play } from 'lucide-react'

export const Route = createFileRoute('/')({
    component: Dashboard,
})

function Dashboard() {
    const { data: user } = useQuery({
        queryKey: ['auth-user'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser()
            return user
        },
    })

    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-stats', user?.id],
        queryFn: () => fetchDashboardStats(user!.id),
        enabled: !!user,
    })

    const dueCount = stats?.dueCount ?? 0
    const dueText = isLoading
        ? 'Loading...'
        : dueCount === 0
            ? 'You\'re all caught up for today!'
            : `You have ${dueCount} card${dueCount === 1 ? '' : 's'} due for review today.`

    return (
        <div className="space-y-6">
            <header className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome back!</h1>
                    <p className="text-slate-500">{dueText}</p>
                </div>
                {dueCount > 0 && (
                    <Link
                        to="/decks/$deckId/study"
                        params={{ deckId: 'all' }}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        Study Now
                    </Link>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500">Decks</h3>
                    {isLoading ? (
                        <div className="mt-2 h-9 w-12 bg-slate-100 rounded animate-pulse" />
                    ) : (
                        <p className="mt-2 text-3xl font-bold text-slate-900">{stats?.deckCount ?? 0}</p>
                    )}
                </div>
                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500">Cards</h3>
                    {isLoading ? (
                        <div className="mt-2 h-9 w-12 bg-slate-100 rounded animate-pulse" />
                    ) : (
                        <p className="mt-2 text-3xl font-bold text-slate-900">{stats?.cardCount ?? 0}</p>
                    )}
                </div>
                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500">Streak</h3>
                    {isLoading ? (
                        <div className="mt-2 h-9 w-20 bg-slate-100 rounded animate-pulse" />
                    ) : (
                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {stats?.streak ?? 0} {stats?.streak === 1 ? 'Day' : 'Days'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
