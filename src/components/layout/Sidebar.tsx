import { Link, useNavigate } from '@tanstack/react-router'
import { LayoutDashboard, BookOpen, PlusCircle, Settings, LogOut, Play } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const linkClass = "flex items-center px-3 py-2 text-sm text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
const activeClass = "bg-brand-50 text-brand-700 font-semibold"

export function Sidebar() {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate({ to: '/login' })
    }

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-paper-200 font-sans z-10 shadow-sm">
            <div className="p-6">
                <Link to="/">
                    <h1 className="text-2xl font-bold tracking-tight text-ink-900 inline-block">Axonote</h1>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                <Link to="/" activeProps={{ className: activeClass }} className={linkClass}>
                    <LayoutDashboard className="w-5 h-5 mr-3" />
                    Dashboard
                </Link>
                <Link
                    to="/decks/$deckId/study"
                    params={{ deckId: 'all' }}
                    activeProps={{ className: activeClass }}
                    className={linkClass}
                >
                    <Play className="w-5 h-5 mr-3" />
                    Study
                </Link>
                <Link to="/decks" activeProps={{ className: activeClass }} className={linkClass}>
                    <BookOpen className="w-5 h-5 mr-3" />
                    My Decks
                </Link>
                <Link to="/create" activeProps={{ className: activeClass }} className={linkClass}>
                    <PlusCircle className="w-5 h-5 mr-3" />
                    Create Deck
                </Link>
            </nav>

            <div className="p-4 border-t border-slate-200">
                <Link to="/settings" activeProps={{ className: activeClass }} className={linkClass}>
                    <Settings className="w-5 h-5 mr-3" />
                    Settings
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2.5 text-ink-500 font-medium hover:bg-red-50 hover:text-red-600 transition-colors rounded-xl text-sm text-left"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
