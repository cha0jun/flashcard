import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchCards, fetchAllUserCards, fetchDecks, insertReviewLog, upsertSRSMetadata } from '../lib/db'
import { computeNextSRS } from '../lib/srs'
import { supabase } from '../lib/supabase'
import { CardStack } from '../components/CardStack'
import { ChevronLeft, CheckCircle2, Flame, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Card } from '../types/index'

export const Route = createFileRoute('/decks/$deckId/study')({
    component: StudyPage,
})

type Rating = 1 | 2 | 3 | 4

function StudyPage() {
    const { deckId } = Route.useParams()
    const navigate = useNavigate()
    const isAllDecks = deckId === 'all'

    const { data: authUser } = useQuery({
        queryKey: ['auth-user'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser()
            return user
        },
    })

    // Fetch deck info
    const { data: deckInfo } = useQuery({
        queryKey: ['deck', deckId],
        queryFn: async () => {
            if (isAllDecks) return { id: 'all', title: 'All Decks', user_id: '', description: null }
            const decks = await fetchDecks(authUser!.id)
            return decks.find(d => d.id === deckId) ?? null
        },
        enabled: !!authUser,
    })

    // Fetch cards
    const { data: loadedCards = [], isLoading } = useQuery({
        queryKey: ['cards', deckId, authUser?.id],
        queryFn: () => isAllDecks ? fetchAllUserCards(authUser!.id) : fetchCards(deckId),
        enabled: !!authUser,
    })

    // Session state — initialised once cards are loaded
    const [queue, setQueue] = useState<Card[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFinished, setIsFinished] = useState(false)
    const [isFlipped, setIsFlipped] = useState(false)
    const [sessionStarted, setSessionStarted] = useState(false)

    // Track per-card first-attempt rating for accuracy (only counts first attempt)
    const [firstAttempts, setFirstAttempts] = useState<Map<string, Rating>>(new Map())
    // Track card start time for response_time_ms
    const [cardStartTime, setCardStartTime] = useState<number>(Date.now())

    useEffect(() => {
        if (loadedCards.length > 0 && !sessionStarted) {
            setQueue(loadedCards)
            setSessionStarted(true)
            setCardStartTime(Date.now())
        }
    }, [loadedCards, sessionStarted])

    const currentCard = queue[currentIndex]

    const handleRating = useCallback(async (rating: Rating) => {
        if (!currentCard || !authUser) return

        const responseTimeMs = Date.now() - cardStartTime

        // Track first attempt for accuracy calculation
        setFirstAttempts(prev => {
            if (!prev.has(currentCard.id)) {
                const next = new Map(prev)
                next.set(currentCard.id, rating)
                return next
            }
            return prev
        })

        // Persist review log (fire-and-forget, don't block UI)
        insertReviewLog({ card_id: currentCard.id, rating, response_time_ms: responseTimeMs }, authUser.id)
            .catch(console.error)

        // Update SRS metadata
        upsertSRSMetadata(computeNextSRS(null, currentCard.id, rating))
            .catch(console.error)

        // Queue management
        if (rating === 1) {
            setQueue(prev => [...prev, currentCard])
        }

        setIsFlipped(false)
        setCardStartTime(Date.now())

        if (currentIndex < queue.length - 1) {
            setCurrentIndex(prev => prev + 1)
        } else {
            setIsFinished(true)
        }
    }, [currentCard, currentIndex, queue.length, authUser, cardStartTime])

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

    if (isLoading || !sessionStarted) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            </div>
        )
    }

    if (!deckInfo) {
        return <div className="p-8 text-center text-slate-500">Deck not found.</div>
    }

    if (loadedCards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <p className="text-xl font-semibold text-slate-700">No cards in this deck yet.</p>
                <p className="text-slate-400">Create some cards to start studying.</p>
            </div>
        )
    }

    // Compute session accuracy from first attempts
    const totalFirstAttempts = firstAttempts.size
    const goodFirstAttempts = Array.from(firstAttempts.values()).filter(r => r >= 3).length
    const accuracy = totalFirstAttempts > 0
        ? Math.round((goodFirstAttempts / totalFirstAttempts) * 100)
        : 0

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
                    <p className="text-slate-500 text-lg">You've successfully reviewed all cards in <strong>{deckInfo.title}</strong>.</p>

                    <div className="grid grid-cols-3 gap-4 py-8">
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-slate-900">{accuracy}%</div>
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Accuracy</div>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-slate-900">{goodFirstAttempts}</div>
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Correct</div>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-slate-900">{loadedCards.length}</div>
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
                    <h1 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{deckInfo.title}</h1>
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
