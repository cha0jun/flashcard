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
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
            <div className="p-6">
                <h1 className="text-xl font-bold text-brand-700">Axonote</h1>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        activeProps={{
                            className: 'bg-brand-50 text-brand-700 font-semibold',
                        }}
                        className="flex items-center px-3 py-2 text-sm text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-200">
                <button className="flex items-center w-full px-3 py-2 text-sm text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                    <Settings className="w-5 h-5 mr-3" />
                    Settings
                </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors mt-1"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </button>
            </div>
        </aside>
    )
}
