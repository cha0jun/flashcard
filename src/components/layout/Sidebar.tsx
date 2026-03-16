import { Link, useNavigate } from '@tanstack/react-router'
import { LayoutDashboard, BookOpen, PlusCircle, Settings, LogOut, Play } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
    { label: 'Study', icon: Play, to: '/decks/$deckId/study', params: { deckId: 'all' } },
    { label: 'My Decks', icon: BookOpen, to: '/decks' },
    { label: 'Create Deck', icon: PlusCircle, to: '/create' },
]

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

            <nav className="flex-1 px-4 space-y-1.5 mt-2">
                {navItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        activeProps={{
                            className: 'bg-brand-50 text-brand-600 font-medium',
                        }}
                        className="flex items-center px-3 py-2.5 text-ink-500 font-medium hover:bg-paper-100 transition-colors rounded-xl text-sm"
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-paper-200 mt-auto">
                <button className="flex items-center w-full px-3 py-2.5 text-ink-500 font-medium hover:bg-paper-100 transition-colors rounded-xl text-sm mb-1 text-left">
                    <Settings className="w-5 h-5 mr-3 text-ink-400" />
                    Settings
                </button>
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
