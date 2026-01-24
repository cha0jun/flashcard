import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import { MOCK_CARDS, MOCK_DECKS } from '../lib/mockData'
import { CardStack } from '../components/CardStack'
import { ChevronLeft, CheckCircle2, Flame, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Card } from '../types/index'

export const Route = createFileRoute('/decks/$deckId/study')({
    component: StudyPage,
})

type Rating = 1 | 2 | 3 | 4; // Again, Hard, Good, Easy

function StudyPage() {
    const { deckId } = Route.useParams()
    const navigate = useNavigate()

    // Select cards based on deckId
    const isAllDecks = deckId === 'all'
    const deck = isAllDecks
        ? { title: 'All Decks', id: 'all' }
        : MOCK_DECKS.find(d => d.id === deckId)

    const initialCards = isAllDecks
        ? MOCK_CARDS
        : MOCK_CARDS.filter(c => c.deck_id === deckId)

    const [queue, setQueue] = useState<Card[]>(initialCards)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFinished, setIsFinished] = useState(false)
    const [isFlipped, setIsFlipped] = useState(false)

    const currentCard = queue[currentIndex]

    const handleRating = useCallback((rating: Rating) => {
        if (!currentCard) return

        console.log(`Card ${currentCard.id} rated: ${rating}`)

        // SRS Logic Enhancement
        if (rating === 1) { // Again
            setQueue(prev => [...prev, currentCard])
        }

        setIsFlipped(false)
        if (currentIndex < queue.length - 1) {
            setCurrentIndex(prev => prev + 1)
        } else {
            setIsFinished(true)
        }
    }, [currentCard, currentIndex, queue.length])

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isFinished) return

            if (e.code === 'Space') {
                e.preventDefault()
                setIsFlipped(prev => !prev)
            }

            if (isFlipped) {
                if (e.key === '1') handleRating(1)
                if (e.key === '2') handleRating(2)
                if (e.key === '3') handleRating(3)
                if (e.key === '4') handleRating(4)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isFlipped, isFinished, handleRating])

    if (!deck) {
        return <div className="p-8 text-center text-slate-500">Deck not found.</div>
    }

    if (isFinished) {
        return (
            <div className="max-w-2xl mx-auto mt-12 text-center space-y-8 p-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-6"
                >
                    <div className="flex justify-center">
                        <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-12 h-12 text-brand-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Session Complete!</h2>
                    <p className="text-slate-500 text-lg">You've successfully reviewed all cards in <strong>{deck.title}</strong>.</p>

                    <div className="grid grid-cols-3 gap-4 py-8">
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-slate-900">7</div>
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Streak</div>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-slate-900">100%</div>
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Accuracy</div>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-slate-900">{initialCards.length}</div>
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total</div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate({ to: '/decks' })}
                        className="w-full py-4 bg-brand-600 text-white text-lg font-bold rounded-2xl hover:bg-brand-700 shadow-xl shadow-brand-100 transition-all hover:-translate-y-1 active:translate-y-0"
                    >
                        Back to My Decks
                    </button>
                </motion.div>
            </div>
        )
    }

    const progress = (currentIndex / queue.length) * 100

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col max-w-4xl mx-auto w-full px-4">
            <header className="flex items-center justify-between py-6">
                <button
                    onClick={() => navigate({ to: '/decks' })}
                    className="flex items-center text-slate-400 hover:text-slate-600 font-medium transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Exit
                </button>
                <div className="text-center flex-1">
                    <h1 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{deck.title}</h1>
                </div>
                <div className="text-sm font-bold text-slate-400 w-20 text-right">
                    {currentIndex + 1} / {queue.length}
                </div>
            </header>

            <div className="max-w-md mx-auto w-full mb-8">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-brand-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                <CardStack
                    cards={queue.slice(currentIndex)}
                    isFlipped={isFlipped}
                    onFlip={() => setIsFlipped(!isFlipped)}
                    onSwipe={(_, direction) => {
                        handleRating(direction === 'right' ? 3 : 1)
                    }}
                />
            </div>

            <footer className="py-12">
                <AnimatePresence mode="wait">
                    {!isFlipped ? (
                        <motion.button
                            key="show-answer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={() => setIsFlipped(true)}
                            className="w-full py-5 bg-white border-2 border-slate-200 text-slate-600 text-xl font-bold rounded-3xl hover:border-brand-500 hover:text-brand-600 transition-all shadow-sm"
                        >
                            Show Answer (Space)
                        </motion.button>
                    ) : (
                        <motion.div
                            key="rating-buttons"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-4 gap-4 md:gap-6"
                        >
                            {[
                                { label: 'Again', val: 1, color: 'text-red-600', bg: 'bg-red-50', hover: 'hover:bg-red-100' },
                                { label: 'Hard', val: 2, color: 'text-orange-600', bg: 'bg-orange-50', hover: 'hover:bg-orange-100' },
                                { label: 'Good', val: 3, color: 'text-emerald-600', bg: 'bg-emerald-50', hover: 'hover:bg-emerald-100' },
                                { label: 'Easy', val: 4, color: 'text-blue-600', bg: 'bg-blue-50', hover: 'hover:bg-blue-100' },
                            ].map((btn) => (
                                <button
                                    key={btn.val}
                                    onClick={() => handleRating(btn.val as Rating)}
                                    className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-3xl border-2 border-transparent transition-all shadow-sm ${btn.bg} ${btn.hover} group`}
                                >
                                    <span className={`text-2xl font-black mb-1 ${btn.color}`}>{btn.val}</span>
                                    <span className={`text-sm font-bold ${btn.color} uppercase tracking-tight`}>{btn.label}</span>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </footer>
        </div>
    )
}
