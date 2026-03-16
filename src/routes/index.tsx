import { createFileRoute, Link } from '@tanstack/react-router'
import { Play, TrendingUp, BookOpen, Library } from 'lucide-react'

export const Route = createFileRoute('/')({
    component: Dashboard,
})

function Dashboard() {
    return (
        <div className="space-y-8 max-w-5xl">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-ink-900">Dashboard</h1>
                    <p className="text-ink-400 mt-1">Welcome back. Here's what's happening today.</p>
                </div>
                <div className="flex items-center bg-accent-50 text-brand-600 px-4 py-2 rounded-full border border-accent-100 text-sm font-medium w-fit">
                    <span className="w-2 h-2 rounded-full bg-brand-500 mr-2 animate-pulse"></span>
                    12 Cards Due
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white border border-paper-200 rounded-2xl shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-ink-500">Total Decks</h3>
                        <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-500">
                            <Library className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <p className="text-4xl font-bold text-ink-900">5</p>
                    </div>
                </div>
                
                <div className="p-6 bg-white border border-paper-200 rounded-2xl shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-ink-500">Cards Studied</h3>
                        <div className="w-10 h-10 rounded-full bg-accent-50 flex items-center justify-center text-accent-500">
                            <BookOpen className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <p className="text-4xl font-bold text-ink-900">124</p>
                        <p className="text-sm text-green-600 font-medium mt-1 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" /> +12 this week
                        </p>
                    </div>
                </div>
                
                <div className="p-6 bg-white border border-paper-200 rounded-2xl shadow-sm flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-600"></div>
                    <div className="absolute -right-4 -top-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                    <div className="relative z-10 flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-brand-100">Active Streak</h3>
                    </div>
                    <div className="relative z-10 flex items-end">
                        <p className="text-4xl font-bold text-white leading-none">7</p>
                        <span className="text-lg text-brand-100 font-medium ml-2 mb-1">days</span>
                    </div>
                </div>
            </div>

            <section className="bg-white border border-paper-200 rounded-2xl shadow-sm p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="relative z-10 max-w-xl">
                    <h2 className="text-2xl font-bold text-ink-900 mb-2">Ready for your daily review?</h2>
                    <p className="text-ink-500 mb-0">Your spaced repetition queue is ready. You have 12 cards pending review across 2 decks.</p>
                </div>
                <Link 
                    to="/decks/$deckId/study" 
                    params={{ deckId: 'all' }}
                    className="shrink-0 relative z-10 inline-flex items-center justify-center px-6 py-3 bg-brand-500 text-white font-medium rounded-xl hover:bg-brand-600 transition-colors shadow-sm w-full md:w-auto text-sm"
                >
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Start Session
                </Link>
            </section>
        </div>
    )
}
