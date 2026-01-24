import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    component: Dashboard,
})

function Dashboard() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-slate-900">Welcome back!</h1>
                <p className="text-slate-500">You have 12 cards due for review today.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Cards Placeholder */}
                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500">Decks</h3>
                    <p className="mt-2 text-3xl font-bold text-slate-900">5</p>
                </div>
                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500">Cards</h3>
                    <p className="mt-2 text-3xl font-bold text-slate-900">124</p>
                </div>
                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500">Streak</h3>
                    <p className="mt-2 text-3xl font-bold text-slate-900">7 Days</p>
                </div>
            </div>
        </div>
    )
}
