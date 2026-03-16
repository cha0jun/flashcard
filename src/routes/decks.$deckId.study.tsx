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
        return (
            <div className="p-8 text-center bg-brand-50 rounded-xl m-8 space-y-4 max-w-sm mx-auto mt-24 border border-brand-100 shadow-sm">
                <p className="font-medium text-brand-800">Deck not found.</p>
                <button
                    onClick={() => navigate({ to: '/decks' })}
                    className="px-6 py-2.5 bg-white border border-brand-200 text-brand-700 font-medium rounded-lg hover:bg-brand-100 transition-colors shadow-sm"
                >
                    Return to Decks
                </button>
            </div>
        )
    }

    if (isFinished) {
        return (
            <div className="max-w-2xl mx-auto mt-12 text-center p-6 bg-white rounded-3xl shadow-sm border border-paper-200">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-8"
                >
                    <div className="flex justify-center pt-8">
                        <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-12 h-12 text-brand-500" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-ink-900 tracking-tight">Session Complete</h2>
                        <p className="text-ink-500 mt-2">
                            You've reviewed all cards in <strong className="font-semibold text-ink-900">{deck.title}</strong>.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 px-4">
                        <div className="p-5 bg-paper-50 rounded-2xl flex flex-col items-center">
                            <Flame className="w-6 h-6 text-orange-500 mb-2" />
                            <div className="text-3xl font-bold text-ink-900 mb-1">7</div>
                            <div className="text-xs font-semibold text-ink-400 uppercase tracking-wide">Day Streak</div>
                        </div>
                        <div className="p-5 bg-paper-50 rounded-2xl flex flex-col items-center">
                            <Zap className="w-6 h-6 text-brand-500 mb-2" />
                            <div className="text-3xl font-bold text-ink-900 mb-1">100<span className="text-sm ml-1 text-ink-400">%</span></div>
                            <div className="text-xs font-semibold text-ink-400 uppercase tracking-wide">Accuracy</div>
                        </div>
                        <div className="p-5 bg-brand-50 rounded-2xl flex flex-col items-center">
                            <CheckCircle2 className="w-6 h-6 text-brand-500 mb-2" />
                            <div className="text-3xl font-bold text-brand-700 mb-1">{initialCards.length}</div>
                            <div className="text-xs font-semibold text-brand-600/80 uppercase tracking-wide">Cards Reviewed</div>
                        </div>
                    </div>

                    <div className="pb-8">
                        <button
                            onClick={() => navigate({ to: '/decks' })}
                            className="w-full md:w-auto px-8 py-3 bg-brand-500 text-white font-medium rounded-xl hover:bg-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all shadow-sm"
                        >
                            Return to Archive
                        </button>
                    </div>
                </motion.div>
            </div>
        )
    }

    const progress = (currentIndex / queue.length) * 100

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col max-w-3xl mx-auto w-full px-4 md:px-0 font-sans">
            <header className="flex items-center justify-between py-6">
                <button
                    onClick={() => navigate({ to: '/decks' })}
                    className="flex items-center text-ink-500 font-medium hover:text-ink-700 transition-colors text-sm p-3 -m-3"
                    aria-label="Exit study mode"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Exit
                </button>
                <div className="text-center">
                    <h1 className="text-sm font-semibold text-ink-900 bg-white px-4 py-1.5 rounded-full border border-paper-200 shadow-sm">{deck.title}</h1>
                </div>
                <div className="text-sm font-medium text-ink-400 bg-white px-3 py-1 mb-0 border border-paper-200 shadow-sm rounded-full">
                    {currentIndex + 1} <span className="text-paper-300 mx-1">/</span> {queue.length}
                </div>
            </header>

            <div className="w-full mb-8 h-2 bg-paper-200 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-brand-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative">
                <CardStack
                    cards={queue.slice(currentIndex)}
                    isFlipped={isFlipped}
                    onFlip={() => setIsFlipped(!isFlipped)}
                    onSwipe={(_, direction) => {
                        handleRating(direction === 'right' ? 3 : 1)
                    }}
                />
            </div>

            <footer className="py-8 mt-auto">
                <AnimatePresence mode="wait">
                    {!isFlipped ? (
                        <motion.button
                            key="show-answer"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            onClick={() => setIsFlipped(true)}
                            className="w-full py-4 bg-brand-50 text-brand-600 border border-brand-200 font-semibold rounded-xl hover:bg-brand-100 transition-colors shadow-sm"
                        >
                            Show Answer <span className="text-brand-600 ml-2 font-normal text-sm border border-brand-200 px-2 py-0.5 rounded-md bg-white">Space</span>
                        </motion.button>
                    ) : (
                        <motion.div
                            key="rating-buttons"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
                        >
                            {[
                                { label: 'Again', val: 1, color: 'text-red-600', bg: 'bg-red-50', hover: 'hover:bg-red-100', border: 'border-red-100' },
                                { label: 'Hard', val: 2, color: 'text-orange-600', bg: 'bg-orange-50', hover: 'hover:bg-orange-100', border: 'border-orange-100' },
                                { label: 'Good', val: 3, color: 'text-brand-600', bg: 'bg-brand-50', hover: 'hover:bg-brand-100', border: 'border-brand-100' },
                                { label: 'Easy', val: 4, color: 'text-green-600', bg: 'bg-green-50', hover: 'hover:bg-green-100', border: 'border-green-100' },
                            ].map((btn) => (
                                <button
                                    key={btn.val}
                                    onClick={() => handleRating(btn.val as Rating)}
                                    className={`flex flex-col items-center justify-center py-4 border rounded-xl transition-all shadow-sm ${btn.bg} ${btn.hover} ${btn.border} group`}
                                >
                                    <span className={`text-base font-semibold ${btn.color}`}>{btn.label}</span>
                                    <span className={`text-xs mt-1 opacity-70 ${btn.color} border border-current px-1.5 rounded`}>
                                        {btn.val}
                                    </span>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </footer>
        </div>
    )
}
