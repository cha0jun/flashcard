import { createFileRoute, Link } from '@tanstack/react-router'
import { MOCK_DECKS, MOCK_CARDS } from '../lib/mockData'
import { BookOpen, Play } from 'lucide-react'

export const Route = createFileRoute('/decks')({
    component: Decks,
})

function Decks() {
    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Decks</h1>
                    <p className="text-slate-500">Manage and study your collections.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_DECKS.map((deck) => {
                    const cardCount = MOCK_CARDS.filter(c => c.deck_id === deck.id).length
                    return (
                        <div key={deck.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-brand-50 rounded-xl group-hover:bg-brand-100 transition-colors">
                                    <BookOpen className="w-6 h-6 text-brand-600" />
                                </div>
                                <span className="text-xs font-medium text-slate-400 px-2 py-1 bg-slate-50 rounded-full border border-slate-100">
                                    {cardCount} Cards
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-2">{deck.title}</h3>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-6">
                                {deck.description || 'No description available.'}
                            </p>

                            <div className="flex gap-3">
                                <Link
                                    to="/decks/$deckId/study"
                                    params={{ deckId: deck.id }}
                                    className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors border border-slate-100"
                                >
                                    <Play className="w-4 h-4 fill-current" />
                                    Study Now
                                </Link>
                                <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors">
                                    <span className="sr-only">Settings</span>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
