import { createFileRoute, Link } from '@tanstack/react-router'
import { MOCK_DECKS, MOCK_CARDS } from '../lib/mockData'
import { BookOpen, Play, Search, FolderPlus, MoreVertical } from 'lucide-react'

export const Route = createFileRoute('/decks/')({
    component: Decks,
})

function Decks() {
    return (
        <div className="space-y-8 max-w-5xl">
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 pb-2 border-b border-paper-200">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-ink-900">Deck Archive</h1>
                    <p className="text-ink-400 mt-1 text-sm">Manage and study your knowledge base.</p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                         <input 
                            type="text" 
                            placeholder="Search decks..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-paper-300 rounded-xl outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 focus:bg-white text-sm placeholder-ink-300 transition-all shadow-sm"
                         />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Create New Prompt Card */}
                 <Link to="/create" className="group bg-paper-100 border border-dashed border-paper-300 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[240px] hover:bg-white hover:border-brand-300 hover:shadow-sm transition-all cursor-pointer">
                     <div className="w-14 h-14 bg-brand-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FolderPlus className="w-6 h-6 text-brand-500" />
                     </div>
                     <h3 className="text-lg font-semibold text-ink-900 group-hover:text-brand-600 transition-colors">Create New Deck</h3>
                     <p className="text-sm text-ink-400 mt-1 text-center">Import PDF or specify a topic</p>
                 </Link>

                {MOCK_DECKS.map((deck) => {
                    const cardCount = MOCK_CARDS.filter(c => c.deck_id === deck.id).length
                    return (
                        <div key={deck.id} className="group bg-white border border-paper-200 rounded-2xl shadow-sm flex flex-col min-h-[240px] hover:shadow-md hover:border-paper-300 transition-all">
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-2.5 bg-accent-50 rounded-lg text-accent-600 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-semibold text-ink-500 px-2.5 py-1 bg-paper-100 rounded-full border border-paper-200">
                                        {cardCount} Cards
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-ink-900 mb-2 line-clamp-1">{deck.title}</h3>
                                <p className="text-sm text-ink-400 line-clamp-2 mb-6 flex-1 leadings-relaxed">
                                    {deck.description || 'No description available for this deck.'}
                                </p>

                                <div className="flex gap-3 mt-auto">
                                    <Link
                                        to="/decks/$deckId/study"
                                        params={{ deckId: deck.id }}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 transition-colors shadow-sm"
                                    >
                                        <Play className="w-4 h-4 fill-current" />
                                        Study
                                    </Link>
                                    <button className="px-3 py-2.5 bg-white border border-paper-200 text-ink-500 rounded-xl hover:bg-paper-50 transition-colors">
                                        <span className="sr-only">Options</span>
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
